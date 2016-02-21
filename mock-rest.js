var fs = require('fs');
var mkdirp = require('mkdirp');

module.exports = {

  get: function(path, json) {
    mkdirp.sync('tmp/mocks/api' + path);
    fs.writeFileSync('tmp/mocks/api' + path + '/GET.json', JSON.stringify(json));
  }
};
