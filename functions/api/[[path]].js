import {accountFrom,fail,hash,json,limit,sameOrigin,ServiceError} from '../../server/security.mjs';
import {accounts} from '../../server/accounts.mjs';
import {projects} from '../../server/projects.mjs';
import {cuts} from '../../server/cuts.mjs';
import {moderation} from '../../server/moderation.mjs';
import {billing} from '../../server/billing.mjs';
import {appBasePath,apiRoute} from '../../server/paths.mjs';

/** Same-origin service for real shared-film state; private documents never enter public list responses. */
export async function onRequest({request,env}){
 try{
  const url=new URL(request.url),basePath=appBasePath(env.APP_BASE_PATH),parts=apiRoute(url,basePath);if(parts===null)fail(404,'That service action is unavailable.');const path=parts.join('/');
  if(request.method==='GET'&&path==='health')return json({ok:true,service:'StageFold',filmFormat:1});
  if(!['GET','POST'].includes(request.method))fail(405,'Use GET or POST.');
  if(!env.DB||!env.RATE_SALT)fail(503,'The shared service is unavailable. Keep working locally.');
  if(request.method==='POST'&&path!=='billing/webhook')sameOrigin(request);
  const db=env.DB,ip=await hash(env.RATE_SALT+':'+(request.headers.get('CF-Connecting-IP')||'unknown')),account=await accountFrom(request,db);
  await limit(db,account?.id||ip,request.method==='GET'?'read':'write',request.method==='GET'?180:90);
  const context={request,env,db,parts,ip,account,url,basePath};let response;
  if(['accounts','account','sessions','invites'].includes(parts[0]))response=await accounts(context);
  else if(parts[0]==='projects')response=await projects(context);
  else if(parts[0]==='cuts')response=await cuts(context);
  else if(parts[0]==='moderation')response=await moderation(context);
  else if(parts[0]==='billing')response=await billing(context);
  if(response)return response;fail(404,'That service action is unavailable.');
 }catch(error){if(error instanceof ServiceError)return json({error:error.message,code:error.code},error.status);console.error('StageFold request failed; no body or credential logged.',error.name);return json({error:'The service could not finish this action. Keep your film JSON and retry only after checking its saved state.',code:'service_failure'},500);}
}
