config.js
=========

A simple config utility for node.js, that uses a single JavaScript file with an export
JavaScript object.

# Installation

    $ npm install config-js

# API

## Config(pathToConfigFile:String, region:String)

  Config provides a simple read-only object and an API to the configuration object.

## Config.loadConfig(pathToConfigFile:String)

  Loads the configuration from the location specified by the parameter.

## Config.get(propertyName:String, defaultValue:String)

  Return the value associated with the specified property. If no such property is
  found, the provided defaultValue will be returned or undefined if no defaultValue
  was provided.

## Config.getByRegion(propertyName:String, defaultValue:String)

  Return the region-specific value associated with the specified property. If no such property
  is found, the provided defaultValue will be returned or undefined if no defaultValue
  was provided.  The region should be provided in the constructor to this object.
  If no region was specified when this object was created, the defaultValue will be returned.

# Examples

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

# License

[The MIT License (MIT)](http://opensource.org/licenses/MIT/ "MIT License webpage")