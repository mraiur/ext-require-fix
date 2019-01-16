Update ExtJS classes/defines to include used classes in requires list.


## Base path configuration

```
"baseExtPath" : "/projects/project/ext/",
```

The base path prepended for parsing classes.

## test configuration

```
"test": false,
```

If set to true will parse and PREVIEW a test.js file.

! Just for conviniece not to run on all of the application codebase.


## Search directories configuration

```
"directories" : [
        { 
            "dir": "Common",
            "exclude" : [
                "/projects/project/ext/not_extjs_file.js"
            ]
        },

        { 
            "dir": "App", 
            "exclude" : [
                
            ]
        }
    ]
```

List of directories to be search for classes with undefined requires.

- **dir** - A subdirectory in **baseExtPath** containing extjs classes.
- **exclude** - Files to be skipped while running the parser. For example non ext class files/custom files.

## Parsing configuration

```
"parseConfig" : {
        "xtypeNamespaces" : ["Core", "PracticeDent"],
        "ExtCreate": true,
        "Xtype" : true
    },
```

- **xtypeNamespaces** - List of namespace to be search when **parseConfig.Xtype is true**
- **ExtCreate** - Search provided classes form components used with Ext.create and not defined in requires
- **Xtype** - Search provided classes using xtype component creation and not defined in requires 