/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dist: {
        src: ['js/index.js', 'js/models/*', 'js/views/*'],
        dest: 'dist/activity.js',
      }
    },
    uglify: {
      options: {
        compress: true
      },
      activity: {
        files: {
          'dist/activity.js': ['dist/activity.js']
        }
      }
    },
    copy: {
      main: {
        files: [
          // TODO: Set up files permissions for all resources
          { cwd: 'js/templates', dest: 'dist/js/templates', src: '**/*', expand: true }, 
          // { cwd: 'js/lib', dest: 'dist/js/lib', src: '**/*', expand: true },
          // { cwd: 'js/sound', dest: 'dist/js/sound', src: '**/*', expand: true },
          // { cwd: 'img', dest: 'dist/img', src: '**/*', expand: true },
          // { cwd: 'css', dest: 'dist/css', src: '**/*', expand: true },
          // { cwd: 'db', dest: 'dist/db', src: '**/*', expand: true }
        ]
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task.
  grunt.registerTask('default', ['concat', 'uglify:activity', 'copy']);

};
