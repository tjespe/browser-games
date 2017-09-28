// The only purpose of this controller is to give a description to the page when user is at home page
app.controller('homeCtrl', ['$http', '$rootScope', '$scope', '$timeout', 'initialJSON', function($http, $rootScope, $scope, $timeout, initialJSON) {
  var vm = this;
  vm.len = "...";
  $rootScope.$on('$locationChangeStart', function(event) {
    $scope.master.routeChanged = true;
  });
  initialJSON.json.then(function (data) {
    vm.len = data.count;
    try {
      if ($scope.master.norsk) {
        var tops = "";
        for (var i = 0; i < 8; i++) {
          tops += data.topTags[i].name+' ('+data.topTags[i].amount+' spill), ';
        }
        tops += data.topTags[8].name+' ('+data.topTags[8].amount+' spill).';
        $scope.master.desc += " De største kategoriene akkurat nå er "+tops;
      } else {
        var tops = "";
        for (var i = 0; i < 8; i++) {
          tops += data.topTags[i].name+' ('+data.topTags[i].amount+' games), ';
        }
        tops += data.topTags[8].name+' ('+data.topTags[8].amount+' games).';
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
