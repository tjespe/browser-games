var app = angular.module("app", ['ngRoute']);

app.config(["$routeProvider", "$sceProvider", "$locationProvider", '$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$sceDelegateProvider', function($routeProvider, $sceProvider, $locationProvider, $controllerProvider, $provide, $compileProvider, $filterProvider, $sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'https://script.google.com'
  ]);
  $sceProvider.enabled(true);

  let vp = 'src/views/';
  $routeProvider
  .when('/', {
    templateUrl: vp+'home.html'
  })
  .when('/tag/:category', {
    templateUrl: vp+'category.html'
  })
  .when('/search/:category', {
    templateUrl: vp+'category.html'
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
  .when('/tag', {
    redirectTo: '/'
  })
  .otherwise({
    templateUrl: vp+'error.html'
  });
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
  /*app.factory = function( name, factory ) {
    $provide.factory( name, factory );
    return( this );
  };
  app.value = function( name, value ) {
    $provide.value( name, value );
    return( this );
  };*/
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
app.service('initialJSON', ['$http', '$httpx', 'urls', function ($http, $httpx, urls) {
  let vm = this;
  vm.pass = encodeURIComponent(window.location.search.slice(1)+window.location.hash.slice(1));
  vm.json = $httpx.get(vm.pass.length ? "https://script.google.com/macros/s/AKfycbzEVUBnYRqGOFS6309I9Oe748omXUWLjpDScrjYatNvxKuL6BEU/exec?pass=" + vm.pass : urls.initialJSON, {lifetime: 1000*60*60});

  vm.jquery = $httpx.get("https://code.jquery.com/jquery-2.2.3.min.js", {lifetime: Infinity});
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
        eval(elem[0].text);
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
