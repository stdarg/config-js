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

describe('get()', function() {
    it('Should retrieve values from the configuration file.', function() {
        var config = new Config('./test/cfg_example.js');
        assert.ok(config.get('server.port') === 4201);
        assert.ok(config.get('logging.name') === 'mush.js');
        // test default value
        assert.ok(config.get('No.Such.Value.Exists', 511) === 511);
    });
});

describe('getByRegion()', function() {
    it('Should retrieve values from the configured region of the config file.', function() {
        var config = new Config('./test/cfg_example2.js');
        assert.ok(config.getByRegion('welcome') === 'Welcome to this file.');
        assert.ok(config.get('en.welcome') === 'Welcome to this file.');

        var config = new Config('./test/cfg_example2.js', 'de');
        assert.ok(config.getByRegion('welcome') === 'Willkommen zu dieser datei.');
        assert.ok(config.get('de.welcome') === 'Willkommen zu dieser datei.');

        var config = new Config('./test/cfg_example2.js', 'es');
        assert.ok(config.getByRegion('welcome') === 'Bienvenidos a este archivo.');
        assert.ok(config.get('es.welcome') === 'Bienvenidos a este archivo.');
    });
});
