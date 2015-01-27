
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                src: 'sortable.js',
                dest: 'sortable.min.js'
            }
        },

        jshint: {
            options: {
                jshintrc: true
            },
            source: 'sortable.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');


    grunt.registerTask('build', ['jshint', 'uglify']);
}