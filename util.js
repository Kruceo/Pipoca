function formatPkg(packageStr)
{
    let i = '';
    let spc = 0;
    packageStr.replaceAll(',',',#!!@').replaceAll('{','{#!!@').replaceAll('}','#!!@}').split('#!!@').forEach((line)=>
    {
        let coef = 0
        if(line.includes('}'))
        {
            coef -= 2
        }   
        for(let y = 0;y<spc+coef;y++)
        {
            i+= '  '; 
        }
        i+= line;
        if(line.includes('{')){spc += 1}
        if(line.includes('}')){spc -= 1}
    })
    return i;
}