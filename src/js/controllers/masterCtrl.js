app.controller('masterCtrl', ['$http', '$window', '$rootScope', '$routeParams', '$scope', '$location', '$timeout', '$injector', '$q', 'initialJSON', '$lhttp', 'urls', function($http, $window, $rootScope, $routeParams, $scope, $location, $timeout, $injector, $q, initialJSON, $lhttp, urls) {
  let vm = this;
  vm.request_in_progress = false;
  vm.query = "";
  vm.lang = (window.navigator.language).replace(/-.+/g,"");
  vm.availableLangs = ['en','es','no'];
  vm.desc = "";
  vm.games = {"/":[]};
  vm.routeChanged = false;
  vm.verifiedUser = false;
  vm.tags = [{"name":"Puzzle","amount":470},{"name":"Action","amount":334},{"name":"Jigsaw Puzzles","amount":315},{"name":"Shooting","amount":256},{"name":"HTML5","amount":210},{"name":"Racing","amount":202},{"name":"Adventure","amount":196}];
  vm.textData = {};
  vm.showAllTags = false;

  // Check if language is requested in url
  if ((window.location.href).includes("lang=")){
    vm.lang=(window.location.href).replace(/.+lang=/,"");
  }
  // Rewrite Norwegian Bokmål and Norwegian Nynorsk to Norwegian
  vm.lang = (vm.lang == 'nb' || vm.lang == 'nn') ? 'no' : vm.lang;
  // Check if preferred language is available
  vm.lang = vm.availableLangs.indexOf(vm.lang)>-1 ? vm.lang : 'en';

  initialJSON.json.then(function (data) {
    Array.prototype.push.apply(vm.games["/"], data.initialGames);
    vm.verifiedUser = data.verifiedUser;
    vm.tags = data.topTags;
  });

  vm.rate = function (game_id, url) { /* This function is loaded later */ };
  vm.like = function (game_id) {
    vm.rate(game_id, "like", 1);
  };
  vm.dislike = function (game_id) {
    vm.rate(game_id, "dislike", -1);
  };

  vm.ifDisabled = ()=>vm.request_in_progress;

  vm.css = ""; // This string is bound to a <style>-element in the HTML
  vm.mlcLoaded = false; // This variable tells whether or not the mail list system is loaded
  vm.lazyModulesLoaded = false;

  // This function sends pageview to Google Analytics
  $rootScope.$on('$routeChangeSuccess', function(event) {
    try {$window.ga('send', 'pageview', { page: $location.url() });} catch (e) { }
  });

  // Load less important javascript code
  $lhttp.get('min/lazy-js.min.js', 2000).then(function (data) {
    eval(data);
    vm.lazyModulesLoaded = true;
  });

  if (!/bot|curl|spider|google|twitter^$/i.test(navigator.userAgent)) {
    $lhttp.get('src/js/scripts/analytics.js', 0).then((data)=>{
      eval(data);
    });
  }

  // Load text-data
  $lhttp.get('src/js/objects/'+vm.lang+'-text.json').then((data)=>{
    vm.textData = data;
  }).catch((data, status)=>{
    console.log(data, status);
    confirm('Unable to load textdata, do you want to reload the page?') ? location.reload(true) : null;
  });
}]);
