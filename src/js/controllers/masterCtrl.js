app.controller('masterCtrl', ['$http', '$window', '$rootScope', '$routeParams', '$scope', '$location', '$timeout', '$injector', '$q', 'initialJSON', '$lhttp', 'urls', function($http, $window, $rootScope, $routeParams, $scope, $location, $timeout, $injector, $q, initialJSON, $lhttp, urls) {
  var vm = this;
  vm.disabled = false;
  var block = false;
  //add lang for language scalability
  vm.lang = (window.navigator.language).replace(/-.+/g,"");
  vm.availableLangs = [];
  vm.desc = "";
  vm.games = [];
  vm.categoryGames = {};
  vm.routeChanged = false;
  vm.verifiedUser = false;
  vm.otag = "";
  vm.tags = [{"name":"Puzzle","amount":470},{"name":"Action","amount":334},{"name":"Jigsaw Puzzles","amount":315},{"name":"Shooting","amount":256},{"name":"HTML5","amount":210},{"name":"Racing","amount":202},{"name":"Adventure","amount":196}];
  vm.x = 18;
  vm.textData = {};
  vm.tagLimit = 8;
  vm.showAllTags = false;
  vm.availableLangs = ['en','es','no'];

  //check if language is requested in url
  if((window.location.href).includes("lang=")){
    vm.lang=(window.location.href).replace(/.+lang=/,"");
  }

  //check against the available languages
  vm.lang = vm.availableLangs.indexOf(vm.lang)>-1 ? vm.lang : 'en';

  vm.allGamesAreDisplayed = function () {
    if (vm.games.length < vm.x) return false;
    return true;
  };

  initialJSON.json.then(function (data) {
    Array.prototype.push.apply(vm.games, data.initialGames);
    vm.verifiedUser = data.verifiedUser;
    vm.tags = data.topTags;
    vm.x = data.count;
  });

  vm.requestGames = function (x) {
    if (!block && !vm.allGamesAreDisplayed()) {
      block = true;
      var fr = vm.games.length;
      var url = urls.getGames+'?from='+fr+'&amount='+x+'&d='+Math.floor(Date.now()/(3.6*10e5));
      if (initialJSON.pass.length>0) url += '&pass='+initialJSON.pass;
      $lhttp.get(url, 1400)
        .then(function(data){
          Array.prototype.push.apply(vm.games, data.data);
          block = false;
        })
      .catch(function (data, status) {
        console.log(data, status);
        block = false;
      });
    }
  };

  vm.rate = function (x, url) {

  };

  vm.like = function (x) {
    vm.rate(x, "like", 1);
  };

  vm.dislike = function (x) {
    vm.rate(x, "dislike", -1);
  };

  vm.ifDisabled = ()=>vm.disabled;

  vm.locChangeAlert = "Please don't leave the page until the server has responded";
  if (vm.lang === "no") vm.locChangeAlert = "Vennligst ikke forlat siden før serveren har svart";
  if (vm.lang === "es") vm.locChangeAlert = "Por favor no salgas de la pagina hasta que el servidor responda";

  $rootScope.$on('$locationChangeStart', function(event) {
    if (vm.disabled) {
      event.preventDefault();
      alert(vm.locChangeAlert);
    }
  });

  $window.onbeforeunload = function () {
    if (vm.disabled) return locChangeAlert;
  };

  vm.css = "";
  vm.mlcLoaded = false;
  vm.lazyModulesLoaded = false;

  $rootScope.$on('$routeChangeSuccess', function(event) {
    try {$window.ga('send', 'pageview', { page: $location.url() });} catch (e) { }
  });

  $lhttp.get('min/lazy-js.min.js', 2000).then(function (data) {
    eval(data);
    vm.lazyModulesLoaded = true;
  });

  if (!/bot|curl|spider|google|twitter^$/i.test(navigator.userAgent)) {
    $lhttp.get('src/js/scripts/analytics.js', 0).then((data)=>{
      eval(data);
    });
  }
  $lhttp.get('src/js/objects/'+vm.lang+'-text.json').then((data)=>{
    vm.textData = data;
  }).catch((data, status)=>{
    console.log(data, status);
    confirm('Unable to load textdata, do you want to reload the page?') ? location.reload(true) : null;
  });

}]);
