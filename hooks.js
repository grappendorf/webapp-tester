'use strict';

var fs = require('fs');
var rimraf = require('rimraf');
var path = require('path');
var sanitize = require("sanitize-filename");
var steps = require('./steps');

var Hooks = function() {

  this.Before(function(scenario, callback) {
    this.driver = this.createDriver();
    callback();
  });

  this.After(function(scenario, callback) {
    var self = this;

    if (scenario.isFailed()) {
      self.driver.takeScreenshot().then(function(data) {
        var base64Data = data.replace(/^data:image\/png;base64,/, "");
        fs.writeFile(path.join('screenshots', sanitize(scenario.getName() + ".png").replace(/ /g, "_")),
            base64Data, 'base64', function(err) {
              if (err) console.log(err);
            });
      });
    }

    rimraf.sync('tmp/mocks');

    self.driver.manage().deleteAllCookies()
        .then(function() {
          self.driver.quit().then(function() {
            callback();
          })
        });
  });

  steps.call(this);
};

module.exports = Hooks;
