var assert = require('assert');
var is = require('is2');
var Config = require('../lib/config').Config;

describe('Config()', function() {
    it('Should throw if pathToConfigFile is an empty string.', function() {
        assert.throws(function() { new Config(''); });
    });
});

describe('Config()', function() {
    it('Should throw if pathToConfigFile is not a string.', function() {
        assert.throws(function() { new Config(true); });
    });
});

describe('Config()', function() {
    it('Should throw if pathToConfigFile does not point to a file.', function() {
        assert.throws(function() { new Config('/djdkd/djkdjddk'); });
    });
});

describe('Config()', function() {
    it('Should not throw if pathToConfigFile does point to a file.', function() {
        new Config('./test/cfg_example.js');
    });
});

