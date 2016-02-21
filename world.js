'use strict';

var fs = require('fs');
var webdriver = require('selenium-webdriver');
var mockRest = require('./mock-rest.js');

var platform = process.env.PLATFORM || "CHROME";

var buildAndroidDriver = function() {
  return new webdriver.Builder().
      usingServer('http://localhost:4723/wd/hub').
      withCapabilities({
        platformName: 'Android',
        platformVersion: '4.4',
        deviceName: 'Android Emulator',
        browserName: 'Chrome'
      }).
      build();
};

var buildChromeDriver = function() {
  return new webdriver.Builder().
      withCapabilities(webdriver.Capabilities.chrome()).
      build();
};

var createDriver = function() {
  switch (platform) {
    case 'ANDROID':
      var driver = buildAndroidDriver();
      break;
    default:
      var driver = buildChromeDriver();
  }

  driver.visit = function(path) {
    return this.get(this.url + '/index.html' + path);
  };

  driver.waitFor = function(f, timeout) {
    var self = this;
    var waitTimeout = timeout || 20000;
    return self.wait(f, waitTimeout);
  };

  driver.waitForCssWithText = function(cssLocator, text, timeout) {
    var self = this;
    var waitTimeout = timeout || 20000;
    return self.wait(function() {
      return self.findElement({css: cssLocator}).then(function(element) {
        return element.getText().then(function(elementText) {
          return elementText.match(new RegExp(text, 'g')) != null;
        });
      }, function() {
        return false
      });
    }, waitTimeout);
  };

  driver.url = 'http://localhost:' + process.env['GRUNT_CONNECT_PORT'];

  return driver;
};

var World = function World(callback) {

  var screenshotPath = "screenshots";

  this.createDriver = createDriver;
  this.webdriver = webdriver;
  this.mockRest = mockRest;

  if(!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath);
  }

  callback();
};

module.exports = World;
