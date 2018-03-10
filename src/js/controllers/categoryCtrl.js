app.controller('categoryCtrl', ['$http', '$routeParams', '$scope', 'urls', 'initialJSON', '$httpx', function ($http, $routeParams, $scope, urls, initialJSON, $httpx) {
  // Set important variables
  let vm = this, request_in_progress = false;
  vm.tag = $routeParams.category || "/";
  vm.max_amount = 1;
  vm.noGames = false;
  // Set title and description of page
  $scope.master.loc = "Tekiplay — "+(vm.tag !== "/" ? vm.tag : $scope.master.textData.title);
  $scope.master.desc = vm.tag !== "/" ? $scope.master.textData.categoryDescription.replace("{{tag}}", vm.tag) : $scope.master.textData.intro;
  // Load games from memory if they exist there
  vm.games = vm.tag in $scope.master.games ? vm.games = $scope.master.games[vm.tag] : [];

  // Get the amount of matching games from the server
  $httpx.get(urls.countGames+'?d='+Date.now()+(vm.tag !== "/" ? '&tag='+vm.tag : "")+'&pass='+initialJSON.pass).then(function (data) {
    vm.max_amount = Number(data);
    let str = $scope.master.desc;
    // Add the number of games to the description
    if (vm.tag !== "/") {
      let query = ' '+$scope.master.textData.games;
      $scope.master.desc = str.substring(0, str.indexOf(query)) + ' ' + data + str.substring(str.indexOf(query));
    }
    // Request games from the server
    vm.max_amount > 18 ? vm.requestGames(18) : vm.requestGames(vm.max_amount);
    if (vm.max_amount==0) vm.noGames = true;
  });

  // Get matching games from the server
  vm.requestGames = (amount)=>{
    if (!request_in_progress && !vm.allGamesAreDisplayed()) {
      request_in_progress = true;
      let from = vm.games.length, to = from + amount;
      if (from+amount > vm.max_amount) amount = vm.max_amount - (from+amount);
      let url = urls.getGames+'?from='+from+'&amount='+amount+(vm.tag !== "/" ? '&tag='+vm.tag : "")+'&d='+Date.now()+'&pass='+initialJSON.pass;
      $httpx.get(url, {lifetime:1000*60*30}).then(function(data){
        Array.prototype.push.apply(vm.games, data.data);
        request_in_progress = false;
        $scope.master.games[vm.tag] = vm.games;
      });
    }
  };

  vm.allGamesAreDisplayed = ()=>(vm.games.length >= vm.max_amount);
}]);
