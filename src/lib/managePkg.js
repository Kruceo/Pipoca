const fs = require('fs');
const { formatPkg } = require('./util');
function addToVersion(major, minor, patch) {
   let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
   if (!pkg) return
   const v = pkg.version.split('.');

   var ver = []
   for (var l = 0; l < 3; l++) {
      var i = parseInt(v[l]);


      ver.push(i)
   }
   ver[2] += patch;
   ver[1] += minor;
   ver[0] += major;
   pkg.version = ver.toString().replaceAll(',', '.')
   console.log(ver);
   fs.writeFileSync('./package.json', JSON.stringify(pkg))
}
function setToVersion(major, minor, patch) {
   if (!fs.existsSync('./package.json')) return { error: true, message: 'package.json not exist' }
   let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

   const v = pkg.version.split('.');

   let lenght = (v.length);
   var ver = []
   for (var l = 0; l < 3; l++) {
      var i = parseInt(v[l]);


      ver.push(i)
   }
   ver[2] = patch;
   ver[1] = minor;
   ver[0] = major;
   pkg.version = ver.toString().replaceAll(',', '.')

   fs.writeFileSync('./package.json', JSON.stringify(pkg,null,2))
   fixPkgLock(ver.toString().replaceAll(',', '.'))
   return { error: false, message: v[0] + '.' + v[1] + '.' + v[2] + ' => ' + pkg.version }
}
function setToPatch(patch) {
   let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
   const v = pkg.version.split('.');

   let lenght = (v.length);
   var ver = []
   for (var l = 0; l < 3; l++) {
      var i = parseInt(v[l]);
      ver.push(i)
   }
   ver[2] = patch;
   pkg.version = ver.toString().replaceAll(',', '.')
   console.log(ver);
   fs.writeFileSync('./package.json', formatPkg(JSON.stringify(pkg)))
}
function setToMinor(minor) {
   let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
   const v = pkg.version.split('.');

   //let lenght = (v.length);
   var ver = []
   for (var l = 0; l < 3; l++) {
      var i = parseInt(v[l]);
      ver.push(i)
   }
   ver[1] = minor;
   pkg.version = ver.toString().replaceAll(',', '.')
   console.log(ver);
   fs.writeFileSync('./package.json', JSON.stringify(pkg))
}

function fixPkgLock(v) {
   const pkgLock = JSON.parse(fs.readFileSync("package-lock.json"));
   pkgLock.version = v;
   pkgLock.packages[""].version = v;
   fs.writeFileSync("package-lock.json", JSON.stringify(pkgLock, null, 2));
}
module.exports = { addToVersion, setToPatch, setToVersion }