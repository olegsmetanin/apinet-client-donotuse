module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-shell');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['shell']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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