app.controller('homeCtrl', ['$http', '$rootScope', '$scope', '$timeout', 'initialJSON', function($http, $rootScope, $scope, $timeout, initialJSON) {
  var vm = this;
  vm.len = "...";
  $rootScope.$on('$locationChangeStart', function(event) {
    $scope.master.routeChanged = true;
  });
  $scope.master.loc = "Thorin-Games — The best place on the internet to play Flash and HTML5 games";
  $scope.master.desc = "Welcome to Thorin-Games. Here you can find a broad selection of flash and html5 games sorted by popularity and category.";
  if ($scope.master.norsk) {
    $scope.master.loc = "Thorin-Games — Den beste siden på internett for å spille Flash og HTML5 spill";
    $scope.master.desc = "Velkommen til Thorin-Games sin nettside. Her kan du finne nesten 2000 spill, sortert etter bl.a. kategori og hvor godt likt de er.";
  }
  initialJSON.json.then(function (data) {
    vm.len = data.count;
    try {
      if ($scope.master.norsk) {
        var tops = "";
        for (var i = 0; i < 8; i++) {
          tops += data.topTags[i].name+' ('+data.topTags[i].amount+' spill), ';
        }
        tops += data.topTags[8].name+' ('+data.topTags[8].amount+' spill).';
        //$scope.master.loc = "Thorin-Games — Den beste siden på internett for å spille Flash og HTML5 spill";
        //$scope.master.desc = "Velkommen til Thorin-Games sin nettside. Her kan du finne nesten 2000 spill, sortert etter bl.a. kategori og hvor godt likt de er. De største kategoriene akkurat nå er "+tops;
        $scope.master.desc += " De største kategoriene akkurat nå er "+tops;
      } else {
        var tops = "";
        for (var i = 0; i < 8; i++) {
          tops += data.topTags[i].name+' ('+data.topTags[i].amount+' games), ';
        }
        tops += data.topTags[8].name+' ('+data.topTags[8].amount+' games).';
        //$scope.master.loc = "Thorin-Games — The best place on the internet to play Flash and HTML5 games";
        //$scope.master.desc = "Welcome to Thorin-Games. Here you can find a broad selection of flash and html5 games sorted by popularity and category. Our top categories right now are "+tops;
        $scope.master.desc += " Our top categories right now are "+tops;
      }
      var tops = "";
      for (var i = 0; i < 7; i++) {
        tops += ' '+data.initialGames[i].title+' ('+data.initialGames[i].likes+' likes),';
      }
      tops += ' '+data.initialGames[7].title+' ('+data.initialGames[7].likes+' likes)';
      if ($scope.master.norsk) {
        $scope.master.desc += " De mest populære spillene våre nå er"+tops;
      } else {
        $scope.master.desc += " Our most popular games right now are"+tops;
      }
    } catch (e) {
      console.warn(e);
    }
  });
}]);
