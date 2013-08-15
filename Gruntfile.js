module.exports = function(grunt) {
    /*jshint evil:true */

    var sysConfig = {
        srcdir: "src",
        componentsdir: "components",
        builddir: "build",
        distdir: "dist",
        modules: {},
        html2js: {},
        concatjs: {},
        concatcss: {},
        uglify: {},
        copylang: {},
        copyassets: {}
    },
        fs = require('fs'),
        extend = require('extend');

    eval(fs.readFileSync('src/components/include.js') + '');

    fs.readdirSync(sysConfig.srcdir).forEach(function(moduleName) {

        if (moduleName === 'backend' || moduleName === 'components' ||
				fs.statSync(sysConfig.srcdir + '/' + moduleName).isFile()) {
			return;
        }

        eval(fs.readFileSync(sysConfig.srcdir + '/' + moduleName + '/include.js') + '');

        sysConfig.html2js[moduleName] = {
            src: sysConfig.srcdir + '/' + moduleName + '/**/*.tpl.html',
            dest: sysConfig.builddir + '/' + moduleName + '/templates.js',
            module: moduleName + '.templates'
        };

        sysConfig.modules[moduleName].js.push(sysConfig.html2js[moduleName].dest);

        sysConfig.concatjs[moduleName+"js"] = {
            src: sysConfig.modules[moduleName].js,
            dest: sysConfig.builddir + '/' + moduleName + '.js'
        };

        sysConfig.concatcss[moduleName+"css"] = {
            src: sysConfig.modules[moduleName].css,
            dest: sysConfig.distdir + '/' + moduleName + '/assets/styles.min.js'
        };

        sysConfig.uglify[moduleName] = {
            src: sysConfig.concatjs[moduleName+"js"].dest,
            dest: sysConfig.distdir + '/' + moduleName + '/' + moduleName + '.min.js'
        };

        sysConfig.copylang[moduleName + 'lang'] = {
            files: [{
                cwd: sysConfig.srcdir + '/' + moduleName + '/lang',
                dest: sysConfig.distdir + '/' + moduleName,
                src: ['**'],
                expand: true
            }]
        };

        sysConfig.copyassets[moduleName + 'assets'] = {
            files: [{
                cwd: sysConfig.srcdir + '/' + moduleName + '/assets',
                dest: sysConfig.distdir + '/' + moduleName + '/assets',
                src: ['*.png', '*.gif'],
                expand: true
            }]
        };
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-bg-shell');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'jshint', 'html2js', 'concat', 'uglify', 'copy']);


    var gruntConfig = {
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' + ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;\n' + ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n */\n',
        srcdir: sysConfig.srcdir,
        componentsdir: sysConfig.componentsdir,
        builddir: sysConfig.builddir,
        distdir: sysConfig.distdir,

        clean: ['<%= builddir %>', '<%= distdir %>'],
        jshint: {
            files: ['<%= srcdir %>/**/*.js', 'Gruntfile.js'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                globals: {}
            }
        },
        html2js: sysConfig.html2js,
        concat: extend(true, {
                components: {
                    src: sysConfig.modules['components'].js,
                    dest: '<%= distdir %>/components/components.min.js'
                },
                styles: {
                    src: sysConfig.modules['components'].css,
                    dest: "<%= distdir %>/components/assets/styles.min.css"
                }
            },
            sysConfig.concatjs,
            sysConfig.concatcss
        ),
        uglify: extend(true, {
                options: {
                    banner: "<%= banner %>"
                }
            },
            sysConfig.uglify
        ),
        copy: extend(true, {
                bootstrap: {
                    files: [{
                        cwd: '<%= componentsdir %>/bootstrap-2.3.2/img',
                        dest: '<%= distdir %>/components/img',
                        src: '**',
                        expand: true
                    }]
                },
                select2: {
                    files: [{
                        cwd: '<%= componentsdir %>/select2-3.4.1/',
                        dest: '<%= distdir %>/components/assets',
                        src: ['*.png', '*.gif'],
                        expand: true
                    }]
                }
            },
            sysConfig.copylang,
            sysConfig.copyassets
        ),
        connect: {
            server: {
                options: {
                    port: 9000,
                    keepalive: true
                }
            }
        }
    };

    /*grunt.log.writeln(JSON.stringify(gruntConfig, null, 4));*/

    grunt.initConfig(gruntConfig);
};