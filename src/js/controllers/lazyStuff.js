app.controller("lazyStuff", ['$http', '$scope', 'local', '$location', '$routeParams', '$lhttp', 'urls', function ($http, $scope, local, $location, $routeParams, $lhttp, urls) {
    var vm = this;

    $scope.master.rate = function (x, action, i) {
      if (!$scope.master.disabled) {
        $scope.master.disabled = true;
        var start = Date.now();

        var request = $http({
          method:"get",
          url: urls.rating+"?action="+action+"&id="+x,
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

    getCss('ubuntu', 'ubuntu.php');
    getCss('glyphs', 'custom_bootstrap/glyphicons.min.css');
    getCss('listGroups', 'custom_bootstrap/list-groups.min.css')

    function getCss(x, url) {
      $lhttp.get("/src/css/"+url, 0).then(function (data) {
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
