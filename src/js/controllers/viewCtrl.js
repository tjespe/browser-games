app.controller('viewCtrl', [function() {
  let vm = this;
  vm.ifMobile = 'ontouchstart' in window;
  vm.showHeader = ()=>!window.location.href.includes('/id/');
}]);
