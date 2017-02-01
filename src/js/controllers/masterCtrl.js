    app.controller('masterCtrl', ['$http', '$window', '$rootScope', '$routeParams', '$scope', '$location', '$timeout', '$injector', '$q', 'initialJSON', '$lazy', function($http, $window, $rootScope, $routeParams, $scope, $location, $timeout, $injector, $q, initialJSON, $lazy) {
      var vm = this;
      vm.disabled = false;
      var block = false;
      var bs = 'font-family:ubuntu;color:#3c763d;background-color: #dff0d8;padding:3px;font-size:15px;';
      vm.norsk = (navigator.language.indexOf('nb')>-1 || navigator.language.indexOf('nn')>-1 || navigator.language.indexOf('no')>-1 || window.location.search.indexOf('lang=no')>-1)  && !(window.location.search.indexOf('lang=en')>-1);
      vm.desc = "";
      vm.games = [];
      vm.categoryGames = {};
      vm.routeChanged = false;
      vm.verifiedUser = false;
      vm.otag = "";
      vm.tags = [];
      vm.x = 18;

      vm.tagLimit = 8;
      vm.showAllTags = false;

      vm.allGamesAreDisplayed = function () {
        if (vm.games.length < vm.x) {return false;}
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
          if (vm.games.length<10) {fr = vm.games.length;}
          var to = fr + x;
          if (to>vm.x) {to = vm.x;}
          var url = '//static.thorin-games.tk/js/get-games-from-db.php?from='+fr+'&to='+to+'&d='+Math.floor(Date.now()/(3.6*10e5));
          if (initialJSON.pass.length>0) url += '&pass='+initialJSON.pass;
          $lazy.get(url, "games_from_"+fr+"_to_"+to, 1400)
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
        vm.rate(x, "like.php", 1);
      };

      vm.dislike = function (x) {
        vm.rate(x, "dislike.php", -1);
      };

      vm.ifDisabled = function () {
        return vm.disabled;
      };

      vm.locChangeAlert = "Please don't leave the page until the server has responded";
      if (vm.norsk) {vm.locChangeAlert = "Vennligst ikke forlat siden før serveren har svart";}

      $rootScope.$on('$locationChangeStart', function(event) {
        if (vm.disabled) {
          event.preventDefault();
          alert(vm.locChangeAlert);
        }
      });

      $window.onbeforeunload = function () {
        if (vm.disabled) {return locChangeAlert;}
      };

      vm.css = "";
      vm.mlcLoaded = false;
      vm.lazyModulesLoaded = false;

      $rootScope.$on('$routeChangeSuccess', function(event) {
        $window.ga('send', 'pageview', { page: $location.url() });
      });

      /*vm.lazyRequest = $http.get('//static.thorin-games.tk/js/lazyModules.php').success(function (data) {
        eval(data);
        vm.lazyModulesLoaded = true;
      });*/

      $lazy.get('https://static.thorin-games.tk/js/lazyModules.php', 'lazyModules', 2000).then(function (data) {
        eval(data);
        vm.lazyModulesLoaded = true;
      });

    }]);
