/*!
 * A very simple configuration utility, that uses a JavaScript file as a
* config. The '.js' file must have the config data in module.exports, e.g.:
 *
 * module.exports = {
 *     region : 'US',
 *     port : 4201,
 *     [...]
 * };
 */
'use strict';

module.exports = Config;

var assert = require('assert');
var is = require('is2');
var fs = require('fs');
var path = require('path');
var have = require('have');
var makeObjConst = require('const-obj').makeObjConst;
var propPath = require('property-path');
var defaultSepChr = '.';

/**
 * Config provides a simple read-only API to a configuration object.
 * @param {String} pathToConfigFile The configuration file
 * @param {String} [region] Optional indicator for the current region, e.g. 'en'
 */
function Config(pathToConfigFileIn, region) {
    have(arguments, {pathToConfigFile: 'str', region: 'opt str' });

    // if the path has '##' and process.env.NODE_ENV is a non-empty string,
    // replace '##' with the contents of process.env.NODE_ENV
    var pathToConfigFile = pathToConfigFileIn;
    var idx = pathToConfigFileIn.indexOf('##');
    if (idx > -1 && is.nonEmptyStr(process.env.NODE_ENV)) {
        pathToConfigFile = pathToConfigFileIn.substr(0, idx) +
            process.env.NODE_ENV + pathToConfigFileIn.substr(idx+2);
    }

    // complimentary to have arg checking
    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(fs.existsSync(pathToConfigFile));
    if (is.defined(region))  assert.ok(is.nonEmptyStr(region));

    // english is the default
    if (is.undefined(region)) region = 'en';

    this.pathToConfigFile = pathToConfigFile;
    this.region = region;
    var self = this;

    // set a watch for when the file changes, to reload the file.
    fs.watchFile(this.pathToConfigFile, function () {
        self.loadConfig(self.pathToConfigFile, self.region);
    });

    // we can't wait for the file to change to re-load, so we load it now
    this.loadConfig(this.pathToConfigFile, this.region);
}

/**
 * Set the default separator character used for property strings.
 * @param {String} chr The new default character to separate properties in the path string.
 */
Config.prototype.setSepChr = function(chr) {
    have(arguments, {chr: 'str'});
    if (is.nonEmptyStr(chr)) {
        defaultSepChr = chr;
        return true;
    }
    return false;
};

/**
 * Loads the configuration from the location specified by the parameter.
 * @param {string} pathToConfigFile The file name path to the configuration file.
 * @return {Boolean} true if the new default character was set and false otherwise.
 */
Config.prototype.loadConfig = function(pathToConfigFile) {
    have(arguments, {pathToConfigFile: 'str'});

    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(fs.existsSync(pathToConfigFile));

    pathToConfigFile = path.resolve(pathToConfigFile);
    if (require.cache[pathToConfigFile])
        delete require.cache[pathToConfigFile];

    this.configObj = require(pathToConfigFile);
    if (!this.region && this.configObj && this.configObj.region)
        this.region = this.configObj.region;

    makeObjConst(this.configObj);
};

/**
 * Return the value associated with the specified property. If no such property is
 * found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.
 *
 * @param {string} propertyName The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param {string} defaultValue A default value to use in case no property having propertyName was found.
 * @return The value found, if no value is found, then the default value. If there is no default value then undefined.
 */
Config.prototype.get = function(propertyName, defaultValue, sep) {
    have(arguments, {propertyName: 'str', sep: 'opt str'});

    assert.ok(is.nonEmptyStr(propertyName));
    if (!is.nonEmptyStr(sep))  sep = defaultSepChr;

    if (!is.nonEmptyString(propertyName))
        return defaultValue || null;

    var currVal = propPath.get(this.configObj, propertyName, sep);
    var isValid = ('undefined'!==typeof currVal && null!==currVal);
    return isValid ? currVal : defaultValue;
};

/**
 * Return the region-specific value associated with the specified property. If no such property
 * is found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.  The region should be provided in the constructor to this object.
 * If no region was specified when this object was created, the defaultValue will be returned.
 *
 * @param {String} propertyName The name of the property to look for. May include '.' characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param {String} defaultValue A default value to use in case no property having propertyName was found.
 * @return The value found, if no value is found, then the default value. If there is no default value, then undefined.
 */
Config.prototype.getByRegion = function(propertyName, defaultValue, sep) {
    have(arguments, {propertyName: 'str', sep: 'opt str'});

    assert.ok(is.nonEmptyStr(propertyName));
    if (this.region === undefined || propertyName === undefined)
        return defaultValue;

    propertyName = this.region + '.' + propertyName;
    return this.get(propertyName, defaultValue, sep);
};
