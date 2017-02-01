app.controller('locationCtrl', function(){
  var that = this;
  this.tab = 1;
  this.setTab = function (x) {
    that.tab = x;
  };
  this.checkTab = function (x) {
    return that.tab === x;
  };
  var url = window.location.href;
  this.ifAbout = function () {
    if (url.indexOf('about') > -1) {
      return true;
    } else {
      return false;
    }
  };
  this.ifContact = function () {
    if (url.indexOf('contact') > -1) {
      return true;
    } else {
      return false;
    }
  };
  this.ifError = function() {
    if (url.indexOf('404') > -1) {
      return true;
    } else {
      return false;
    }
  };
  this.ifNews = function() {
    if (url.indexOf('news') > -1) {
      return true;
    } else {
      return false;
    }
  };
  if (that.ifAbout()) {
    that.tab = 2;
  }
  if(that.ifContact()) {
    that.tab = 3;
  }
  if(that.ifError()) {
    that.tab = 0;
  }
  if(that.ifNews()) {
    that.tab = 4;
  }
});
