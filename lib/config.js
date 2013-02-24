/**
 * @fileOverview
 * A very simple configuration utility, that uses a JavaScript file as a config. The '.js' file
 * must have the config data in module.exports, e.g.:
 *
 * module.exports = {
 *     region : 'US',
 *     port : 4201,
 *     [...]
 * };
 */
'use strict';

var assert = require('assert');
var is = require('is2');
var fs = require('fs');
var path = require('path');
var MushUtils = require('./MushUtils');
exports.Config = Config;

/**
 * A wrapper object providing a simple read-only API for a configuration object.
 * @constructor
 * @param {string} pathToConfigFile The configuration file 
 * @param {string} [region] An optional indicator for the current region (e.g. 'US','JP').
 */
function Config(pathToConfigFile, region) {

    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(is.nonEmptyStr(region));

    if (pathToConfigFile === undefined || pathToConfigFile.length === 0)
        throw new Error('The argument, pathToConfigFile, is not valid.');

    if (!fs.existsSync(pathToConfigFile))
        throw new Error('There is no file at "'+pathToConfigFile+'".');

    this.pathToConfigFile = pathToConfigFile;
    this.region = region;
    var self = this;    // in the watchFIle CB, 'this' has no meaning

    // set a watch for when the file changes, to reload the file.
    fs.watchFile(this.pathToConfigFile, function (curr, prev) {
        self.loadConfig(self.pathToConfigFile, self.region);
    });

    // we ca't wait for the file to change to re-load, so we load it now
    this.loadConfig(this.pathToConfigFile, this.region);
}

/**
 * Is the specified argument a regular javascript object?
 *
 * The argument is an object if it's a JS object, but not an array.
 *
 * @protected
 * @method _isObject
 * @param {MIXED} arg An argument of any type.
 * @return {boolean} TRUE if the arg is an object, FALSE if not
 */
Config.prototype.isObject = function(obj) {
    return (typeof obj == 'object') && !(Array.isArray(obj));
};

/**
 * Loads the configuration from the location specified by the parameter.
 * @param {string} pathToConfigFile The file name path to the configuration file.
 */
Config.prototype.loadConfig = function(pathToConfigFile) {

    assert.ok(is.nonEmptyStr(pathToConfigFile));

    if (!fs.existsSync(pathToConfigFile))
        throw new Error('There is no file at "'+pathToConfigFile+'".');

    pathToConfigFile = path.resolve(pathToConfigFile);
    if (require.cache[pathToConfigFile])
        delete require.cache[pathToConfigFile]

    this.configObj = require(pathToConfigFile);
    if (!this.region && this.configObj && this.configObj.region)
        this.region = this.configObj.region;

    MushUtils.makeImmutableRecurse(this.configObj);
    //this.makeImmutableRecurse(this.configObj);
};

/**
 * Return the value associated with the specified property. If no such property is
 * found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.
 *
 * @param propertyName {string} The name of the property to look for. May include '.' characters 
 * indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param defaultValue {string} A default value to use in case no property having propertyName
 * was found.
 * @return The value found, if no value is found, then the default value.
 */
Config.prototype.get = function(propertyName, defaultValue) {

    assert.ok(is.nonEmptyStr(propertyName));

    if ('string' !== typeof propertyName)
        return defaultValue || null;

    var properties = propertyName.split('.');
    var currVal = this.configObj;

    for (var i=0; i<properties.length; i++) {
        var currPropertyName = properties[i];
        if (!currVal.hasOwnProperty(currPropertyName))
            return defaultValue;
        currVal = currVal[currPropertyName];
    }

    var isValid = 'undefined'!==typeof currVal&&null!==currVal;
    return isValid ? currVal : defaultValue;
};

/**
 * Return the region-specific value associated with the specified property. If no such property is
 * found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.  The region should be provided in the constructor to this object.
 *
 * If no region was specified when this object was created, the defaultValue will be returned.
 *
 * @param {string} propertyName The name of the property to look for. May include '.' characters 
 * indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param {string} defaultValue A default value to use in case no property having propertyName
 * was found.
 * @return The value found, if no value is found, then the default value.
 */
Config.prototype.getByRegion = function(propertyName, defaultValue) {

    assert.ok(is.nonEmptyStr(propertyName));
    if (this.region == undefined || propertyName == undefined)
        return defaultValue;

    propertyName = this.region + '.' + propertyName;
    return this.get(propertyName, defaultValue);
};
