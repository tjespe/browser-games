var app = angular.module("app", ['ngRoute']);

app.config(["$routeProvider", "$sceProvider", "$locationProvider", '$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$sceDelegateProvider', function($routeProvider, $sceProvider, $locationProvider, $controllerProvider, $provide, $compileProvider, $filterProvider, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://script.google.com'
  ]);

  var vp = 'src/views/';

  $routeProvider
    .when('/', {
      templateUrl: vp+'home.html'
    })
  .when('/tag/:category', {
    templateUrl: vp+'category.html',
    controller:'categoryCtrl',
    controllerAs:'cat'
  })
  .when('/search/:category', {
    templateUrl: vp+'category.html',
    controller:'categoryCtrl',
    controllerAs:'cat'
  })
  .when('/id/:id', {
    controller: 'gameCtrl',
    controllerAs: 'g',
    templateUrl: vp+'game.html'
  })
  .when('/submit', {
    templateUrl: vp+'submit.html'
  })
  .when('/cookies', {
    templateUrl: vp+'policy.html'
  })
  .when('/contact', {
    templateUrl: vp+'contact.html'
  })
  .when('/game/:id', {
    redirectTo: '/id/:id'
  })
  .when('/tag', {
    redirectTo: '/'
  })
  .when('/403', {
    templateUrl: vp+'error.html'
  })
  .when('/401', {
    templateUrl: vp+'error.html'
  })
  .otherwise({
    templateUrl: vp+'error.html'
  });
  $sceProvider.enabled(true);

  $locationProvider.html5Mode(true);

  // Enable lazy-loading of controllers and other angular components
  app.controller = function( name, constructor ) {
    $controllerProvider.register( name, constructor );
    return( this );
  };
  app.service = function( name, constructor ) {
    $provide.service( name, constructor );
    return( this );
  };
  app.factory = function( name, factory ) {
    $provide.factory( name, factory );
    return( this );
  };
  app.value = function( name, value ) {
    $provide.value( name, value );
    return( this );
  };
  app.directive = function( name, factory ) {
    $compileProvider.directive( name, factory );
    return( this );
  };
  app.filter = function (name, constructor) {
    $filterProvider.register(name, constructor);
    return( this );
  };
}]);

// This service is for loading important data on page load as well as loading the jQuery library asynchronously
app.service('initialJSON', ['$http', '$lhttp', 'urls', function ($http, $lhttp, urls) {
  var vm = this;
  vm.pass = encodeURIComponent(window.location.search.slice(1)+window.location.hash.slice(1));

  vm.json = $lhttp.get(urls.initialJSON+"?pass="+vm.pass);

  vm.jquery = $lhttp.get("https://code.jquery.com/jquery-2.2.3.min.js", 0);

  vm.jquery.then(function (data) {
    eval(data);
  });
}]);

// This directive makes it possible to run js code in a <script>-tag after page load by adding type="text/javascript-lazy" to the tag
app.directive('script', function() {
  return {
    restrict: 'E',
    scope: false,
    link: function(scope, elem, attr) {
      if (attr.type === 'text/javascript-lazy') {
        var code = elem[0].text;
        eval(code);
      }
    }
  };
});

// Value entry to make the long server side urls more accessible from controllers and other angular components
app.value('urls', {
  'rating': 'https://script.google.com/macros/s/AKfycbzulzGAeSR2eErndxSAUkDi3dXlnmYif0MlkpjnfJsHKVNSMpE/exec',
  'checkIfChanged': 'https://script.google.com/macros/s/AKfycbwx-oLuzjUIAPxMxKiiNFgt6Wgb6T4WGO8UguTGu8HCXUBt-SX7/exec', // This script isn't ready yet
  'comment': 'https://script.google.com/macros/s/AKfycbwK2mif23UU5f9B2NXuvcRT6VajMU7iXQPxRnlKeNtfsD2Eflvz/exec', // Warning: this script isn't tested yet
  'countGames': 'https://script.google.com/macros/s/AKfycbwc3i7zLH3vC8HWnVtBVPqZkv8iOMIlxKZ1E7gL2bdIL8kd9lA/exec',
  'getGames': 'https://script.google.com/macros/s/AKfycbxGh5agyHkqBi5KbpYxl9G2gJlR5kuJzjJ--5BaP-KfcgaItx0/exec',
  'submitGame': 'https://script.google.com/macros/s/AKfycbxh_WPU_DKwT3xAxR0BCcjb_wQ4pQG2nspBbpKra94BEYlO4yw/exec', // Warning: this script isn't tested yet
  'subscribe': '', // This script isn't made yet
  'initialJSON': '/min/initialJSON.json'
});

// This service creates a universal way of loading cacheable resources to improve speed
app.service('$lhttp', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {
  let vm = this;
  vm.ldbOn = true;

  // Attempt to use indexedDB instead of localStorage:
  try {
    !function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();
  } catch (e) {
    console.warn("Unable to use lbd, using localStorage instead. Error:",e);
    vm.ldbOn = false;
  }

  // This is the function that should be called from controllers to load resources
  vm.get = (url, timeout, options, extra_promise)=>{
    let deferred = $q.defer();
    if (typeof options === 'undefined') options = {};
    options.timeout = deferred.promise;
    let request = $http.get(url, options);
    request.success(function (data) {
      // Try to save the data locally
      try {
        vm.ldbOn ? ldb.set(url, JSON.stringify(data)) : localStorage[url] = JSON.stringify(data);
      } catch (e) {console.log("Couldn't save "+url+"-data to storage. Error:",e)}
      deferred.resolve(data);
    });
    request.error(function (data, status) {
      // Try to get the data from a local storage
      try {
        ldb.get(url, (data)=>{
          if (data !== null) {
            deferred.resolve(JSON.parse(data));
          } else {
            typeof localStorage[url] !== "undefined" ? deferred.resolve(JSON.parse(localStorage[url])) : deferred.reject("ERROR");
          }
        });
      } catch (e) {
        try {
          typeof localStorage[url] !== "undefined" ? deferred.resolve(JSON.parse(localStorage[url])) : deferred.reject("ERROR");
        } catch (e) {
          deferred.reject("ERROR");
        }
      }
    });
    // If a timeout is set when calling the function and the data exists locally, the request will be cancelled after the given timeout
    if (typeof timeout !== "undefined") {
      $timeout(function () {
        if (vm.ldbOn) {
          ldb.get(url, (data)=>{
            data !== null ? deferred.resolve(JSON.parse(data)) : "";
          });
        } else if (typeof Storage !== "undefined" && url in localStorage) {
          deferred.resolve(JSON.parse(localStorage[url]));
        }
      }, timeout);
    }
    // If a extra promise is set when calling the function, the request will be cancelled when the promise is cancelled
    if (typeof extra_promise !== "undefined") {
      extra_promise.catch(()=>{
        deferred.reject("Canceled");
      });
    }

    return deferred.promise;
  };
}]);
