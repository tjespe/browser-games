app.controller('tabCtrl', function(){
  var that = this;
  this.tab = 1;
  this.setTab = function (x) {
    that.tab = x;
  };
  this.checkTab = function (x) {
    return that.tab === x;
  };
});
