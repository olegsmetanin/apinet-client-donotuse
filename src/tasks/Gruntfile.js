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
					name: 'tasks/module',
					out: '../../release/tasks/module.js',
					paths: {
						'jquery': 'empty:',
						'angular': 'empty:'
					}
				}
			}
		],

		copy: {
			nls: {
				src: 'nls/**',
				dest: '../../release/tasks/'
			},
			main: {
				src: 'mainProd.js',
				dest: '../../release/tasks/main.js'
			}
		}
	});
};