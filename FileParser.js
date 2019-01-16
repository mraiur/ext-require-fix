let _ = require('lodash');

module.exports = (function() {


    var fs = require('fs');

    
    function FileParser(file, config) {
        config = config || {};
        this._parseConfig = _.merge({
            ExtCreate: true,
            Xtype : true
        }, config);
            

        this._file = file;
    }

    FileParser.prototype = Object.create(Object.prototype);
    FileParser.prototype.constructor = FileParser;

    FileParser.prototype.parseRequries = function(){

        let requireReg = /requires(\s{1,3}|):(\s{1,3}|)(\n|)(\n|)(\[)/g;
        let requiresMatch = this._content.match(requireReg);
        let xtypeReq = /xtype(.*)("|')/g;
        let xtypeMatch = this._content.match(xtypeReq);

        if( requiresMatch && requiresMatch.length > 1 )
        {
            console.log("multiple requires declared");
            process.exit();
        }
        let requireStringLength = requiresMatch ? requiresMatch[0].length-1 : 0;
        let extCreateReq = /Ext\.create\(("|')(.*)("|')/g;
        
        let fileRequires = [];
        
        
        let extCreateMatch = this._content.match(extCreateReq);
        
        if( this._parseConfig.ExtCreate && extCreateMatch )
        {
            extCreateMatch.forEach( (item) => {
                let file = item.replace(/Ext\.create|'|"|\(|\)/g, '');
                if( fileRequires.indexOf(file) === -1 )
                {
                    fileRequires.push(file);
                }
            })
        }


        if( this._parseConfig.Xtype && xtypeMatch)
        {
            let xtypeNamespaceRegExp = new RegExp(this._parseConfig.xtypeNamespaces.join("|"));
            xtypeMatch.forEach( match => {
                let name = match.replace(/\ |xtype:|'|"/g, '');
                if( name.match(xtypeNamespaceRegExp))
                {
                    if( fileRequires.indexOf(name) === -1 )
                    {
                        fileRequires.push(name);
                    }
                }
                else{
                    console.log("no xtype match : ", name);
                }
            });
            
            
        }
        
        if( requiresMatch )
        {
            console.log(`has requires ${this._file}`);
            let startPos = this._content.search("requires");
            let l = this._content.substring(startPos, this._content.length);
            l = l.replace(requireReg, '');
            let endPos = startPos + l.search(']') + requireStringLength;
            l = l.substring(0, l.search(']'));
            let list = l.match(/"(.*?)"|'(.*?)'/g);
        
            if( list )
            {
                list.forEach( (item) => {
                    let file = item.replace(/'|"/g, '');
                    if( fileRequires.indexOf(file) === -1 )
                    {
                        fileRequires.push(file);
                    }
                });
            }
            else
            {
                console.log("no create statements");
            }
            
            let headerPart = this._content.substring(0, startPos);
            let footerPart = this._content.substring(endPos, this._content.length);
        
            let updatedFile = headerPart;
            updatedFile+= ' requires: [ \n';
        
            fileRequires.forEach( (item) => {
                updatedFile+= '         "'+item+'",\n';
            });
        
            updatedFile+= footerPart;
            this._updatedContent = updatedFile;
        }
        else if(this._content.search("{") > -1 )
        {
            console.log(`no requires ${this._file}`);
            let startPos = this._content.search("{")+1;
            let headerPart = this._content.substring(0, startPos);
            let footerPart = this._content.substring(startPos, this._content.length);
            
            
            let updatedFile = headerPart;
            updatedFile+= '\n   requires: [ \n';
        
            fileRequires.forEach( (item) => {
                updatedFile+= '         "'+item+'",\n';
            });
            updatedFile+= ' ],';
        
            updatedFile+= footerPart;
            this._updatedContent = updatedFile;
        }
        else 
        {
                console.log("Define not found : ", this._file);
        }
        return this;
    };

    FileParser.prototype.save = function(){
        process.exit();
        if( this._updatedContent )
        {
            this._content = this._updatedContent;
        }
        return this.write();
    },

    FileParser.prototype.view = function(){
        console.log(this._updatedContent);
    },

    FileParser.prototype.read = function(callback) {
        if (callback) {
            var listener = function(error, data) {
                this._raw = data || '';
                var response = callback(this.decode(this._raw));

                if (response !== false) {
                    this._content = response || data;
                }
            }.bind(this);

            fs.readFile(this._file, 'utf8', listener);
        } else {
            this._raw = fs.readFileSync(this._file, 'utf8') || '';
            this._content = this.decode(this._raw);
        }
        return this;
    };

    FileParser.prototype.write = function() {
        var output = this.encode(this._content);
        fs.writeFileSync(this._file, output, 'utf-8');
        return this;
    };

    FileParser.prototype.encode = function(data) {
        return data;
    };

    FileParser.prototype.decode = function(data) {
        return this._watcher ? this._watcher(data) : data;
    };

    return FileParser;
}());