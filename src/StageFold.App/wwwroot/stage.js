// The renderer is closed over first-party constants only, so it can travel inside an offline HTML export.
export function createRenderer(canvas) {
    const ctx = canvas.getContext('2d'), W = 960, H = 540;
    canvas.width = W; canvas.height = H;
    const palette = {orange:'#ff6900',blue:'#2c6cff',pink:'#ff3c82',green:'#2fcb73',yellow:'#ffdd20',white:'#f5f2e9'};
    const ink = '#111118';
    const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
    const line = (x,y,x2,y2,width=5,color=ink) => {ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();};
    const rect = (x,y,w,h,color,stroke=false) => {ctx.fillStyle=color;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.strokeRect(x,y,w,h);}};
    const circle = (x,y,r,color,stroke=false) => {ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();if(stroke){ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.stroke();}};
    const polygon = (pts,color,stroke=true) => {ctx.fillStyle=color;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.fill();if(stroke){ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.stroke();}};
    function backdrop(stage, t) {
        rect(0,0,W,H,'#18203f'); rect(0,420,W,120,'#484256');
        if(stage==='rooftop') {rect(0,0,W,420,'#18244e');circle(770,98,53,'#ffdd20');for(let i=0;i<9;i++){rect(i*118,265-(i%3)*43,90,180,'#102039');for(let j=0;j<3;j++)rect(i*118+16,290-(i%3)*43+j*33,13,17,'#ffb500');}rect(0,400,W,20,'#f5f2e9');line(0,420,W,420,6);}
        if(stage==='station') {rect(0,0,W,420,'#123c59');for(let x=50;x<960;x+=180){rect(x,72,130,220,'#0b1527',true);line(x+65,72,x+65,292,5,'#2c6cff');}rect(0,330,W,90,'#d39416');circle(480,110,48,'#f5f2e9',true);line(480,110,480,77,4);line(480,110,505,123,4);rect(80,355,240,20,ink);rect(85,375,12,45,ink);rect(300,375,12,45,ink);}
        if(stage==='cafe') {rect(0,0,W,420,'#692846');rect(80,70,240,200,'#11263c',true);for(let i=0;i<5;i++)circle(110+i*45,110+(i%2)*40,3,'#ffdd20');rect(620,100,230,150,'#f5f2e9',true);line(650,140,810,140,6,'#ff6900');line(650,175,770,175,6,'#2c6cff');rect(360,355,240,20,'#ff6900',true);rect(467,375,20,80,ink);}
        if(stage==='moon') {rect(0,0,W,420,'#0c102a');for(let i=0;i<35;i++)circle((i*137+37)%960,(i*73+17)%320,2,'#f5f2e9');circle(790,100,60,'#2c6cff');circle(770,88,27,'#2fcb73');ctx.fillStyle='#b6b3c3';ctx.beginPath();ctx.ellipse(480,550,680,170,0,Math.PI,Math.PI*2);ctx.fill();for(let i=0;i<5;i++){ctx.fillStyle='#77748b';ctx.beginPath();ctx.ellipse(90+i*190,480+(i%2)*30,30,9,0,0,Math.PI*2);ctx.fill();}}
        if(stage==='archive') {rect(0,0,W,420,'#243e32');for(let row=0;row<3;row++){for(let i=0;i<25;i++)rect(25+i*38,70+row*112+(i%3)*7,25,72-(i%3)*7,Object.values(palette)[i%6],true);rect(0,144+row*112,W,14,ink);}rect(0,420,W,120,'#63513b');}
        if(stage==='workshop') {rect(0,0,W,420,'#3c3657');for(let x=40;x<960;x+=60)for(let y=55;y<280;y+=60)circle(x,y,3,'#77718b');rect(570,270,300,110,'#ff6900',true);rect(590,380,20,80,ink);rect(830,380,20,80,ink);rect(650,200,110,70,'#2c6cff',true);circle(705,225,18,'#ffdd20',true);line(705,208,705,190,5);}
        if(stage==='garden') {rect(0,0,W,420,'#174a57');circle(790,80,45,'#ffdd20');for(let i=0;i<8;i++){const x=i*145;line(x,420,x+12,260,10,'#112e24');circle(x+12,250,60,'#247f4d');circle(x+42,275,40,'#2fcb73');}rect(0,420,W,120,'#1c5639');for(let i=0;i<18;i++){line(i*57,490,i*57+10,460,3,'#2fcb73');circle(i*57+10,460,5,i%2?'#ff3c82':'#ffdd20');}}
        if(stage==='harbor') {rect(0,0,W,300,'#172c50');circle(780,94,45,'#ff6900');rect(0,300,W,150,'#164fb2');for(let i=0;i<12;i++)line((i*89+t*.016)%1050-50,340+(i%3)*30,(i*89+t*.016)%1050+20,340+(i%3)*30,3,'#5990f5');polygon([[780,300],[800,120],[840,120],[860,300]],'#f5f2e9');rect(785,115,70,20,'#ff6900',true);polygon([[785,115],[820,85],[855,115]],ink);rect(0,430,W,110,'#695245');for(let i=0;i<10;i++)line(i*110,430,i*110,540,4);}
        // Fine stage grain uses fixed geometric marks, never random state.
        ctx.globalAlpha=.2;for(let i=0;i<18;i++)line(i*63,537,i*63+30,537,2,'#f5f2e9');ctx.globalAlpha=1;
    }
    function actor(c,p,u,t) {
        const ease=u*u*(3-2*u), x=(p.fromX+(p.toX-p.fromX)*ease)*W, y=(p.fromY+(p.toY-p.fromY)*ease)*H;
        const moving=Math.abs(p.toX-p.fromX)+Math.abs(p.toY-p.fromY)>.025, phase=t/160, bob=(moving||p.pose==='walk')?Math.sin(phase)*3:Math.sin(t/650)*1.4;
        ctx.save();ctx.translate(x,y+bob);ctx.scale(p.scale*(p.flip?-1:1),p.scale);
        ctx.fillStyle='#00000055';ctx.beginPath();ctx.ellipse(0,4,38,8,0,0,Math.PI*2);ctx.fill();
        const color=palette[c.color]||palette.orange, sit=p.pose==='sit', legSwing=(moving||p.pose==='walk')?Math.sin(phase)*15:0;
        line(-14,-35,sit?-30:-17+legSwing,sit?-18:0,9);line(14,-35,sit?32:17-legSwing,sit?-18:0,9);
        if(c.look==='reed') polygon([[-14,-100],[16,-100],[25,-30],[-25,-30]],color);
        else if(c.look==='kite') polygon([[0,-114],[38,-66],[0,-28],[-38,-66]],color);
        else rect(-28,-100,56,68,color,true);
        // Arms are actual articulated paths; gestures are timed throughout a shot.
        let left=[-50,-52],right=[50,-52];
        if(p.pose==='wave')right=[58+Math.sin(phase)*10,-135];
        if(p.pose==='point')right=[83,-90];
        if(p.pose==='think')right=[22,-126];
        if(p.pose==='celebrate'){left=[-58,-128+Math.sin(phase)*8];right=[58,-128-Math.sin(phase)*8];}
        if(p.pose==='reach'){left=[-58,-96];right=[70,-106];}
        if(sit){left=[-37,-30];right=[37,-30];}
        line(-25,-85,...left,8);line(25,-85,...right,8);circle(...left,6,color,true);circle(...right,6,color,true);
        if(c.look==='box')rect(-34,-164,68,62,color,true);
        else if(c.look==='kite')polygon([[0,-180],[37,-140],[0,-103],[-37,-140]],color);
        else {circle(0,-135,c.look==='orb'?39:33,color,true);if(c.look==='cat'){polygon([[-29,-150],[-32,-180],[-7,-163]],color);polygon([[8,-163],[32,-180],[29,-150]],color);}if(c.look==='reed'){line(0,-169,7,-190,5);circle(9,-192,10,'#2fcb73',true);}}
        const eyeY=-140;circle(-12,eyeY,p.mood==='surprised'?5:3.4,ink);circle(12,eyeY,p.mood==='surprised'?5:3.4,ink);
        if(p.mood==='surprised')circle(0,-120,7,ink);
        else if(p.mood==='sad'){ctx.beginPath();ctx.arc(0,-112,11,Math.PI*1.15,Math.PI*1.85);ctx.strokeStyle=ink;ctx.lineWidth=3;ctx.stroke();}
        else if(p.mood==='happy'){ctx.beginPath();ctx.arc(0,-128,11,.15,Math.PI-.15);ctx.strokeStyle=ink;ctx.lineWidth=3;ctx.stroke();}
        else {line(-7,-122,7,-122,3);if(p.mood==='determined'){line(-20,-151,-6,-146,3);line(6,-146,20,-151,3);}}
        ctx.restore();return {x,y,head:y-176*p.scale,actorId:c.id};
    }
    function wrap(text,max) {ctx.font='600 21px system-ui,sans-serif';const words=text.split(/\s+/), lines=[];let line='';for(const word of words){if(ctx.measureText(word).width>max){if(line){lines.push(line);line='';}for(const character of word){if(ctx.measureText(line+character).width>max){lines.push(line);line='';}line+=character;}}else{const next=line?line+' '+word:word;if(ctx.measureText(next).width>max&&line){lines.push(line);line=word;}else line=next;}}if(line)lines.push(line);return lines;}
    function bubble(text, name, anchor, side) {
        const lines=wrap(text,315), width=360, height=38+lines.length*27, x=clamp(anchor.x-width/2,18,W-width-18), y=side?25:clamp(anchor.head-height-15,25,250);
        ctx.fillStyle='#f5f2e9';ctx.strokeStyle=ink;ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(x,y,width,height,12);ctx.fill();ctx.stroke();
        polygon([[clamp(anchor.x-12,x+15,x+width-30),y+height],[anchor.x,Math.max(y+height+12,anchor.head+9)],[clamp(anchor.x+12,x+30,x+width-15),y+height]],'#f5f2e9',false);
        ctx.fillStyle=ink;ctx.textAlign='left';ctx.font='800 14px system-ui,sans-serif';ctx.fillText(name.toUpperCase(),x+15,y+23);ctx.font='600 21px system-ui,sans-serif';lines.forEach((s,i)=>ctx.fillText(s,x+15,y+51+i*27));
    }
    function locate(film,ms) {let offset=0;for(let i=0;i<film.shots.length;i++){const shot=film.shots[i];if(ms<offset+shot.durationMs||i===film.shots.length-1)return {shot,index:i,local:clamp(ms-offset,0,shot.durationMs),offset};offset+=shot.durationMs;}}
    function draw(film,ms,edit=null) {
        const at=locate(film,ms);if(!at)return [];
        const {shot,local}=at;backdrop(shot.stage,local);const anchors=[];
        const cast=new Map(film.cast.map(x=>[x.id,x]));
        for(const p of [...shot.performers].sort((a,b)=>a.fromY-b.fromY)){const c=cast.get(p.actorId);if(c)anchors.push(actor(c,p,local/shot.durationMs,local));}
        const speaking=shot.speech.filter(s=>local>=s.startMs&&local<s.endMs);
        speaking.forEach((s,i)=>{const a=anchors.find(a=>a.actorId===s.actorId);if(a)bubble(s.text,cast.get(s.actorId).name,a,i>0);});
        rect(0,0,W,7,palette.orange);ctx.textAlign='left';ctx.font='700 13px system-ui,sans-serif';ctx.fillStyle='#f5f2e9';ctx.fillText(shot.label,18,H-16);
        if(edit){const p=shot.performers.find(p=>p.actorId===edit.actorId);if(p){const a=edit.endpoint==='end'?[p.toX*W,p.toY*H]:[p.fromX*W,p.fromY*H];line(p.fromX*W,p.fromY*H,p.toX*W,p.toY*H,3,'#ffdd20');circle(...a,12,'#ffdd20',true);ctx.fillStyle=ink;ctx.font='800 13px system-ui';ctx.fillText(edit.endpoint==='end'?'END':'START',clamp(a[0]+18,0,890),a[1]);}}
        return anchors;
    }
    return {draw,locate,duration:f=>f.shots.reduce((n,s)=>n+s.durationMs,0)};
}

