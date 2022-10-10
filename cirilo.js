const { exec } = require('child_process');
const fs = require('fs');
const { setToVersion } = require('./managePkg');
let isSaving = false;
fs.watchFile('.git/logs/HEAD',()=>{
    if(isSaving)return
let lines = fs.readFileSync('.git/logs/HEAD', 'utf-8').split('\n');
let major = 0,minor = 0,patch = 0;
let commits = lines.filter((line)=>{
    if(line.includes('commit'))
    {
        return line;

    }
})

commits.forEach((commit,index)=>
{
    
    let i = commit.split('commit')[1].split(':')[1].trim();
    commits[index] = i;
    
    if(i == 'fix' || i =='init')
    {
        patch ++;
    }
    if(i =='att')
    {
        minor ++;
        patch = 0;
    }
    if(i =='new')
    {
        major ++;
        minor = 0;
        patch = 0;
    }
    

})
setToVersion(major,minor,patch);
isSaving = true;
exec('git add package.json');
exec('git commit -m "pipoca:fix: version"').stdout.on('data',(data)=>
{
    console.log(data);
})
setTimeout(()=>isSaving = false,2000)

})


