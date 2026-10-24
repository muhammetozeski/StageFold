import {readdir,readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const files=[];async function walk(path){for(const x of await readdir(path,{withFileTypes:true})){const p=path+'/'+x.name;if(x.isDirectory()){if(!['bin','obj','_framework','.git'].includes(x.name))await walk(p);}else if(/\.(mjs|js)$/.test(x.name))files.push(p);}}
for(const root of ['server','functions','src/StageFold.App/wwwroot','scripts','verification'])await walk(root);
for(const f of files){const result=spawnSync(process.execPath,['--check',f],{stdio:'inherit'});if(result.status)process.exit(result.status);}console.log(`${files.length} JavaScript sources parse successfully`);
