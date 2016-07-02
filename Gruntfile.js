module.exports = function (grunt) {

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    uglify: {
      dist: {
        files: {
          './dist/jquery.cbsharecount.min.js': './src/app.js'
        }
      }
    },

    watch: {
      js: {
        files: './src/app.js',
        tasks: ['uglify']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['uglify']);
};
