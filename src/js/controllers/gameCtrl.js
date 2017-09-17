app.controller('gameCtrl', ['$scope', '$routeParams', '$http', '$sce', '$interval', '$timeout', '$q', '$window', '$rootScope', '$location', 'initialJSON', '$lhttp', 'urls', function($scope, $routeParams, $http, $sce, $interval, $timeout, $q, $window, $rootScope, $location, initialJSON, $lhttp, urls) {
  let vm = this;
  let block = false, disable = false, fails = 0, canceler = $q.defer(), downloadTime;
  if (location.protocol == 'https:') location.protocol = "http:";
  let url = urls.getGames+'?id='+$routeParams.id+'&pass='+initialJSON.pass;
  vm.gamedata = {};
  vm.showRedirectPrompt = false;
  $lhttp.get(url, 1500).then(function(data) {
    vm.gamedata = data;
    $scope.master.loc = "Thorin-Games — "+data.title;
    $scope.master.desc = data.description;
    let url = $sce.trustAsResourceUrl(vm.gamedata.file);
    if (vm.gamedata.height == "n") vm.gamedata.height = 0.75 * window.innerHeight;
    if (vm.gamedata.height == "r" || vm.gamedata.width == "r") {
      vm.showRedirectPrompt = true;
    } else {
      $('embed').attr('src', url)
    }
    resizeEmbed();

    downloadTime = Date.now();
  });

  vm.rate = function (x, action) {
    disable = true; block = true;

    let request = $http({
      method:"get",
      url: urls.rating+'?action='+action+"&id="+x
    });

    request.success(function(response){
      disable = false; block = false;
      vm.gamedata.likes = response.data;
    });
  };

  vm.refresh = function() {
    disable = true, block = true;
    $http.get(urls.getGames+'?id='+$routeParams.id+'&pass='+initialJSON.pass+'&dt='+Date.now()).success(function(data) {
      vm.gamedata.comments = data.comments;
      downloadTime = Date.now();
      disable = false, block = false;
    });
  };

  vm.ifAnyChanges = function() {
    if (!block && !disable) {
      block = true;
      let url = urls.checkIfChanged+"?d="+Math.floor(Date.now()/10000)+"&id="+$routeParams.id+"&coms="+vm.gamedata.comments.length, start = Date.now();
      let request = $http({
        method: "get",
        url: url,
        timeout: canceler.promise
      });
      request.success(function(data) {
        block = false, fails = 0;
        if (JSON.parse(data)) vm.refresh();
        for (let i = 0; i < vm.gamedata.comments.length; i++) {
          if (!vm.gamedata.comments[i].date) vm.gamedata.comments[i].date = 1459870175813;
          vm.gamedata.comments[i].date += (Date.now()-start)/1000;
        }
      });
      request.error(function(data, status){
        block = false;
      });
    } else if (fails>8) {
      vm.gamedata.comments = [{"com":"Lost contact with server - trying to reconnect","author":"..."}];
      block = false;
      fails++;
    } else {
      fails++;
    }
  };
  let promise = $interval(vm.ifAnyChanges, 2400);

  $scope.$on('$destroy', ()=>$interval.cancel(promise));

  try {
    vm.author = localStorage.username;
  } catch (e) {
    vm.author = "";
  }
  vm.comment = "";
  vm.submit = ()=>{
    if (!disable && vm.comment.length > 0 && vm.author.length > 0) {
      $scope.commentForm.$setUntouched();
      try {localStorage.username = vm.author} catch (e) { }
      disable = true, block = true;
      $http.get(urls.comment+"?id="+$routeParams.id+"&com="+encodeURIComponent(vm.comment)+"&author="+encodeURIComponent(vm.author)).then((response)=>{
        disable = false, block = false;
        vm.comment = "";
        vm.refresh();
      }).catch(()=>{
        alert("Your message was not submitted.\nPlease try again.");
        block = false, disable = false;
      });
    } else $scope.commentForm.$setTouched();
  };

  vm.ifDisabled = ()=>disable;

  $rootScope.$on('$locationChangeStart', function(event) {
    if (disable) {
      event.preventDefault();
      alert($scope.master.locChangeAlert);
    }
  });

  $window.onbeforeunload = function () {
    if (disable) return locChangeAlert;
  };

  vm.goBack = function () {
    if ($scope.master.routeChanged) {
      $window.history.back(1);
    } else {
      $location.path('/');
    }
  };

  vm.scrollDown = function () {
    $('html, body').animate({scrollTop: $(document).height()}, 1000);
  };

  vm.jquery = function () {
    var initialHeight = $('textarea').outerHeight();
    $('textarea').keyup(function () {
      var height = $('form.com-container>div').height() -24;
      $('a.glyphicon[type=submit]').css('line-height', height+'px');
      let maxChars = $('textarea').width()*(30/270);
      let newLines = Math.floor($('textarea').val().length/maxChars) + 1;
      $('textarea').css('height', newLines*initialHeight+'px');
      if (!$scope.view.ifMobile) $('html, body').animate({scrollTop: $(document).height()});
    });

    $( window ).resize(resizeEmbed);
  };

  function resizeEmbed() {
    if (/^[\d.,]+%$/.test(vm.gamedata.height)) {
      initialJSON.jquery.then(function () {
        $('embed').ready(function () {
          $timeout(function () {
            $('embed').attr('height', $('embed').width()*(Number(vm.gamedata.height.split('%')[0])/100)+1);
          }, 1000);
        });
      });
    }
  }

  initialJSON.jquery.then(vm.jquery);

  vm.ifSpace = ()=>window.innerWidth-document.querySelector('embed').clientWidth>140 && !$scope.view.ifMobile;
}]);
