/*!
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

var mname = exports.name = 'config.js';
exports.Config = Config;

var assert = require('assert');
var is = require('is2');
var fs = require('fs');
var path = require('path');

/**
 * A wrapper object providing a simple read-only API for a configuration object.
 * @param {String} pathToConfigFile The configuration file
 * @param {String} [region] An optional indicator for the current region (e.g. 'US','JP').
 */
function Config(pathToConfigFile, region) {

    // english is the default
    if (is.undefined(region)) region = 'en';

    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(fs.existsSync(pathToConfigFile));
    assert.ok(is.nonEmptyStr(region));

    this.pathToConfigFile = pathToConfigFile;
    this.region = region;
    var self = this;

    // set a watch for when the file changes, to reload the file.
    fs.watchFile(this.pathToConfigFile, function (curr, prev) {
        self.loadConfig(self.pathToConfigFile, self.region);
    });

    // we can't wait for the file to change to re-load, so we load it now
    this.loadConfig(this.pathToConfigFile, this.region);
}

/**
 * Loads the configuration from the location specified by the parameter.
 * @param {string} pathToConfigFile The file name path to the configuration file.
 */
Config.prototype.loadConfig = function(pathToConfigFile, region) {

    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(fs.existsSync(pathToConfigFile));

    pathToConfigFile = path.resolve(pathToConfigFile);
    if (require.cache[pathToConfigFile])
        delete require.cache[pathToConfigFile]

    this.configObj = require(pathToConfigFile);
    if (!this.region && this.configObj && this.configObj.region)
        this.region = this.configObj.region;

    makeObjImmutable(this.configObj);
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

    if (!is.nonEmptyString(propertyName))
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
 * Return the region-specific value associated with the specified property. If no such property
 * is found, the provided defaultValue will be returned or undefined if no defaultValue
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

/**
 * Recursively make each property in the object and its sub-objects immutable.
 * @param {object} obj An object for which to make immutable properties.
 * @return {Object} The object passed in.
 */
function makeObjImmutable(obj) {

    if (!is.obj(obj) && !is.arrayLike(obj))
        return;

    for (var prop in obj) {
        if (!obj.hasOwnProperty(prop))
            continue;

        if (is.obj(obj[prop]))
            makeObjImmutable(obj[prop]);
        else
            makePropImmutable(obj, prop);
    }

    return obj;
};

/**
 * Make a property immutable (assuring it cannot be changed from the current value).
 * This operation cannot be un-done.
 * @param {Object} object - The object to attach an immutable property into.
 * @param {String} property - The name of the property to make immutable.
 * @return {Object} object - The original object is returned - for chaining.
 */
function makePropImmutable(object, property) {

    assert.ok(is.object(object));
    assert.ok(is.nonEmptyStr(property));

    // Disable writing, and make sure the property cannot be re-configured.
    Object.defineProperty(object, property, {
        value : object[property],
        writable : false,
        configurable: false
     });

    return object;
};
