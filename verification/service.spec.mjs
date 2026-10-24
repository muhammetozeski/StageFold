import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/[[path]].js';
import {validateFilm} from '../server/film.mjs';

class SqliteD1{
 constructor(){this.native=new DatabaseSync(':memory:');}
 prepare(sql){const db=this;return {sql,values:[],bind(...values){this.values=values;return this;},async first(){return db.native.prepare(sql).get(...this.values)||null;},async all(){return {results:db.native.prepare(sql).all(...this.values)};},async run(){const r=db.native.prepare(sql).run(...this.values);return {success:true,meta:{changes:Number(r.changes)}};}};}
 async batch(statements){this.native.exec('BEGIN IMMEDIATE');try{const result=[];for(const s of statements){const r=this.native.prepare(s.sql).run(...s.values);result.push({success:true,meta:{changes:Number(r.changes)}});}this.native.exec('COMMIT');return result;}catch(e){this.native.exec('ROLLBACK');throw e;}}
}
const db=new SqliteD1();db.native.exec(await readFile(new URL('../schema/001-stagefold.sql',import.meta.url),'utf8'));
const env={DB:db,RATE_SALT:'isolated-test-salt',MODERATION_KEY:'isolated-moderation-key'},origin='https://stagefold.example';let checks=0;
const check=(value,name)=>{assert.ok(value,name);checks++;console.log(`PASS ${name}`);};
async function call(path,body=null,{cookie=null,foreign=false,headers={},ip='192.0.2.42'}={}){const response=await onRequest({env,request:new Request(origin+'/api/'+path,{method:body===null?'GET':'POST',headers:{Origin:foreign?'https://foreign.example':origin,'CF-Connecting-IP':ip,...(body===null?{}:{'Content-Type':'application/json'}),...(cookie?{Cookie:cookie}:{}),...headers},body:body===null?undefined:JSON.stringify(body)})});return {status:response.status,body:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};}
const original=JSON.parse(await readFile(process.argv[2],'utf8'));
check(validateFilm(original).duration===28000,'actual C# starter satisfies independent server vocabulary and timing');
check((await call('accounts',{alias:'Not created'},{foreign:true})).status===403,'foreign-origin account write denied');
const owner=await call('accounts',{alias:'Isolated owner'}),editor=await call('accounts',{alias:'Isolated editor'}),viewer=await call('accounts',{alias:'Isolated viewer'}),stranger=await call('accounts',{alias:'Isolated stranger'});
check(owner.status===201&&owner.body.recoveryKey.length===43,'real secret-backed account and recovery key');
const auth={cookie:owner.cookie},edit={cookie:editor.cookie},view={cookie:viewer.cookie},other={cookie:stranger.cookie};
check((await call('account',null,auth)).body.account.id===owner.body.account.id,'session reads actual account');
check(!JSON.stringify(db.native.prepare('SELECT * FROM sf_accounts').all()).includes(owner.body.recoveryKey),'database stores recovery hash, not key');
const requestId=crypto.randomUUID(),created=await call('projects',{requestId,film:original},auth);check(created.status===201,'actual shared film persisted');const p=created.body.project,projectId=p.id;
check((await call('projects',{requestId,film:original},auth)).body.project.id===projectId,'create identity replays same project');
check((await call('projects',{requestId,film:{...original,title:'Different'}},auth)).status===409,'create identity rejects changed content');
check((await call('projects/'+projectId,null,other)).status===404,'different tenant cannot read shared film');
const editorInvite=await call('projects/'+projectId+'/invites',{role:'editor'},auth);check(editorInvite.status===201,'owner creates hashed one-use editor invite');
check(!JSON.stringify(db.native.prepare('SELECT * FROM sf_invites').all()).includes(editorInvite.body.token),'invitation capability is not stored in plaintext');
check((await call('invites/join',{token:editorInvite.body.token},edit)).body.role==='editor','second account actually joins editor role');
check((await call('invites/join',{token:editorInvite.body.token},other)).status===404,'used invitation cannot be replayed by another account');
const vInvite=await call('projects/'+projectId+'/invites',{role:'viewer'},auth);await call('invites/join',{token:vInvite.body.token},view);
const changed=structuredClone(original);changed.shots[3].speech[1].text='A new ending from the actual editor.';
check((await call('projects/'+projectId,{revision:1,requestId:crypto.randomUUID(),film:changed},view)).status===403,'viewer cannot save');
const saveRequest=crypto.randomUUID(),saved=await call('projects/'+projectId,{revision:1,requestId:saveRequest,film:changed},edit);check(saved.status===200&&saved.body.project.revision===2,'editor saves actual revision two');
check((await call('projects/'+projectId,{revision:1,requestId:saveRequest,film:changed},edit)).body.savedRevision===2,'uncertain save can recover exact successful write');
check((await call('projects/'+projectId,{revision:1,requestId:crypto.randomUUID(),film:original},auth)).status===409,'stale owner save cannot overwrite editor revision');
check((await call('projects/'+projectId+'/history/1',null,edit)).body.version.film.shots[3].speech[1].text===original.shots[3].speech[1].text,'immutable old film retained');
check((await call('projects/'+projectId+'/history',null,view)).status===403,'viewer does not receive private revision history');
const publish={projectId,revision:2,requestId:crypto.randomUUID(),allowRemix:true,rightsConfirmed:true};
check((await call('cuts',publish,edit)).status===403,'editor cannot publish owner project');
check((await call('cuts',{...publish,allowRemix:false},auth)).status===400,'publication requires explicit reuse permission');
const published=await call('cuts',publish,auth);check(published.status===201,'actual immutable public cut created');const cutId=published.body.cut.id;
const cut=await call('cuts/'+cutId);check(cut.status===200&&cut.body.cut.film.shots[3].speech[1].text===changed.shots[3].speech[1].text,'anonymous visitor reads exact published film');
check(!JSON.stringify(cut.body).includes(projectId)&&!JSON.stringify(cut.body).includes(editor.body.account.id),'public projection excludes private project id and collaborator identifiers');
check((await call('cuts',publish,auth)).body.cut.id===cutId,'publish retry recovers same immutable cut');
const third=structuredClone(changed);third.shots[0].performers[0].toX=.52;await call('projects/'+projectId,{revision:2,requestId:crypto.randomUUID(),film:third},auth);
check((await call('cuts/'+cutId)).body.cut.film.shots[0].performers[0].toX===changed.shots[0].performers[0].toX,'later private edit cannot alter public cut');
const forkRequest=crypto.randomUUID(),forked=await call('cuts/'+cutId+'/fork',{requestId:forkRequest},other);check(forked.status===201&&forked.body.project.parentCut===cutId,'real different author forks pinned source');const forkId=forked.body.project.id;
const forkPublish={projectId:forkId,revision:1,requestId:crypto.randomUUID(),allowRemix:true,rightsConfirmed:true};check((await call('cuts',forkPublish,other)).body.code==='unchanged_remix','unchanged fork cannot be published as a contribution');
const retitled=structuredClone(changed);retitled.title='Only a new title';await call('projects/'+forkId,{revision:1,requestId:crypto.randomUUID(),film:retitled},other);check((await call('cuts',{...forkPublish,revision:2},other)).body.code==='unchanged_remix','title-only fork also refused');
retitled.shots[3].performers[0].pose='reach';await call('projects/'+forkId,{revision:2,requestId:crypto.randomUUID(),film:retitled},other);const remixed=await call('cuts',{...forkPublish,revision:3},other);check(remixed.status===201,'real changed performer can publish attributed remix');
const remix=await call('cuts/'+remixed.body.cut.id);check(remix.body.cut.parent.bodyHash===cut.body.cut.bodyHash&&remix.body.cut.changes.changedShots.includes(changed.shots[3].label),'remix provenance pins original hash and real shot change');
check((await call('cuts/'+cutId+'/report',{reason:'rights',note:'An isolated report fixture.'},view)).status===200,'actual report stored');
check((await call('moderation')).status===404,'moderation hidden without owner capability');
const moderation={headers:{Authorization:'Bearer '+env.MODERATION_KEY}};check((await call('moderation',null,moderation)).body.reports.length===1,'operator receives actual report');
await call('moderation/cuts/'+cutId,{hidden:true,resolveReports:true},moderation);check((await call('cuts/'+cutId)).status===404,'operator-hidden cut not publicly served');
check((await call('cuts/'+cutId,null,auth)).body.cut.hidden,'publisher can still inspect its hidden cut');
await call('moderation/cuts/'+cutId,{hidden:false,resolveReports:true},moderation);await call('cuts/'+cutId+'/withdraw',{},auth);
check((await call('cuts/'+cutId)).status===404,'publisher withdrawal hides source');
check((await call('cuts/'+cutId+'/fork',{requestId:forkRequest},other)).body.project.id===forkId,'uncertain successful fork recovers after source withdrawal');
check((await call('cuts/'+cutId+'/fork',{requestId:crypto.randomUUID()},edit)).status===404,'new fork cannot start from withdrawn source');
check((await call('cuts/'+remixed.body.cut.id)).status===200,'licensed changed descendant remains its own public cut');
// Real streamed body pauses after authorization; current-role SQL must refuse the late editor write.
let release,entered;const opened=new Promise(r=>entered=r),gate=new Promise(r=>release=r);const staleBody={revision:3,requestId:crypto.randomUUID(),film:third};
const stream=new ReadableStream({async start(controller){controller.enqueue(new TextEncoder().encode('{'));entered();await gate;controller.enqueue(new TextEncoder().encode(JSON.stringify(staleBody).slice(1)));controller.close();}});
const late=onRequest({env,request:new Request(origin+'/api/projects/'+projectId,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',Cookie:editor.cookie,'CF-Connecting-IP':'192.0.2.42'},body:stream,duplex:'half'})});
await opened;await new Promise(r=>setTimeout(r,0));await call('projects/'+projectId+'/members/'+editor.body.account.id,{role:'remove'},auth);release();check((await late).status===404,'removed editor cannot finish preauthorized paused-body save');
check((await call('projects/'+projectId,null,auth)).body.project.revision===3,'late removed-editor request leaves film revision unchanged');
const bad=structuredClone(original);bad.shots[0].performers[0].toX=999;check((await call('projects',{requestId:crypto.randomUUID(),film:bad},auth)).status===400,'server independently rejects invalid stage movement');
const invalidPrivate={...original,secret:'PRIVATE_SENTINEL'};check((await call('projects',{requestId:crypto.randomUUID(),film:invalidPrivate},auth)).status===400,'canonical film rejects private/ad-hoc fields');
await call('account/delete',{confirmation:'DELETE MY ACCOUNT'},auth);check((await call('account',null,auth)).body.account===null,'account deletion invalidates session');
check((await call('projects/'+projectId,null,view)).status===404,'owner deletion cascades private collaboration');
check((await call('cuts/'+cutId)).status===404,'deleted publisher cut remains withdrawn');
console.log(`${checks} real SQLite/request assertions passed`);
