module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-image-embed');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', [
		'imageEmbed',
		'uglify',
		'requirejs'
	]);

	var concatRequireConfigs = require('./gruntHelpers').init(grunt).concatRequireConfigs;

	var requirePlugins = ['css', 'normalize', 'css-builder', 'domReady', 'i18n'];

	var tinymce = concatRequireConfigs(['requireConfig.js'], (function (config) {
		var plugins = [
			'advlist', 'anchor', 'autolink', 'charmap', 'code', 'contextmenu', 'fullscreen',
			'hr', 'image', 'link', 'media', 'nonbreaking', 'noneditable', 'lists', 'pagebreak',
			'paste', 'searchreplace', 'tabfocus', 'table', 'textcolor', 'visualblocks', 'visualchars'
		];

		config.shim = config.shim || { };
		config.paths = config.paths || { };

		for (var i = 0; i < plugins.length; i++) {
			var module = 'tinymce/plugins/' + plugins[i];

			config.shim[module] = {
				deps: ['tinymce']
			};
			config.paths[module] = 'Prius.Web/Components/tinymce-release/plugins/' + plugins[i] + '/plugin.min';
			config.include.push(module);
		}

		return config;
	})({
		name: 'tinymce',
		out: 'Build/tinymce.js',
		include: ['tinymce/theme', 'css!tinymce/skin'],
		exclude: requirePlugins
	}));

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		imageEmbed: [
			{
				src: 'Components/jquery-ui/themes/smoothness.css',
				dest: 'Components/jquery-ui/themes/smoothness.css',
				options: {
					deleteAfterEncoding: false
				}
			},
			{
				src: [
					'Components/tinymce-release/skins/lightgray/skin.min.css'
				],
				dest: 'Components/tinymce-release/skins/lightgray/skin.min.css',
				options: {
					deleteAfterEncoding: false,
					maxImageSize: 32768 * 2
				}
			},
			{
				src: 'Components/elfinder/css/elfinder.css',
				dest: 'Components/elfinder/css/elfinder.css',
				options: {
					deleteAfterEncoding: false,
					maxImageSize: 32768 * 4
				}
			},
			{
				src: 'Components/bootstrap/dist/css/bootstrap.css',
				dest: 'Components/bootstrap/dist/css/bootstrap.css',
				options: {
					deleteAfterEncoding: false
				}
			}
		],

		uglify: [
			{
				src: 'Components/requirejs/require.js',
				dest: 'Build/requirejs.js'
			}
		],

		requirejs: [
			{
				options: {
					cssIn: 'Components/bootstrap/dist/css/bootstrap.css',
					out: 'Build/bootstrap.css',
					optimizeCss: 'standard'
				}
			},
			{
				options: concatRequireConfigs(['requireConfig.js'], {
					name: 'css',
					out: 'Build/requirejs-plugins.js',
					include: ['css', 'normalize', 'css-builder', 'domReady', 'i18n']
				})
			},
			{
				options: concatRequireConfigs(['requireConfig.js'], {
					name: 'jquery',
					out: 'Build/jquery.js',
					include: ['jquery-ui', 'css!jquery-ui/themes/smoothness'],
					exclude: requirePlugins
				})
			},
			{
				options: concatRequireConfigs(['requireConfig.js'], {
					name: 'bootstrap',
					out: 'Build/bootstrap.js'
				})
			},
			{
				options: concatRequireConfigs(['requireConfig.js'], {
					name: 'elfinder',
					out: 'Build/elfinder.js',
					include: [
						'i18n!nls/elfinder',
						'nls/ar/elfinder', 'nls/de/elfinder', 'nls/es/elfinder', 'nls/fr/elfinder', 'nls/ja/elfinder',
						'nls/pt/elfinder', 'nls/ru/elfinder', 'nls/zh/elfinder', 'nls/it/elfinder', 'nls/ko/elfinder'
					],
					exclude: requirePlugins
				})
			},
			{
				options: tinymce
			}
		]
	});
};