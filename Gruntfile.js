module.exports = function (grunt) {

  grunt.initConfig({
    sass: {
      dist: {
        options: {
          style: 'expanded'
        },
        files: [{
          expand: true,
          cwd: 'assets/scss',
          src: ['*.scss'],
          dest: 'tmp/css',
          ext: '.css'
        }]
      }
    },
    uglify: {
      scripts: {
        files: {
          'main.js': [
            'bower_components/d3/d3.min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'tmp/extensions/*.js',
            'tmp/js/*.js'
          ]
        },
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
        tasks: ['sass', 'concat:styles']
      },
      scripts: {
        files: ['assets/**/*.js'],
        tasks: ['js']
      }
    },
    concat: {
      main: {
        files: {
          'main.js': [
            'bower_components/d3/d3.min.js',
            'bower_components/jquery/dist/jquery.min.js',
            'tmp/**/*.js'
          ]
        }
      },
      styles: {
        files: {
          'style.css': ['tmp/css/*.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('js', ['babel']);
  grunt.registerTask('default', ['sass', 'js', 'concat', 'watch']);

};
