module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-image-embed');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', [
		'shell',
		'recess',
		'imageEmbed',
		'requirejs',
		'concat',
		'uglify',
		'copy'
	]);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		shell: [
			{
				command: '"./node_modules/.bin/bower" install',
				options: {
					stdout: true,
					strerr: true
				}
			}
		],

		recess: {
			options: {
				compile: true
			},
			agoBox: {
				src: 'directives/agoBox.less',
				dest: 'directives/agoBox.css'
			},
			filteredList: {
				src: 'directives/filters/filteredList.less',
				dest: 'directives/filters/filteredList.css'
			},
			sortableHeading: {
				src: 'directives/sortableHeading.less',
				dest: 'directives/sortableHeading.css'
			},
			projectsList: {
				src: 'states/projects/projectsList.less',
				dest: 'states/projects/projectsList.css'
			}
		},

		imageEmbed: [
			{
				src: 'components/select2/select2.css',
				dest: 'components/select2/select2-embeded.css',
				options: {
					deleteAfterEncoding : false
				}
			},
			{
				src: 'states/projects/projectsList.css',
				dest: 'states/projects/projectsList.css',
				options: {
					deleteAfterEncoding : false
				}
			}
		],

		requirejs: [
			{
				options: {
					baseUrl: '../',
					mainConfigFile: 'main.js',
					optimize: 'none',
					name: 'core/module',
					out: '../../release/core/module.js',
					include: ['domReady'],
					stubModules: ['jquery'],
					paths: {
						'jquery/select2/theme': 'core/components/select2/select2-embeded'
					}
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

		concat: {
			options: {
				separator: ';'
			},
			core: {
				src: ['components/jquery/jquery.js','../../release/core/module.js'],
				dest: '../../release/core/module.js'
			}
		},

		uglify: {
			options: {
				mangle: false
			},
			core: {
				src: '../../release/core/module.js',
				dest: '../../release/core/module.js'
			}
		},

		copy: {
			themes: {
				src: 'themes/**',
				dest: '../../release/core/'
			},
			requirejs: {
				src: 'components/requirejs/require.js',
				dest: '../../release/core/require.js'
			},
			main: {
				src: 'mainProd.js',
				dest: '../../release/core/main.js'
			}
		}
	});
};