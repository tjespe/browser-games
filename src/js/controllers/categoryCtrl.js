app.controller('categoryCtrl', ['$http', '$routeParams', '$scope', 'urls', 'initialJSON', '$lhttp', function ($http, $routeParams, $scope, urls, initialJSON, $lhttp) {
  let vm = this, block = false;
  vm.tag = $routeParams.category;
  vm.amount = 1;
  vm.noGames = false;
  $scope.master.loc = "Thorin-Games — "+vm.tag;
  vm.description = {
    'en': "Here you can find all our games with the tag "+vm.tag+" sorted by popularity",
    'no': "Her kan du finne alle våre spill med taggen \""+vm.tag+"\" sortert etter popularitet",
    'es': "Aqui se encuentra todos nuestros juegos con la etiqueta \""+vm.tag+"\" Ordenado por popularidad"
  };
  $scope.master.desc = vm.description[$scope.master.lang];
  vm.games = vm.tag in $scope.master.categoryGames ? vm.games = $scope.master.categoryGames[vm.tag] : [];

  // Get the amount of matching games from the server
  $lhttp.get(urls.countGames+'?tag='+vm.tag+'&d='+Date.now()+'&pass='+initialJSON.pass, 800).then(function (data) {
    vm.amount = Number(data);
    let str = $scope.master.desc;
    // Add the number of games to the description
    let query = ' '+$scope.master.textData.games;
    $scope.master.desc = str.substring(0, str.indexOf(query)) + ' ' + data + str.substring(str.indexOf(query));
    // Request games from the server
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

  vm.allGamesAreDisplayed = ()=>{
    return vm.games.length >= vm.amount;
  }
}]);
