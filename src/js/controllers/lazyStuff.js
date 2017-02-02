app.controller("lazyStuff", ['$http', '$scope', 'local', '$location', '$routeParams', '$lhttp', function ($http, $scope, local, $location, $routeParams, $lhttp) {
    var vm = this;

    $scope.master.rate = function (x, url, i) {
      if (!$scope.master.disabled) {
        $scope.master.disabled = true;
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
          //console.log("%cDin rating er sendt, requesten tok "+diff+" sek, her er statistikk fra serveren:", bs);
          console.log(data.logdata);
          document.getElementById(x).innerHTML = document.getElementById(x).innerHTML*1+i;
          $scope.master.disabled = false;
        });

        request.error(function (status) {
          document.getElementById(x).innerHTML = "ERROR "+status;
          $scope.master.disabled = false;
        });
      }
    };

    $scope.master.disabled = false;

    /*vm.weatherWarning = false;
    vm.yrString = "";

    initialJSON.json.then(function (data) {
      console.log("IP-data:", data.ipData);
      if (data.ipData != false) {
        var country = data.ipData.country.split(' ').join('_');
        var region = data.ipData.regionName.split(' ').join('_').replace('_County', '');
        var city = data.ipData.city.split(' ').join('_').split(' (')[0];
        if (country === 'Norway') {
          vm.yrString = encodeURIComponent(country+"/"+region+"/"+city+"/"+city);
          console.log("YR-string:", vm.yrString);
        } else {
          vm.yrString = encodeURIComponent(country+"/"+region+"/"+city);
          console.log("YR-string:", vm.yrString);
        }
        fetchWeather();
      }
    });

    var fetchWeather = function () {
      var weatherRequest = {
        method: 'GET',
        url: '//static.thorin-games.tk/php/weather.php?yrstring='+vm.yrString+'&d='+Math.floor(Date.now()/(3.6*10e5))
      };

      $http(weatherRequest).then(function successCallback(response) {
        console.log("Værdata-request fullført, skriptkjøringstid på serveren:", response.data.log, "Her er responsen:", response);
        $scope.master.weather = response.data.data.type[0];
        $scope.master.degrees = response.data.data.degs[0];
        $scope.master.credit = {
          text: response.data.credit.text[0],
          link: response.data.credit.url[0]
        };
        $scope.master.weatherFail = response.data.fail;
        $scope.master.weatherIcon = "https://symbol.yr.no/grafikk/sym/b100/"+response.data.iconId[0]+".png";
        var dl = findDL(new Date().getMonth()+1);
        if (!$scope.master.weatherFail && ($scope.master.weather == "Lettskyet" || $scope.master.weather == "Klarvær" || $scope.master.weather == "Delvis skyet") && $scope.master.degrees > dl && !response.data.school) {
          $scope.master.weatherWarning = true;
          console.log("Væradvarsel fordi $scope.master.weather = "+$scope.master.weather+" og $scope.master.degrees = "+$scope.master.degrees+", mens grensen = "+dl);
        } else {
          console.log("Ingen væradvarsel fordi $scope.master.weather = "+$scope.master.weather+" og $scope.master.degrees = "+$scope.master.degrees+", mens grensen = "+dl);
        }
      });
    }

    var findDL = function (x) {
      return Math.floor(-0.000106059419383*Math.pow(x, 8) + 0.005519696913943*Math.pow(x, 7) - 0.120641716118269*Math.pow(x, 6) + 1.440568025479752*Math.pow(x, 5) - 10.197598872501537*Math.pow(x, 4) + 43.063184894247485*Math.pow(x, 3) - 102.02532148898467*Math.pow(x, 2) + 114.97922708277378*x - 24.159090909853838)-1;
    };*/

    var mas = $scope.master;

    mas.toggleTags = function () {
      mas.showAllTags = !mas.showAllTags;
    };
    mas.search = function () {
      $location.path('tag/'+mas.otag);
      mas.collapseTags();
    };
    mas.goTo = function (url) {
      $location.path(url);
      mas.collapseTags();
    };
    mas.goToGame = function (id) {
      $location.path('id/'+id);
    };
    mas.goHome = function () {
      $location.path('');
      mas.collapseTags();
    };
    mas.collapseTags = function () {
      mas.showAllTags = false;
    };
    mas.ifHome = function () {
      return $location.path() == "/";
    };
    mas.ifAtSubmit = function () {
      return $location.path() == "/submit";
    };
    mas.ifAt = function (x) {
      return $location.path() == x;
    };
    mas.tagIs = function (x) {
      if (typeof $routeParams.category != "undefined") {
        return $routeParams.category.toLowerCase() == x.toLowerCase();
      }
      return false;
    };

    for (var attrname in mas) { $scope.master[attrname] = mas[attrname]; }

    getCss('ubuntu', '/css/ubuntu.php');
    getCss('glyphs', '/custom_bootstrap/css/glyphicons.php');
    getCss('listGroups', '/custom_bootstrap/css/list-groups.php')

    function getCss(x, url) {
      $lhttp.get("//static.thorin-games.tk"+url, 0).then(function (data) {
        $scope.master.css += data;
      })
    }

    /*function getFont(x, url) {
      if (typeof localStorage[x] !== 'undefined') {
        $scope.master[x] = localStorage[x];
        $scope.master[x+'Loaded'] = true;
      } else {
        $http.get(url).success(function (data) {
          $scope.master[x] = data;
          $scope.master[x+'Loaded'] = true;
          localStorage[x] = data;
        });
      }
    }*/

    $scope.master.mlcLoaded = true;

  }]);
