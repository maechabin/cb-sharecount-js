module.exports = function (grunt) {

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({

        uglify: {
            dist: {
                files: {
                    // 出力ファイル: 元ファイル
                    'jquery.cbsharecount.min.js': 'jquery.cbsharecount.js'
                }
            }
        },

        watch: {
            js: {
                files: 'js/*.js',
                tasks: ['uglify']
            }
        }
    });

    // プラグインのロード・デフォルトタスクの登録
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['uglify']);

};