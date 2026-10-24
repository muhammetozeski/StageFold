// Owner/CI operated after deployment. Git source/history and D1 data are retained.
const token=process.env.CLOUDFLARE_API_TOKEN,account=process.env.CLOUDFLARE_ACCOUNT_ID,commit=process.env.GITHUB_SHA;
if(!token||!account||!commit)throw Error('Hosting credentials and the just-published commit must be provided privately.');
const base=`https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/muhammetozeski-stagefold`;
async function api(path='',method='GET'){const response=await fetch(base+path,{method,headers:{Authorization:'Bearer '+token}});const body=await response.json();if(!response.ok||!body.success)throw Error('Hosting deployment management was not acknowledged.');return body.result;}
const project=await api(),current=project.canonical_deployment;
if(!current?.id||current.environment!=='production'||current.deployment_trigger?.metadata?.commit_hash!==commit)throw Error('The current production deployment does not match the just-published source. No historical deployment was retired.');
const url=new URL(current.url);if(url.protocol!=='https:'||!url.hostname.endsWith('.muhammetozeski-stagefold.pages.dev'))throw Error('The current deployment origin is not accepted.');
const [health,build]=await Promise.all([fetch(url.origin+'/api/health').then(r=>r.json()),fetch(url.origin+'/build-info.json').then(r=>r.json())]);
if(!health.ok||health.service!=='StageFold'||build.sourceCommit!==commit)throw Error('The new service/build did not verify. Old deployments were retained.');
const deployments=await api('/deployments?per_page=100');let retired=0;
for(const item of deployments){if(item.id===current.id)continue;if(['active','queued'].includes(item.latest_stage?.status))continue;await api('/deployments/'+encodeURIComponent(item.id)+'?force=true','DELETE');retired++;}
console.log(`Verified current deployment ${current.id}; retired ${retired} superseded API snapshots. Git and database retained.`);
