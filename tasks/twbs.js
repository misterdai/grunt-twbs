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
var fs = require('fs');

module.exports = function(grunt) {
  grunt.registerMultiTask('twbs', 'Custom Twitter Bootstrap', function() {
    var options = this.options({
      less: './src/bootstrap.less',
      bootstrap: './bower_components/bootstrap'
    });

    var beforeDir = process.cwd();
    // Check the Bootstrap directory exists
    if (!fs.existsSync(options.bootstrap)) {
      grunt.log.error('Unable to locate Bootstrap (' + options.bootstrap + ')');
      return false;
    }

    // Move the original bootstrap.less
    var originalBs = path.join(options.bootstrap, 'less', 'bootstrap.original.less');
    var targetBs = path.join(options.bootstrap, 'less', 'bootstrap.less');
    var srcBs = path.resolve(options.less);

    // Move the original Twitter Bootstrap `bootstrap.less` file out of the way
    if (!fs.existsSync(originalBs)) {
      fs.renameSync(
        targetBs,
        originalBs
      );
    }

    // Remove any previous version of the `bootstrap.less` file
    if (fs.existsSync(targetBs)) {
      fs.unlinkSync(targetBs);
    }

    var done = this.async();

    // Fires off Twitter Bootstrap's Grunt task for building the CSS
    var twbsGrunt = function() {
      grunt.log.writeln('Running Bootstrap CSS task');
      grunt.util.spawn(
        {
          grunt: true,
          args: ['dist-css'],
          opts: {
            cwd: path.resolve(options.bootstrap)
          }
        },
        function (err, result, code) {
          if (err || code) {
            grunt.log.error('Error executing Bootstrap CSS task');
            console.log(result.stdout);
            return done(false);
          }
          grunt.log.writeln('Bootstrap CSS built');
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

    // Copy the source `.less` file to the Bootstrap directory
    fs.createReadStream(srcBs)
      .on('end', twbsNpm)
      .pipe(fs.createWriteStream(targetBs));
  });
};