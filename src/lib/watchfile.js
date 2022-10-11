let t = fs.watchFile('.git/logs/HEAD',
    ()=>
     {
      isSaving = false;
      t = null
    });