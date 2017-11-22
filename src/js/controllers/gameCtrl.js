app.controller("gameCtrl", ["$scope", "$routeParams", "$http", "$sce", "$interval", "$timeout", "$window", "$location", "initialJSON", "$httpx", "urls", function ($scope, $routeParams, $http, $sce, $interval, $timeout, $window, $location, initialJSON, $httpx, urls) {
  let vm = this;
  let block_auto_refresh = false, request_in_progress = false, refresh_fails = 0;
  // Switch to http if client is using https, because there is a high chance the game is hosted on a http server
  if (location.protocol === "https:") { location.protocol = "http:"; }
  vm.gamedata = {};
  vm.showRedirectPrompt = false;
  vm.showFlashPrompt = false;
  vm.loading = true;
  // Fetch gamedata
  $httpx.get(urls.getGames+"?id="+$routeParams.id+"&pass="+initialJSON.pass, {lifetime: 60*60*1000}).then((data)=>{
    vm.gamedata = data;
    vm.loading = false;
    // Change title and description of page
    $scope.master.loc = "Texiplay — "+data.title;
    $scope.master.desc = data.description;
    // Trust gamedata url
    let game_url = $sce.trustAsResourceUrl(vm.gamedata.file);
    // Check if user has flash
    let has_flash = false;
    try {
      has_flash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
    } catch(exception) {
      has_flash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
    }
    // Calculate width and height
    if (vm.gamedata.height === "n") { vm.gamedata.height = 0.75 * window.innerHeight; }
    if (vm.gamedata.height === "r" || vm.gamedata.width === "r") {
      vm.showRedirectPrompt = true;
    } else if (has_flash || !vm.gamedata.file.match(/\.swf$/)) {
      $("embed").attr("src", game_url);
    } else {
      vm.showFlashPrompt = true;
    }
    resizeEmbed();
  });

  // Declare function to rate game
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
  // This function submits the comment the user has typed
  vm.submit_comment = ()=>{
    // If all criteria are fulfilled, submit comment
    if (!request_in_progress && vm.comment.length > 0 && vm.author.length > 0) {
      // When the form is untouched, no red error CSS is shown
      $scope.commentForm.$setUntouched();
      // Try to save nickname, but don't do anything if an error occurs
      try { localStorage.username = vm.author; } catch (e) { }
      request_in_progress = true; block_auto_refresh = true;
      // Actually submit comment
      $http.get(urls.comment+"?id="+$routeParams.id+"&com="+encodeURIComponent(vm.comment)+"&author="+encodeURIComponent(vm.author)).then((response)=>{
        request_in_progress = false; block_auto_refresh = false;
        // Reset comment field and refresh comments
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
    // This code makes the comment textarea auto resize
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
  initialJSON.jquery.then(vm.jquery);

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

  // This interval checks if new comments have been submitted since user loaded page
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

  // This function checks if the go back arrow needs to have absolute position
  vm.ifSpace = ()=>window.innerWidth-document.querySelector("embed").clientWidth>140 && !$scope.master.ifMobile;
}]);