let active=null;
export function preview(id,film,ms){const canvas=document.getElementById(id);if(!canvas)throw Error('The comparison stage is unavailable.');createRenderer(canvas).draw(film,Math.min(ms,film.shots.reduce((n,s)=>n+s.durationMs,0)));}
const clone=f=>JSON.parse(JSON.stringify(f));
export function mount(id,reference,film){dispose();const canvas=document.getElementById(id);if(!canvas)throw Error('The stage canvas is unavailable.');active={canvas,reference,film:clone(film),renderer:createRenderer(canvas),ms:0,playing:false,edit:null,raf:0,recording:false};canvas.addEventListener('pointerdown',down);active.renderer.draw(active.film,0);return capabilities();}
export function capabilities(){let codec='';if(typeof MediaRecorder!=='undefined'&&HTMLCanvasElement.prototype.captureStream)codec=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(x=>MediaRecorder.isTypeSupported(x))||'';return {webm:!!codec,codec};}
export function update(film,ms,actorId,endpoint){if(!active)return;pause();active.film=clone(film);active.ms=Math.min(ms,active.renderer.duration(film));active.edit=actorId?{actorId,endpoint}:null;active.renderer.draw(active.film,active.ms,active.edit);}
export function seek(ms){if(!active)return;pause();active.ms=Math.max(0,Math.min(ms,active.renderer.duration(active.film)));active.renderer.draw(active.film,active.ms,active.edit);}
export function pause(){if(!active||active.recording)return;if(active.raf)cancelAnimationFrame(active.raf);active.playing=false;active.raf=0;active.renderer.draw(active.film,active.ms,active.edit);}
export function play(){if(!active||active.recording)return;pause();const s=active,duration=s.renderer.duration(s.film);if(s.ms>=duration)s.ms=0;const start=performance.now()-s.ms;let last=-300;s.playing=true;function frame(now){if(active!==s||!s.playing)return;s.ms=Math.min(duration,now-start);s.renderer.draw(s.film,s.ms);if(s.ms-last>220||s.ms===duration){last=s.ms;s.reference.invokeMethodAsync('OnPlayback',Math.round(s.ms),s.ms<duration).catch(()=>{});}if(s.ms<duration)s.raf=requestAnimationFrame(frame);else{s.playing=false;s.raf=0;}}s.raf=requestAnimationFrame(frame);}
function down(event){const s=active;if(!s||s.playing||s.recording||!s.edit)return;const at=s.renderer.locate(s.film,s.ms),p=at.shot.performers.find(p=>p.actorId===s.edit.actorId);if(!p)return;const rect=s.canvas.getBoundingClientRect(), endpoint=s.edit.endpoint;const point=e=>({x:Math.max(.06,Math.min(.94,(e.clientX-rect.left)/rect.width)),y:Math.max(.45,Math.min(.92,(e.clientY-rect.top)/rect.height))});const selected=point(event);const hx=endpoint==='end'?p.toX:p.fromX,hy=endpoint==='end'?p.toY:p.fromY;if(Math.hypot((selected.x-hx)*960,(selected.y-hy)*540)>65)return;s.canvas.setPointerCapture(event.pointerId);function move(e){const q=point(e);if(endpoint==='end'){p.toX=q.x;p.toY=q.y;}else{p.fromX=q.x;p.fromY=q.y;}s.renderer.draw(s.film,s.ms,s.edit);}function up(e){move(e);s.canvas.removeEventListener('pointermove',move);s.canvas.removeEventListener('pointerup',up);s.canvas.removeEventListener('pointercancel',cancel);const q=point(e);s.reference.invokeMethodAsync('OnActorMoved',s.edit.actorId,endpoint,q.x,q.y).catch(()=>{});}function cancel(){s.canvas.removeEventListener('pointermove',move);s.canvas.removeEventListener('pointerup',up);s.canvas.removeEventListener('pointercancel',cancel);}s.canvas.addEventListener('pointermove',move);s.canvas.addEventListener('pointerup',up);s.canvas.addEventListener('pointercancel',cancel);}
export function dispose(canvasId){if(!active||(canvasId&&active.canvas.id!==canvasId))return;const s=active;s.cancelRecording?.();s.playing=false;cancelAnimationFrame(s.raf);s.canvas.removeEventListener('pointerdown',down);active=null;}
export function saveLocal(film){localStorage.setItem('stagefold:film:v1',JSON.stringify(film));}
export function loadLocal(){return localStorage.getItem('stagefold:film:v1');}
function download(content,name,mime){const blob=content instanceof Blob?content:new Blob([content],{type:mime});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);return blob.size;}
export function downloadJson(json){return download(json,'StageFold.film.json','application/json');}
const safeJson=x=>JSON.stringify(x).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const html=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function filmHtml(film,credit=''){
    const doc=clone(film);return `<!DOCTYPE html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${html(doc.title)}</title><style>body{margin:0;background:#111118;color:#f5f2e9;font:17px system-ui}main{max-width:1100px;margin:30px auto;padding:20px}canvas{width:100%;aspect-ratio:16/9;display:block}button,input{font:inherit}button{background:#b5c2d2;color:#111118;border:0;padding:10px 18px;margin:10px 8px 0 0;cursor:pointer}input{width:100%}p{line-height:1.6}.credit{font-size:14px}</style><main><h1>${html(doc.title)}</h1><canvas id="film" aria-label="Captioned animated film"></canvas><button id="play">Play</button><button id="pause">Pause</button><button id="restart">Restart</button><label>Film time <input id="time" type="range" min="0" value="0" step="50"></label><p id="position"></p><p>${html(doc.summary)}</p><p class="credit">${html(credit||'No audio.')}</p></main><script>const createRenderer=${createRenderer.toString()};const film=${safeJson(doc)};const renderer=createRenderer(document.getElementById('film'));const slider=document.getElementById('time');const duration=renderer.duration(film);slider.max=duration;let ms=0,raf=0,start=0;function draw(){renderer.draw(film,ms);slider.value=ms;document.getElementById('position').textContent=(ms/1000).toFixed(1)+' / '+(duration/1000).toFixed(1)+' seconds';}function stop(){cancelAnimationFrame(raf);raf=0;}function frame(now){ms=Math.min(duration,now-start);draw();if(ms<duration)raf=requestAnimationFrame(frame);else raf=0;}document.getElementById('play').onclick=()=>{stop();if(ms>=duration)ms=0;start=performance.now()-ms;raf=requestAnimationFrame(frame);};document.getElementById('pause').onclick=stop;document.getElementById('restart').onclick=()=>{stop();ms=0;draw();};slider.oninput=()=>{stop();ms=Number(slider.value);draw();};draw();</script></html>`;
}
export function downloadHtml(film,credit){return download(filmHtml(film,credit),'StageFold-film.html','text/html');}
export function downloadFrame(){if(!active)throw Error('Open the stage first.');return new Promise((resolve,reject)=>active.canvas.toBlob(blob=>blob?resolve(download(blob,'StageFold-frame.png','image/png')):reject(Error('The frame could not be encoded.')),'image/png'));}
export async function recordWebm(film){
    const capability=capabilities();if(!capability.webm)throw Error('WebM recording is not supported by this browser. Use the standalone HTML film.');
    if(document.hidden)throw Error('Keep this tab visible before starting a WebM recording.');
    if(!active||active.recording)throw Error('The stage is not ready to record.');pause();const s=active,doc=clone(film),duration=s.renderer.duration(doc),chunks=[];s.recording=true;s.renderer.draw(doc,0);
    const stream=s.canvas.captureStream(30),recorder=new MediaRecorder(stream,{mimeType:capability.codec,videoBitsPerSecond:2500000});let raf=0,interrupted=false;
    try{return await new Promise((resolve,reject)=>{
        let finished=false;const fail=()=>{interrupted=true;if(recorder.state!=='inactive')recorder.stop();};
        s.cancelRecording=fail;const visibility=()=>{if(document.hidden)fail();};document.addEventListener('visibilitychange',visibility);
        recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onerror=()=>{interrupted=true;};
        recorder.onstop=()=>{cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',visibility);if(interrupted||!finished){reject(Error('Recording was interrupted. No partial film was downloaded; keep this tab visible and try again.'));return;}const blob=new Blob(chunks,{type:capability.codec});if(!blob.size){reject(Error('The browser returned an empty recording.'));return;}download(blob,'StageFold-film.webm',capability.codec);resolve({bytes:blob.size,mime:capability.codec});};
        recorder.start(250);const start=performance.now();function frame(now){const ms=Math.min(duration,now-start);s.renderer.draw(doc,ms);s.reference.invokeMethodAsync('OnPlayback',Math.round(ms),true).catch(()=>{});if(ms<duration)raf=requestAnimationFrame(frame);else{finished=true;recorder.stop();}}raf=requestAnimationFrame(frame);
    });}finally{s.cancelRecording=null;s.recording=false;stream.getTracks().forEach(t=>t.stop());s.ms=0;s.renderer.draw(s.film,0,s.edit);}
}
