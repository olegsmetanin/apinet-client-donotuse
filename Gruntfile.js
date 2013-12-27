module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('build', function () {
		var fs = require('fs');
		var files = fs.readdirSync('src');
		var folders = [ ];
		var i;

		for(i = 0; i < files.length; i++){
			var path = 'src/' + files[i];
			if(!fs.statSync(path).isDirectory()) {
				continue;
			}
			folders.push(path);
		}

		var doneCount = 0;
		var done = this.async();
		var doneFn = function(error, result) {
			if(result && result.stderr) {
				console.error(result.stderr);
			}
			if(result && result.stdout) {
				console.log(result.stdout);
			}

			doneCount++;
			if(doneCount === folders.length) {
				done();
			}
		};

		for(i = 0; i < folders.length; i++) {
			grunt.util.spawn({
				grunt: true,
				args: [''],
				opts: {
					cwd: folders[i]
				}
			}, doneFn);
		}
	});

	grunt.registerTask('default', ['build','connect']);
	grunt.registerTask('run', ['connect']);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		connect: [
			{
				options: {
					port: 9000,
					keepalive: true
				}
			}
		]
	});
};