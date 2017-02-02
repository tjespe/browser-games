app.controller('gameCtrl', ['$scope', '$routeParams', '$http', '$sce', '$interval', '$timeout', '$q', '$window', '$rootScope', '$location', 'initialJSON', '$lhttp', function($scope, $routeParams, $http, $sce, $interval, $timeout, $q, $window, $rootScope, $location, initialJSON, $lhttp) {
  var vm = this;
  var block = false;
  var disable = false;
  var fails = 0;
  var canceler = $q.defer();
  var downloadTime;
  var bigSuccess = 'font-family:ubuntu;color:#3c763d;background-color: #dff0d8;padding:3px;font-size:15px;';
  var rh = 0.75 * window.innerHeight;
  var text = "This game can't be played here. Click here to be redirected";
  if (location.protocol == 'https:') location.protocol = "http:";
  vm.showGame = false;
  if ($scope.master.norsk) {text = "Dette spillet kan ikke spilles her. Trykk her for å bli videresendt til riktig side";}
  $scope.noInstr = false;
  var url = '//static.thorin-games.tk/js/get-games-from-db.php?id='+$routeParams.id+'&pass='+initialJSON.pass;
  $lhttp.get(url, 1500).then(function(data) {
    $scope.detail = data;
    console.log("data.mobile = (",typeof data.mobile,") ",data.mobile);
    $scope.master.loc = "Thorin-Games — "+data.title;
    $scope.master.desc = data.description;
    if ($scope.detail.instructions.length<2) {
      $scope.noInstr = true;
    }
    $scope.url = $sce.trustAsResourceUrl($scope.detail.file);
    if ($scope.detail.height == "n") {$scope.detail.height = rh;}
    if ($scope.detail.height == "r" || $scope.detail.width == "r") {
      var linkUl = document.createElement('ul');
      linkUl.setAttribute('class', 'nav nav-pills redirect');
      linkUl.innerHTML = '<li style="float:none"><a style="color:#fbfbfb" href="' + $scope.url + '">' + text + "</a></li>";
      document.getElementById('wrapper').appendChild(linkUl);
    } else {
      $('embed').attr('src', $scope.url)
    }
    resizeEmbed();

    downloadTime = Date.now();

  });

  var rate = function (x, url) {
    disable = true; block = true;
    var start = Date.now();

    var request = $http({
      method:"post",
      url: '//static.thorin-games.tk/php/'+url,
      data: x,
      headers: { 'Content-Type':'application/x-www-form-url-encoded' }
    });

    request.success(function(data){
      var stop = Date.now();
      var diff = (stop - start)/1000;
      console.log("%cDin rating er sendt, requesten tok "+diff+" sek, her er statistikk fra serveren:", bigSuccess);
      console.log(data.logdata);
      //$scope.detail.likes = data.likes;
      disable = false; block = false;
    });
  };

  $scope.like = function(x) {
    rate(x, "like.php", 1);
    $scope.detail.likes += 1;
  };
  $scope.dislike = function(x) {
    rate(x, "dislike.php", -1);
    $scope.detail.likes -= 1;
  };

  $scope.refresh = function() {
    disable = true;block = true;
    var start = Date.now();
    var stop;
    $http.get('//static.thorin-games.tk/js/get-games-from-db.php?id='+$routeParams.id+'&pass='+initialJSON.pass+'&dt='+Date.now()).success(function(data) {
      $scope.detail.comments = data.comments;
      stop = Date.now();
      var dur = stop - start;
      downloadTime = Date.now();
      disable = false;
      block = false;
    });
  };

  $scope.ifAnyChanges = function() {
    if (!block && !disable) {
      block = true;
      var u = "//static.thorin-games.tk/php/check-if-db-changed.php?"+Math.floor(Date.now()/10000);
      var start = Date.now();
      var request = $http({
        method: "post",
        url: u,
        ignoreLoadingBar: true,
        data: {
          index: $routeParams.id,
          coms: $scope.detail.comments.length
        },
        timeout: canceler.promise
      });
      request.success(function(data) {
        var stop = Date.now();
        block = false;
        fails = 0;
        var dur = stop - start;
        var up = JSON.parse(data);
        if (up) {
          $scope.refresh();
        }
        var diff = downloadTime - stop;
        for (var i = 0; i < $scope.detail.comments.length; i++) {
          if (!$scope.detail.comments[i].date) $scope.detail.comments[i].date = 1459870175813;
          $scope.detail.comments[i].date += diff/1000;
        }
      });
      request.error(function(data, status){
        block = false;
        console.error("$scope.ifAnyChanges() failed. The data returned was: "+data+" and the status code: "+status);
      });
    } else if (fails>8) {
      $scope.detail.comments = [{"com":"Lost contact with server - trying to reconnect","author":"..."}];
      block = false;
      fails++;
    } else {
      fails++;
      console.warn("Skulle sjekke om kommentarene måtte oppdateres, men avbrøt fordi forrige request ikke er besvart, dette har skjedd "+fails+" gang(er).");
    }
  };
  var promise = $interval($scope.ifAnyChanges, 2400);

  $scope.$on('$destroy', function(){
    $interval.cancel(promise);
  });

  try {
    $scope.author = localStorage.username;
  } catch (e) {
    $scope.author = "";
  }
  $scope.comment = "";
  $scope.submit = function() {
    if (!disable) {
      if ($scope.comment.length > 0 && $scope.author.length > 0) {
        $scope.commentForm.comment.$setUntouched();
        $scope.commentForm.author.$setUntouched();
        try {
          localStorage.username = $scope.author;
        } catch (e) {
          console.log(e);
        }
        disable = true;
        block = true;
        var start = Date.now();
        var request = $http({
          method: "post",
          url: "//static.thorin-games.tk/php/comment-in-db.php",
          data: {
            index: $routeParams.id,
            com: $scope.comment,
            author: $scope.author,
            date: Date.now()
          }
        });

        request.success(function(data) {
          disable = false;
          var stop = Date.now();
          var diff = stop - start;
          $scope.detail.comments = data.comments;
          $scope.comment = "";
          $scope.tab = 1;
          block = false;
        });

        request.error(function(status){
          alert("Your message was not submitted.\nPlease try again.");
          block = false;
          disable = false;
        });
      } else {
        $scope.commentForm.comment.$setTouched();
        $scope.commentForm.author.$setTouched();
      }
    }
  };

  $scope.ifDisabled = function() {
    return disable;
  };

  $rootScope.$on('$locationChangeStart', function(event) {
    if (disable) {
      event.preventDefault();
      alert($scope.master.locChangeAlert);
    }
  });

  $window.onbeforeunload = function () {
    if (disable) {return locChangeAlert;}
  };

  $scope.goBack = function () {
    if ($scope.master.routeChanged) {
      $window.history.back(1);
    } else {
      $location.path('/');
    }
  };

  var mchars, nlines, initialHeight;

  vm.scrollDown = function () {
    $('html, body').animate({scrollTop: $(document).height()}, 1000);
  };

  vm.jquery = function () {
    /*if ($routeParams.id != '445') {
      $('embed').css("background-color", "#fbfbfb");
    }*/
    var initialHeight = $('textarea').outerHeight();
    $('textarea').keyup(function () {
      var height = $('form.com-container>div').height() -24;
      $('a.glyphicon[type=submit]').css('line-height', height+'px');
      mchars = $('textarea').width()*(30/270);
      nlines = Math.floor($('textarea').val().length/mchars) + 1;
      $('textarea').css('height', nlines*initialHeight+'px');
      if (!$scope.view.ifMobile) {
        $('html, body').animate({scrollTop: $(document).height()});
      }
    });

    // Change the height of responsive embed frames
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

  $scope.ifSpace = function () {
    return window.innerWidth-document.querySelector('embed').clientWidth>140 && !$scope.view.ifMobile;
  }

}]);
