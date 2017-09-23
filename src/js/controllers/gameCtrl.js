app.controller("gameCtrl", ["$scope", "$routeParams", "$http", "$sce", "$interval", "$timeout", "$window", "$location", "initialJSON", "$httpx", "urls", function ($scope, $routeParams, $http, $sce, $interval, $timeout, $window, $location, initialJSON, $httpx, urls) {
  let vm = this;
  let block_auto_refresh = false, request_in_progress = false, refresh_fails = 0;
  if (location.protocol === "https:") { location.protocol = "http:"; }
  vm.gamedata = {};
  vm.showRedirectPrompt = false;
  vm.loading = true;
  $httpx.get(urls.getGames+"?id="+$routeParams.id+"&pass="+initialJSON.pass, {lifetime: 60*60*1000}).then((data)=>{
    vm.gamedata = data;
    vm.loading = false;
    $scope.master.loc = "Thorin-Games — "+data.title;
    $scope.master.desc = data.description;
    let game_url = $sce.trustAsResourceUrl(vm.gamedata.file);
    if (vm.gamedata.height === "n") { vm.gamedata.height = 0.75 * window.innerHeight; }
    if (vm.gamedata.height === "r" || vm.gamedata.width === "r") {
      vm.showRedirectPrompt = true;
    } else {
      $("embed").attr("src", game_url);
    }
    resizeEmbed();
  });

  vm.rate = (x, action)=>{
    request_in_progress = true; block_auto_refresh = true;
    $http.get(urls.rating+"?action="+action+"&id="+x).then((response)=>{
      request_in_progress = false; block_auto_refresh = false;
      vm.gamedata.likes = response.data.data;
    });
  };

  vm.ifDisabled = ()=>request_in_progress;

  // Using try/catch because so many errors can occur, but it does not really affect user experience
  try {
    vm.author = localStorage.username;
  } catch (e) {
    vm.author = "";
  }
  vm.comment = "";
  vm.submit_comment = ()=>{
    if (!request_in_progress && vm.comment.length > 0 && vm.author.length > 0) {
      $scope.commentForm.$setUntouched();
      try { localStorage.username = vm.author; } catch (e) { }
      request_in_progress = true; block_auto_refresh = true;
      $http.get(urls.comment+"?id="+$routeParams.id+"&com="+encodeURIComponent(vm.comment)+"&author="+encodeURIComponent(vm.author)).then((response)=>{
        request_in_progress = false; block_auto_refresh = false;
        vm.comment = "";
        refresh_comments();
      }).catch(()=>{
        alert("Your message was not submitted.\nPlease try again.");
        block_auto_refresh = false; request_in_progress = false;
      });
    } else {
      $scope.commentForm.$setTouched();
    }
  };

  vm.goBack = ()=>$scope.master.routeChanged ? $window.history.back(1) : $location.path("/");

  vm.jquery = ()=>{
    let initialHeight = $("textarea").outerHeight();
    $("textarea").keyup(()=>{
      $("a.glyphicon[type=submit]").css("line-height", ($(".comments>form>div").height() - 24)+"px");
      let maxChars = $("textarea").width()*(30/270);
      let newLines = Math.floor($("textarea").val().length/maxChars) + 1;
      $("textarea").css("height", newLines*initialHeight+"px");
      if (!$scope.master.ifMobile) {
        $("html, body").animate({scrollTop: $(document).height()});
      }
    });

    $(window).resize(resizeEmbed);
  };

  function resizeEmbed() {
    if (/^[\d.,]+%$/.test(vm.gamedata.height)) {
      initialJSON.jquery.then(()=>{
        $("embed").ready(()=>{
          $timeout($("embed").attr, 1000, true, "height", $("embed").width()*(Number(vm.gamedata.height.split("%")[0])/100)+1);
        });
      });
    }
  }

  function refresh_comments() {
    request_in_progress = true; block_auto_refresh = true;
    $http.get(urls.getGames+"?id="+$routeParams.id+"&pass="+initialJSON.pass+"&dt="+Date.now()).success((data)=>{
      vm.gamedata.comments = data.comments;
      request_in_progress = false; block_auto_refresh = false;
    });
  }

  let promise = $interval(()=>{
    if (!block_auto_refresh && !request_in_progress) {
      block_auto_refresh = true;
      let status_data_url = urls.checkIfChanged+"?d="+Math.floor(Date.now()/10000)+"&id="+$routeParams.id+"&coms="+vm.gamedata.comments.length, start = Date.now();
      $http.get(status_data_url).then((response)=>{
        block_auto_refresh = false; refresh_fails = 0;
        if (JSON.parse(response.data)) { refresh_comments(); }
        for (let i = 0; i < vm.gamedata.comments.length; i++) {
          if (!vm.gamedata.comments[i].date) { vm.gamedata.comments[i].date = 1459870175813; }
          vm.gamedata.comments[i].date += (Date.now()-start)/1000;
        }
      }).catch(()=>{
        block_auto_refresh = false;
      });
    } else if (refresh_fails>8) {
      vm.gamedata.comments = [{"com":"Lost contact with server - trying to reconnect","author":"..."}];
      block_auto_refresh = false;
      refresh_fails++;
    } else {
      refresh_fails++;
    }
  }, 2400);
  $scope.$on("$destroy", ()=>$interval.cancel(promise));

  initialJSON.jquery.then(vm.jquery);

  vm.ifSpace = ()=>window.innerWidth-document.querySelector("embed").clientWidth>140 && !$scope.master.ifMobile;
}]);
