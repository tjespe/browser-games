app.service('local', [function () {
  var vm = this;
  vm.supported = typeof(Storage) !== "undefined";

  vm.set = function (key, value, expiration) {
    if (typeof expiration !== "undefined") {
      localStorage[key] = JSON.stringify({
        str: value,
        expirationDate: expiration
      });
    } else {
      localStorage[key] = JSON.stringify({
        str: value
      });
    }
  };

  vm.get = function (key) {
    if (vm.keyExist(key)) {
      return JSON.parse(localStorage[key]).str;
    }
    return;
  };

  vm.setExpiration = function (key, ms) {
    var obj = JSON.parse(localStorage[key]);
    obj.expirationDate = ms;
    localStorage[key] = JSON.stringify(obj);
  };

  vm.getExpiration = function (key) {
    if (typeof JSON.parse(localStorage[key]).expirationDate !== "undefined") {
      return JSON.parse(localStorage[key]).expirationDate;
    } else {
      return Infinity;
    }
  };

  vm.keyExist = function (key) {
    return typeof localStorage[key] !== "undefined";
  };

  for (var key in localStorage) {
    if (vm.keyExist(key) && typeof localStorage[key].expirationDate !== "undefined" && localStorage[key].expirationDate < Date.now()) {
      delete localStorage[key];
    }
  };

}]);
