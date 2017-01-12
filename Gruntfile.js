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
            'bower_components/d3/d3.min.js', 
            'tmp/**/*.js'
          ]
        }
      }
    },
    babel: {
        options: {
            sourceMap: true,
            presets: ['es2015']
        },
        dist: {
            files: [
              {
                expand: true,
                src: ['assets/**/*.js'],
                dest: 'tmp/',
                ext: '.js'
              }
            ]
        }
    },
    watch: {
      sass: {
        files: ['assets/**/*.scss'],
        tasks: ['sass']
      },
      scripts: {
        files: ['assets/**/*.js'],
        tasks: ['js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('js', ['babel', 'uglify']);
  grunt.registerTask('default', ['sass', 'js', 'watch']);

};
