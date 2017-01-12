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
    uglify: {
      scripts: {
        files: {
          'main.js': [
            'assets/**/*.js',
            'bower_components/d3/d3.min.js'
          ]
        }
      }
    },
    watch: {
      sass: {
        files: ['assets/**/*.scss'],
        tasks: ['sass']
      },
      scripts: {
        files: ['assets/**/*.js'],
        tasks: ['uglify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['sass', 'uglify', 'watch']);

};
