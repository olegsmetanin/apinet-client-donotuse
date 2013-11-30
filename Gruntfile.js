module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-image-embed');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', [
		//'recess',
		//'imageEmbed',
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
		'retina',
		'jquery',
		'jquery-migrate',
		'jquery-ui',
		'bootstrap',
		'bootstrap/datepicker',
		'angular',
		'angular-ui-router',
		'angular-ui-bootstrap3',
		'angular-promise-tracker'
	];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/*recess: [
			{
				options: {
					compile: true,
					compress: true
				},
				src: ['Src/Module.less'],
				dest: 'Src/Module.css'
			}
		],*/

		imageEmbed: [
			{
				src: 'src/components/flatty/light-theme.css',
				dest: 'src/components/flatty/light-theme-embedded.css',
				options: {
					deleteAfterEncoding: false,
					maxImageSize: 32768 * 4
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
					name: 'nls/en/angular',
					out: 'release/components.en.js'
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'nls/ru/angular',
					out: 'release/components.ru.js',
					include: ['nls/ru/bootstrap_datepicker']
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/core/module',
					out: 'release/core/module.js',
					exclude: componenentsList,
					map: {
						'*': {
							'ago/components/flatty/light-theme': 'ago/components/flatty/light-theme-embedded'
						}
					}
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/home/module',
					out: 'release/home/module.js',
					exclude: componenentsList.concat(['ago/core/module'])
				})
			},
			{
				options: concatRequireConfigs([
					'debug/requireConfig.js'
				], {
					baseUrl: './',
					name: 'ago/tasks/module',
					out: 'release/tasks/module.js',
					exclude: componenentsList.concat(['ago/core/module'])
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