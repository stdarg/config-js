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

Using the above configuration file, the following code will not throw an
exception:

    var Config = require('config-js').Config;
    var config = new Config('./test/cfg_example.js');
    assert.ok(config.get('server.port') === 4201);
    assert.ok(config.get('logging.name') === 'mush.js');
    // test default value
    assert.ok(config.get('No.Such.Value.Exists', 511) === 511);
    assert.ok(config.setSepChr('/') === true);
    assert.ok(config.get('server/port') === 4201);
    assert.ok(config.get('logging/name') === 'mush.js');


## API

### Config(pathToConfigFile [, region])
Config provides a simple read-only API to a configuration object.

#### Params: 

* **String** *pathToConfigFile* The configuration file
* **String** *[region]* An optional indicator for the current region (e.g. 'US','JP').

### loadConfig(pathToConfigFile)
Loads the configuration from the location specified by the parameter.

#### Params: 

* **string** *pathToConfigFile* The file name path to the configuration file.

### get(propertyName [, defaultValue] [, sepChr])
Return the value associated with the specified property. If no such property is
found, the provided defaultValue will be returned or undefined if no defaultValue
was provided.

#### Params: 

* **string** *propertyName* The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
* **string** *defaultValue* A default value to use in case no property having propertyName was found.
* **string** *sepChar* Change the default separator character in the path from '.' to whatever you want.

#### Returns:

* The value found, if no value is found, then the default value. If there is no default value then undefined.

### getByRegion(propertyName [, defaultValue] [,sepChar])
Return the region-specific value associated with the specified property. If no such property
is found, the provided defaultValue will be returned or undefined if no defaultValue
was provided.  The region should be provided in the constructor to this object.
If no region was specified when this object was created, the defaultValue will be returned.

#### Params: 

* **String** *propertyName* The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
* **String** *defaultValue* A default value to use in case no property having propertyName was found.
* **string** *sepChar* Change the default separator character in the path from '.' to whatever you want.

#### Returns:

* The value found, if no value is found, then the default value. If there is no default value, then undefined.

### setSepChr(chr)
Change the default separator character from '.' to whatever character you want.

#### Params:
* **string** *chr* The new default separator character in the path.

#### Returns:

* {Boolean} True if the value was set and false otherwise.

## License

The MIT License (MIT)

Copyright (c) 2013,2014 Edmond Meinfelder

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

