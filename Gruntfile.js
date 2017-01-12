module.exports = function (grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: {
          'style.css': 'assets/**/*.scss'
        }
      }
    },
    watch: {
      sass: {
        files: ['**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        },
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass', 'watch']);

};
