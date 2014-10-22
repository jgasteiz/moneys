module.exports = function (grunt) {

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        devStaticDir: 'static',

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                expand: true,
                cwd: '<%= devStaticDir %>/scss/',
                src: ['*.scss'],
                dest: '<%= devStaticDir %>/css/',
                ext: '.css'
            },
            dev: {
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true
                },
                expand: true,
                cwd: '<%= devStaticDir %>/scss/',
                src: ['*.scss'],
                dest: '<%= devStaticDir %>/css/',
                ext: '.css'
            }
        },

        watch: {
            sassDev: {
                files: ['<%= devStaticDir %>/scss/**/*.scss'],
                tasks: ['sass:dev', 'notify:css']
            }
        },

        concurrent: {
            watch: {
                tasks: ['watch:sassDev'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        notify: {
            css: {
                options: {
                    title: 'Task Complete',
                    message: 'CSS is ready'
                }
            }
        }
    });

    grunt.registerTask('default', ['sass:dev', 'concurrent:watch']);
};
