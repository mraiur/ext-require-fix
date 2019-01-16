let FileParser = require('./FileParser');
let config = require('./config.json');


var walkSync = function(dir, filelist) {
    var fs = fs || require('fs'),
        files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function(file) {
      if (fs.statSync(dir + file).isDirectory()) {
        filelist = walkSync(dir + file + '/', filelist);
      }
      else {
        filelist.push(dir + file);
      }
    });
    return filelist;
};

if( config.test )
{

    let testFile = new FileParser('./test.js', config.parseConfig);
    testFile.read()
        .parseRequries()
        .view();

}
else
{
    config.directories.forEach( (dir) => {

        let fileList = [];

        walkSync( config.baseExtPath + dir.dir+'/', fileList);
    
        fileList.forEach( (file) => {
            if( dir.exclude.indexOf(file) === -1 )
            {
                let a = new FileParser(file, config.parseConfig);
                a.read()
                    .parseRequries()
                    .save();
            }
        });
    });

    
}