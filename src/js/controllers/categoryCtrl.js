app.controller('categoryCtrl', ['$http', '$routeParams', '$scope', 'urls', 'initialJSON', '$lhttp', function ($http, $routeParams, $scope, urls, initialJSON, $lhttp) {
  let vm = this, block = false;
  vm.tag = $routeParams.category;
  vm.amount = 1;
  vm.noGames = false;
  $scope.master.loc = "Thorin-Games — "+vm.tag;
  $scope.master.desc = $scope.master.norsk ? "Here you can find all our games with the tag "+vm.tag+" sorted by popularity" : "Her kan du finne alle våre spill med taggen \""+vm.tag+"\" sortert etter popularitet";
  vm.games = vm.tag in $scope.master.categoryGames ? vm.games = $scope.master.categoryGames[vm.tag] : [];

  $lhttp.get(urls.countGames+'?tag='+vm.tag+'&d='+Date.now()+'&pass='+initialJSON.pass, 800).then(function (data) {
    vm.amount = Number(data);
    let str = $scope.master.desc;
    let q = $scope.master.norsk ? " games" : " spill";
    $scope.master.desc = str.substring(0, str.indexOf(q)) + ' ' + data + str.substring(str.indexOf(q));
    vm.amount > 18 ? vm.requestGames(18) : vm.requestGames(vm.amount);
    if (vm.amount==0) vm.noGames = true;
  });

  vm.requestGames = function (x) {
    if (!block && !vm.allGamesAreDisplayed()) {
      block = true;
      let from = vm.games.length, to = from + x;
      if (from+x > vm.amount) x = vm.amount - (from+x);
      let url = urls.getGames+'?from='+from+'&amount='+x+'&tag='+vm.tag+'&d='+Date.now()+'&pass='+initialJSON.pass;
      $lhttp.get(url, 1500).then(function(data){
        Array.prototype.push.apply(vm.games, data.data);
        block = false;
        $scope.master.categoryGames[vm.tag] = vm.games;
      });
    }
  };

  vm.allGamesAreDisplayed = ()=>vm.games.length < vm.amount;
}]);
