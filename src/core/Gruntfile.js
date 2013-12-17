module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', [
		'shell',
		'requirejs',
		'copy'
	]);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		shell: [
			{
				command: '"./node_modules/.bin/bower" install',
				options: {
					stdout: true
				}
			}
		],

		requirejs: [
			{
				options: {
					baseUrl: '../',
					mainConfigFile: 'main.js',
					uglify: {
						mangle: false
					},
					name: 'core/module',
					out: '../../release/core/module.js',
					include: ['domReady', 'jquery-ui'],
					exclude: [
						'jquery',
						'core/themes/flatty/theme'
					]
				}
			},
			{
				options: {
					baseUrl: '../',
					mainConfigFile: 'main.js',
					uglify: {
						mangle: false
					},
					name: 'core/nls/en/module',
					out: '../../release/core/module.en.js',
					include: [
						'core/nls/en/angular'
					],
					exclude: ['core/module']
				}
			},
			{
				options: {
					baseUrl: '../',
					mainConfigFile: 'main.js',
					uglify: {
						mangle: false
					},
					name: 'core/nls/ru/module',
					out: '../../release/core/module.ru.js',
					include: [
						'core/nls/ru/angular',
						'core/nls/ru/bootstrap_datepicker'
					],
					exclude: ['core/module']
				}
			}
		],

		copy: {
			themes: {
				src: 'themes/**',
				dest: '../../release/core/'
			},
			requirejs: {
				src: 'components/requirejs/**',
				dest: '../../release/core/'
			},
			requirecss: {
				src: 'components/require-css/**',
				dest: '../../release/core/'
			},
			jquery: {
				src: 'components/jquery/**',
				dest: '../../release/core/'
			},
			main: {
				src: 'mainProd.js',
				dest: '../../release/core/main.js'
			}
		}
	});
};