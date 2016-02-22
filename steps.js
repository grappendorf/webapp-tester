module.exports = function() {

  this.When(/^I visit "([^"]*)"$/, function(path, next) {
    this.driver.visit(path).then(function() {
      next()
    });
  });

  this.When(/^I click on "([^"]*)"$/, function(text, next) {
    this.driver.findElement(this.webdriver.By.xpath("//*[normalize-space()='" + text + "']")).then(function(element) {
      element.click().then(function() {
       next();
      });
    }, function() {
      next.fail('Page doesn\'t contain "' + text + '"');
    });
  });

  this.When(/^I fill in "([^"]*)" with "([^"]*)"$/, function(label, text, next) {
    var self = this;
    self.driver.findElement(self.webdriver.By.xpath("//label[normalize-space()='" + label + "']")).then(function(element) {
      element.getAttribute('id').then(function(id) {
        self.driver.findElement(self.webdriver.By.xpath("//input[@aria-labelledby='" + id + "']")).then(function(element) {
          element.sendKeys(text).then(function() {
            next();
          });
        })
      });
    }, function() {
      next.fail('Page doesn\'t contain "' + label + '"');
    });
  });

  this.Then(/^I should see "([^"]*)"$/, function(text, next) {
    this.driver.getPageSource().then(function(page) {
      if (page.indexOf(text) >= 0) {
        next();
      } else {
        next.fail('Page doesn\'t contain "' + text + '"');
      }
    });
  });
};
