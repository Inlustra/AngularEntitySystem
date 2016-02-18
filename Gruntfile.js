module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        },
        uglify: {
            dist: {
                options: {
                    beautify: true,
                    mangle: false
                },
                files: {
                    'dist/angular-entity-system.js': ['src/**/*.js']
                }
            },
            min: {
                options: {
                    mangle: true
                },
                files: {
                    'dist/angular-entity-system.min.js': ['src/**/*.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'uglify:dist', 'uglify:min']);

};