app.controller('weatherCtrl', ['$http', function ($http) {
  var vm = this;
  vm.warn = false;

  var request = {
    method: 'GET',
    url: '//static.thorin-games.tk/php/weather.php?d='+Date.now()
  };

  $http(request).then(function successCallback(response) {
    console.log("Værdata-request fullført, skriptkjøringstid på serveren:", response.data.log, "Her er responsen:", response);
    vm.weather = response.data.data.type[0];
    vm.degrees = response.data.data.degs[0];
    vm.credit = {
      text: response.data.credit.text[0],
      link: response.data.credit.url[0]
    };
    vm.fail = response.data.fail;
    vm.icon = "https://symbol.yr.no/grafikk/sym/b38/"+response.data.iconId[0]+".png";
    var dl = findDL(new Date().getMonth()+1);
    if (!vm.fail && (vm.weather == "Lettskyet" || vm.weather == "Klarvær" || vm.weather == "Delvis skyet") && vm.degrees > dl && !response.data.school) {
      vm.warn = true;
      console.log("Væradvarsel fordi vm.weather = "+vm.weather+" og vm.degrees = "+vm.degrees+", mens grensen = "+dl);
    } else {
      console.log("Ingen væradvarsel fordi vm.weather = "+vm.weather+" og vm.degrees = "+vm.degrees+", mens grensen = "+dl);
    }
  });

  var findDL = function (x) {
    return Math.floor(-0.000106059419383*Math.pow(x, 8) + 0.005519696913943*Math.pow(x, 7) - 0.120641716118269*Math.pow(x, 6) + 1.440568025479752*Math.pow(x, 5) - 10.197598872501537*Math.pow(x, 4) + 43.063184894247485*Math.pow(x, 3) - 102.02532148898467*Math.pow(x, 2) + 114.97922708277378*x - 24.159090909853838)-1;
  };
}]);
