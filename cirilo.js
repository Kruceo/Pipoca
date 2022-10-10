const fs = require('fs');
const { setToVersion } = require('./managePkg');

fs.watchFile('.git/logs/HEAD',()=>{
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
console.log(commits);
console.log(major,minor,patch);
setToVersion(major,minor,patch);
})


