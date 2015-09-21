/* jshint node:true */

/*
 * grunt-twbs
 * https://github.com/misterdai/grunt-twbs
 *
 * Copyright (c) 2014 David Boyer
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var fs = require('fs-extra');

module.exports = function(grunt) {
  grunt.registerMultiTask('twbs', 'Custom Twitter Bootstrap', function() {
    var options = this.options({
      less: './src/bootstrap.less',
      bootstrap: './bower_components/bootstrap',
      cmd: 'dist-css'
    });

    // Make a list of files to process (can take any less file)
    var ownFiles = grunt.file.expand({cwd:options.less}, '*.less')
    if (ownFiles.length === 0) {
        grunt.log.warn('No files found at less (' +options.less + ')');
    }

    // Check the Bootstrap directory exists
    if (!fs.existsSync(options.bootstrap)) {
      grunt.log.error('Unable to locate Bootstrap (' + options.bootstrap + ')');
      return false;
    }

    // Move the original *.less
    for (var i = 0, len = ownFiles.length; i < len; i++) {
        var backupBs = path.join(options.bootstrap, 'less', ownFiles[i].replace('.less', '.original.less'));
        var targetBs = path.join(options.bootstrap, 'less', ownFiles[i]);

        // Move the original Twitter Bootstrap `*.less` files out of the way - Works 1st time only to avoid overwriting
        if (!fs.existsSync(backupBs)) {
          fs.renameSync(
            targetBs,
            backupBs
          );
        }

        // Copy our own less files (will replace any old ones)
        fs.copySync(path.join(options.less, ownFiles[i]), path.join(options.bootstrap, 'less', ownFiles[i]));
    }


    var done = this.async();

    grunt.verbose.writeln('Found source files: ' + grunt.log.wordlist(ownFiles));

    // Fires off Twitter Bootstrap's Grunt task for building the CSS
    var twbsGrunt = function() {
      grunt.log.writeln('Running Bootstrap CSS task (' + options.cmd + ')');
      grunt.util.spawn(
        {
          grunt: true,
          args: [options.cmd],
          opts: {
            cwd: path.resolve(options.bootstrap)
          }
        },
        function (err, result, code) {
          if (err || code) {
            grunt.log.error('Error executing Bootstrap task (' + options.cmd + ')');
            console.log(result.stdout);
            return done(false);
          }
          grunt.log.writeln('Bootstrap (' + options.cmd + ') built');
          if (options.dest) {
            grunt.file.copy(
              path.join(path.resolve(options.bootstrap), 'dist/css/bootstrap.min.css'),
              options.dest
            );
          }
          done();
        }
      );
    };

    // Bootstrap will need its modules installed in order to build
    var twbsNpm = function() {

      if (fs.existsSync(path.resolve(path.join(options.bootstrap, 'node_modules')))) {
        // Modules found, skip step
        return twbsGrunt();
      }
      grunt.log.writeln('Installing Bootstrap required modules');
      grunt.util.spawn(
        {
          cmd: 'npm',
          args: ['install'],
          opts: {
            cwd: path.resolve(options.bootstrap)
          }
        },
        function (err, result, code) {
          if (err || code) {
            grunt.log.error('Error installing Bootstrap modules');
            return done(false);
          }
          grunt.log.writeln('Bootstrap modules installed');
          twbsGrunt();
        }
      );
    };

    // Execute the tasks in bootstrap's grunt
    twbsNpm();

  });
};