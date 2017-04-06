app.controller('gameCtrl', ['$scope', '$routeParams', '$http', '$sce', '$interval', '$timeout', '$q', '$window', '$rootScope', '$location', 'initialJSON', '$lhttp', 'urls', function($scope, $routeParams, $http, $sce, $interval, $timeout, $q, $window, $rootScope, $location, initialJSON, $lhttp, urls) {
  let vm = this;
  let block = false, disable = false, fails = 0, canceler = $q.defer(), downloadTime;
  if (location.protocol == 'https:') location.protocol = "http:";
  let errorText = $scope.master.norsk ? "Dette spillet kan ikke spilles her. Trykk her for å bli videresendt til riktig side" : "This game can not be played here. Click here to be redirected" ;
  let url = urls.getGames+'?id='+$routeParams.id+'&pass='+initialJSON.pass;
  $lhttp.get(url, 1500).then(function(data) {
    $scope.detail = data;
    $scope.master.loc = "Thorin-Games — "+data.title;
    $scope.master.desc = data.description;
    $scope.url = $sce.trustAsResourceUrl($scope.detail.file);
    if ($scope.detail.height == "n") $scope.detail.height = 0.75 * window.innerHeight;
    if ($scope.detail.height == "r" || $scope.detail.width == "r") {
      let linkUl = document.createElement('ul');
      linkUl.setAttribute('class', 'nav nav-pills redirect');
      linkUl.innerHTML = '<li style="float:none"><a style="color:#fbfbfb" href="' + $scope.url + '">'+text+'</a></li>';
      document.getElementById('wrapper').appendChild(linkUl);
    } else {
      $('embed').attr('src', $scope.url)
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
      $scope.detail.likes = response.data;
    });
  };

  $scope.refresh = function() {
    disable = true, block = true;
    $http.get(urls.getGames+'?id='+$routeParams.id+'&pass='+initialJSON.pass+'&dt='+Date.now()).success(function(data) {
      $scope.detail.comments = data.comments;
      downloadTime = Date.now();
      disable = false, block = false;
    });
  };

  $scope.ifAnyChanges = function() {
    if (!block && !disable) {
      block = true;
      let url = urls.checkIfChanged+"?d="+Math.floor(Date.now()/10000)+"&id="+$routeParams.id+"&coms="+$scope.detail.comments.length, start = Date.now();
      let request = $http({
        method: "get",
        url: url,
        timeout: canceler.promise
      });
      request.success(function(data) {
        block = false, fails = 0;
        if (JSON.parse(data)) $scope.refresh();
        for (let i = 0; i < $scope.detail.comments.length; i++) {
          if (!$scope.detail.comments[i].date) $scope.detail.comments[i].date = 1459870175813;
          $scope.detail.comments[i].date += (Date.now()-start)/1000;
        }
      });
      request.error(function(data, status){
        block = false;
      });
    } else if (fails>8) {
      $scope.detail.comments = [{"com":"Lost contact with server - trying to reconnect","author":"..."}];
      block = false;
      fails++;
    } else {
      fails++;
    }
  };
  let promise = $interval($scope.ifAnyChanges, 2400);

  $scope.$on('$destroy', ()=>$interval.cancel(promise));

  try {
    $scope.author = localStorage.username;
  } catch (e) {
    $scope.author = "";
  }
  $scope.comment = "";
  $scope.submit = ()=>{
    if (!disable && $scope.comment.length > 0 && $scope.author.length > 0) {
      $scope.commentForm.$setUntouched();
      try {localStorage.username = $scope.author} catch (e) { }
      disable = true, block = true;
      $http.get(urls.comment+"?id="+$routeParams.id+"&com="+$scope.comment+"&author="+$scope.author).then((response)=>{
        disable = false, block = false;
        $scope.detail.comments = response.data;
        $scope.comment = "";
        $scope.refresh();
      }).catch(()=>{
        alert("Your message was not submitted.\nPlease try again.");
        block = false, disable = false;
      });
    } else $scope.commentForm.$setTouched();
  };

  $scope.ifDisabled = ()=>disable;

  $rootScope.$on('$locationChangeStart', function(event) {
    if (disable) {
      event.preventDefault();
      alert($scope.master.locChangeAlert);
    }
  });

  $window.onbeforeunload = function () {
    if (disable) return locChangeAlert;
  };

  $scope.goBack = function () {
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
    if (/^[\d.,]+%$/.test($scope.detail.height)) {
      initialJSON.jquery.then(function () {
        $('embed').ready(function () {
          $timeout(function () {
            $('embed').attr('height', $('embed').width()*(Number($scope.detail.height.split('%')[0])/100)+1);
          }, 1000);
        });
      });
    }
  }

  initialJSON.jquery.then(vm.jquery);

  vm.ifSpace = ()=>window.innerWidth-document.querySelector('embed').clientWidth>140 && !$scope.view.ifMobile;
}]);
