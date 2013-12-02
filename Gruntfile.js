module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-image-embed');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', [
		'imageEmbed',
		'requirejs'
	]);

	var concatRequireConfigs = require('./gruntHelpers').init(grunt).concatRequireConfigs;

	var componenentsList = [
		'css',
		'css-builder',
		'normalize',
		'i18n',
		'domReady',
		'text',
		'modernizr',
		'retina'
	];

	var allComponents = componenentsList.concat([
		'ago/components/jquery-infrastructure',
		'ago/components/bootstrap-infrastructure',
		'ago/components/angular-infrastructure'
	]);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		imageEmbed: [
			{
				src: 'src/components/flatty/light-theme.css',
				dest: 'src/components/flatty/light-theme.css',
				options: {
					deleteAfterEncoding: false,
					maxImageSize: 32768 * 4
				}
			},
			{
				src: 'src/home/states/projects/projectsList.css',
				dest: 'src/home/states/projects/projectsList.css',
				options: {
					deleteAfterEncoding: false
				}
			}
		],
		
		requirejs: [
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'css',
					out: 'release/components.js',
					include: componenentsList
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/components/jquery-infrastructure',
					out: 'release/components/jquery-infrastructure.js',
					exclude: componenentsList
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/components/bootstrap-infrastructure',
					out: 'release/components/bootstrap-infrastructure.js',
					exclude: componenentsList.concat(['ago/components/jquery-infrastructure'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'nls/ru/bootstrap_datepicker',
					out: 'release/components/bootstrap-infrastructure.ru.js',
					exclude: allComponents
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/components/angular-infrastructure',
					out: 'release/components/angular-infrastructure.js',
					exclude: componenentsList.concat(['ago/components/jquery-infrastructure'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'nls/en/angular',
					out: 'release/components/angular-infrastructure.en.js',
					exclude: allComponents
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'nls/ru/angular',
					out: 'release/components/angular-infrastructure.ru.js',
					exclude: allComponents
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/core/module',
					out: 'release/core/module.js',
					exclude: allComponents
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/core/nls/en/module',
					out: 'release/core/module.en.js',
					exclude: allComponents.concat(['ago/core/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/core/nls/ru/module',
					out: 'release/core/module.ru.js',
					exclude: allComponents.concat(['ago/core/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/home/module',
					out: 'release/home/module.js',
					exclude: allComponents.concat(['ago/core/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/home/nls/en/module',
					out: 'release/home/module.en.js',
					exclude: allComponents.concat(['ago/home/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/home/nls/ru/module',
					out: 'release/home/module.ru.js',
					exclude: allComponents.concat(['ago/home/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/tasks/module',
					out: 'release/tasks/module.js',
					exclude: allComponents.concat(['ago/core/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/tasks/nls/en/module',
					out: 'release/tasks/module.en.js',
					exclude: allComponents.concat(['ago/tasks/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/tasks/nls/ru/module',
					out: 'release/tasks/module.ru.js',
					exclude: allComponents.concat(['ago/tasks/module'])
				})
			}
		],

		connect: {
			server: {
				options: {
					port: 9000,
					keepalive: true
				}
			}
		}
	});
};