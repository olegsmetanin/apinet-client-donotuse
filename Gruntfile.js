module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-shell');

	grunt.registerTask('default', ['shell']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});
};