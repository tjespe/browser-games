app.controller('categoryCtrl', ['$http', '$routeParams', '$scope', 'urls', 'initialJSON', '$lhttp', function ($http, $routeParams, $scope, urls, initialJSON, $lhttp) {
  var vm = this;
  console.log($routeParams);
  vm.tag = $routeParams.category;
  vm.x = 1;
  $scope.master.loc = "Thorin-Games — "+vm.tag;
  $scope.master.desc = "Here you can find all our games with the tag "+vm.tag+" sorted by popularity";
  if ($scope.master.norsk) {
    $scope.master.desc = "Her kan du finne alle våre spill med taggen \""+vm.tag+"\" sortert etter popularitet";
  }
  vm.games = [];
  if (vm.tag in $scope.master.categoryGames) {
    vm.games = $scope.master.categoryGames[vm.tag];
  }
  vm.noGames = false;
  var block = false;

  $lhttp.get(urls.countGames+'?tag='+vm.tag+'&d='+Date.now()+'&pass='+initialJSON.pass, 800).then(function (data) {
    vm.x = data;
    var str = $scope.master.desc;
    var q = " games";
    if ($scope.master.norsk) q = " spill";
    $scope.master.desc = str.substring(0, str.indexOf(q)) + ' ' + data + str.substring(str.indexOf(q));
    vm.requestGames(18);
    if (vm.x==0) vm.noGames = true;
  });

  vm.requestGames = function (x) {
    if (!block && !vm.allGamesAreDisplayed()) {
      block = true;
      var fr = vm.games.length;
      var to = fr + x;
      if (fr+x>vm.x) {x = vm.x - (fr+x);}
      var url = urls.getGames+'?from='+fr+'&amount='+x+'&tag='+vm.tag+'&d='+Date.now()+'&pass='+initialJSON.pass;
      $lhttp.get(url, 1500).then(function(data){
        Array.prototype.push.apply(vm.games, data.data);
        block = false;
        $scope.master.categoryGames[vm.tag] = vm.games;
      })
      /*.catch(function (data, status) {
        console.log(data, status);
        block = false;
      });*/
    }
  };

  vm.allGamesAreDisplayed = function () {
    if (vm.games.length < vm.x) {return false;}
    return true;
  };

}]);
