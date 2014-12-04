# grunt-twbs

Build Twitter Bootstrap from source with your own separate `.less` files.

__Synopsis__: The [twbs](https://github.com/misterdai/grunt-twbs) task will take a copy of the Twitter Bootstrap source files (available via [Bower](http://bower.io/) or [downloading directly](http://getbootstrap.com/getting-started/#download-source)) and combine it with your customised version of the `bootstrap.less` file.

## Approach

This plugin wraps Bootstrap's own `Gruntfile.js`, in order to avoid effort either ripping out the required build tasks or altering that copy of Bootstrap.  This allows you to easily upgrade to newer versions of Bootstrap and keep your customisations isolated.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-twbs --save-dev
```

### Twitter Bootstrap

You'll need the source files from Twitter Bootstrap.  The easiest way is to use [bower](http://bower.io/) to install it:

```shell
npm install -g bower
bower install bootstrap
```

### Gruntfile.js

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-twbs');
```

## Twbs task
_Run this task with the `grunt twbs` command._

Task targets and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### bootstrap

Type: `String`  
Default: `./bower_components/bootstrap`

Location of your Twitter Bootstrap source files.


#### less

Type: `String`

Location of your customised `.less` file that will be used to build Twitter Bootstrap instead of the standard `bootstrap/less/bootstrap.less` file.

#### dest

Type: `String`

Destination (path and filename) of the `.min.css` file that the Twitter Bootstrap build process will produce.

### Usage examples

#### Basic

A single file to be built.  Files will be output to the `dist` directory within your `bootstrap` source files directory.  The `custom.less` file should be based on Bootstrap's `less/bootstrap.less` file, with your own modifications.

```js
grunt.initConfig({
  twbs: {
    target: {
      less: './src/custom.less'
    }
  }
});
```

## Roadmap

* Add Bootstrap version detection, to possibly support older builds.

## Release History
 * 2014-12-04   v0.0.4   Added `dest` option.
 * 2014-11-28   v0.0.3   Fixed textual mistakes.
 * 2014-11-28   v0.0.2   Added Readme and various other standard files.
 * 2014-11-28   v0.0.1   Initial release of early code.
