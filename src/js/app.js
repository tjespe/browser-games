var app = angular.module("app", ['ngRoute']);

app.config(["$routeProvider", "$sceProvider", "$locationProvider", '$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$sceDelegateProvider', function($routeProvider, $sceProvider, $locationProvider, $controllerProvider, $provide, $compileProvider, $filterProvider, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    'self',
    'https://static.thorin-games.tk/**',
    'http://static.thorin-games.tk/**'
  ]);

  var vp = '//static.thorin-games.tk/views/';
  var params = window.location.search;

  $routeProvider
  .when('/', {
    templateUrl: vp+'home.php'+params
  })
  .when('/tag/:category', {
    templateUrl: vp+'category.php'+params,
    controller:'categoryCtrl',
    controllerAs:'cat'
  })
  .when('/search/:category', {
    templateUrl: vp+'category.php'+params,
    controller:'categoryCtrl',
    controllerAs:'cat'
  })
  .when('/id/:id', {
    controller: 'gameCtrl',
    controllerAs: 'g',
    templateUrl: vp+'game.php'+params
  })
  .when('/submit', {
    templateUrl: vp+'submit.php'+params
  })
  .when('/cookies', {
    templateUrl: vp+'policy.php'+params
  })
  .when('/contact', {
    templateUrl: vp+'contact.php'+params
  })
  .when('/game/:id', {
    redirectTo: '/id/:id'
  })
  .when('/tag', {
    redirectTo: '/'
  })
  .when('/403', {
    templateUrl: vp+'error.php?error_code=403'
  })
  .when('/401', {
    templateUrl: vp+'error.php?error_code=401'
  })
  .otherwise({
    templateUrl: vp+'error.php?error_code=404'
  });
  $sceProvider.enabled(true);

  $locationProvider.html5Mode(true);

  // Activate lazy-loading of modules:
  app._controller = app.controller;
  app._service = app.service;
  app._factory = app.factory;
  app._value = app.value;
  app._directive = app.directive;
  // Provider-based controller.
  app.controller = function( name, constructor ) {
    $controllerProvider.register( name, constructor );
    return( this );
  };
  // Provider-based service.
  app.service = function( name, constructor ) {
    $provide.service( name, constructor );
    return( this );
  };
  // Provider-based factory.
  app.factory = function( name, factory ) {
    $provide.factory( name, factory );
    return( this );
  };
  // Provider-based value.
  app.value = function( name, value ) {
    $provide.value( name, value );
    return( this );
  };
  // Provider-based directive.
  app.directive = function( name, factory ) {
    $compileProvider.directive( name, factory );
    return( this );
  };
  // Provider-based filter
  app.filter = function (name, constructor) {
    $filterProvider.register(name, constructor);
    return( this );
  };
}]);

app.service('$lazy', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
  var vm = this;

  vm.get = function (url, name, timeout) {
    var deferred = $q.defer();
    var resolved = false;
    var request = $http.get(url);
    request.success(function (data) {
      if (typeof Storage !== "undefined") {
        try {
          localStorage[name] = JSON.stringify(data);
        } catch (e) {
          console.log("Couldn't save "+name+"-data to storage even though storage exists. Error:",e);
        }
      }
      deferred.resolve(data);
      resolved = true;
    });
    request.error(function (data, status) {
      if (typeof Storage !== "undefined" && name in localStorage) {
        console.info("The request to",name,"failed, but data existed locally");
        deferred.resolve(JSON.parse(localStorage[name]));
        resolved = true;
      } else {
        deferred.reject("ERROR");
      }
    });
    if (typeof timeout !== "undefined") {
      $timeout(function () {
        if (!resolved && typeof Storage !== "undefined" && name in localStorage) {
          deferred.resolve(JSON.parse(localStorage[name]));
          console.info("Timeout reached for",name,"but data existed locally");
        }
      }, timeout);
    }
    return deferred.promise;
  };
}]);

app.service('initialJSON', ['$http', /*'$q',*/ '$lazy', function ($http, /*$q*/ $lazy) {
  var vm = this;
  vm.pass = encodeURIComponent(window.location.search.slice(1)+window.location.hash.slice(1));
  var url = 'https://static.thorin-games.tk/js/initialJSON.php';
  if (vm.pass.length>0) url += '?pass='+vm.pass;

  vm.json = $lazy.get(url, "initialJSON");
  //vm.json = lazyLoad("initialJSON", url);

  //vm.lazyModules = lazyLoad("lazyModules", "//static.thorin-games.tk/js/lazyModules.php");

  vm.jquery = $lazy.get("https://code.jquery.com/jquery-2.2.3.min.js", "jquery", 0);
  //vm.jquery = lazyLoad("jquery", "https://code.jquery.com/jquery-2.2.3.min.js");

  vm.jquery.then(function (data) {
    eval(data);
  });

  /*var deferred = $q.defer();
  vm.json = deferred.promise;

  var request = $http.get(url);

  request.success(function (data) {
    if (typeof Storage !== "undefined") {
      localStorage.initialJSON = data;
    }
    deferred.resolve(data);
  });
  request.error(function (data, status) {
    if (typeof Storage !== "undefined" && "initialJSON" in localStorage) {
        deferred.resolve(localStorage.initialJSON);
    }
  });*/

  //vm.jquery = $http.get('').success(function (data) { eval(data); });

  /*function lazyLoad (name, url) {
    var deferred = $q.defer();
    var request = $http.get(url);
    request.success(function (data) {
      if (typeof Storage !== "undefined") {
        localStorage[name] = JSON.stringify(data);
      }
      deferred.resolve(data);
    });
    request.error(function (data, status) {
      if (typeof Storage !== "undefined" && name in localStorage) {
        deferred.resolve(JSON.parse(localStorage[name]));
      }
    });
    return deferred.promise;
  }*/
}]);

app.directive('script', function() {
  return {
    restrict: 'E',
    scope: false,
    link: function(scope, elem, attr) {
      if (attr.type === 'text/javascript-lazy') {
        var code = elem[0].text;
        eval(code);
        /*var code = elem.text();
        var f = new Function(code);
        f();*/
      }
    }
  };
});
