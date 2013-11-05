exports.init = function (grunt) {
	var extend = require('extend');

	return {
		concatRequireConfigs: function (configs, initial) {
			var result = extend(true, {
				baseUrl: '../',
				preserveLicenseComments: false,
				uglify: {
					mangle: false
				}
			}, initial);

			var require = {
				config: function (cfg) {
					result.include = (result.include || []).concat(cfg.include || []);
					result.exclude = (result.exclude || []).concat(cfg.exclude || []);
					result.excludeShallow = (result.excludeShallow || []).concat(cfg.excludeShallow || []);
					result.insertRequire = (result.insertRequire || []).concat(cfg.insertRequire || []);
					result.stubModules = (result.stubModules || []).concat(cfg.stubModules || []);

					delete cfg.include;
					delete cfg.exclude;
					delete cfg.excludeShallow;
					delete cfg.insertRequire;
					delete cfg.stubModules;

					extend(true, result, cfg);
				}
			};

			var define = function (name, module) {
				if (name) {
					var rawText = {};
					rawText[name] = 'define("' + name + '", ' + JSON.stringify(module) + ');';
					extend(true, result, { rawText: rawText });
				}
			};
			require.config({}, define);

			configs = configs || [];
			for (var i = 0; i < configs.length; i++) {
				//noinspection JSHint
				eval(grunt.file.read(configs[i]));
			}

			return result;
		}
	};
};