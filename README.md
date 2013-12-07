config.js
=========

A simple config utility for node.js, that uses a single JavaScript file with an export
JavaScript object.

## Installation

    $ npm install config-js

## Examples

  With a configuration file containing:

    module.exports = {
    
        logging : {
            level: 'info',              // INFO logging level
            name: 'mush.js',            // Category name for logging
        },
    
        server : { port : 4201 }
    };

  Using the above configuration files, the following code will not throw and exception:

    var Config = require('config-js').Config;
    var config = new Config('./test/cfg_example.js');
    assert.ok(config.get('server.port') === 4201);
    assert.ok(config.get('logging.name') === 'mush.js');
    // test default value
    assert.ok(config.get('No.Such.Value.Exists', 511) === 511);


## API

### Config(pathToConfigFile, [region])
Config provides a simple read-only API to a configuration object.

#### Params: 

* **String** *pathToConfigFile* The configuration file
* **String** *[region]* An optional indicator for the current region (e.g. 'US','JP').

### loadConfig(pathToConfigFile)
Loads the configuration from the location specified by the parameter.

#### Params: 

* **string** *pathToConfigFile* The file name path to the configuration file.

### get(propertyName, defaultValue)
Return the value associated with the specified property. If no such property is
found, the provided defaultValue will be returned or undefined if no defaultValue
was provided.

#### Params: 

* **string** *propertyName* The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').

* **string** *defaultValue* A default value to use in case no property having propertyName was found.

#### Returns:

* **The** value found, if no value is found, then the default value. If there is no default value then undefined.

### getByRegion(propertyName, defaultValue)
Return the region-specific value associated with the specified property. If no such property
is found, the provided defaultValue will be returned or undefined if no defaultValue
was provided.  The region should be provided in the constructor to this object.
If no region was specified when this object was created, the defaultValue will be returned.

#### Params: 

* **String** *propertyName* The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
* **String** *defaultValue* A default value to use in case no property having propertyName was found.

#### Returns:

* The value found, if no value is found, then the default value. If there is no default value, then undefined.


## License

[The MIT License (MIT)](http://opensource.org/licenses/MIT/ "MIT License webpage")

