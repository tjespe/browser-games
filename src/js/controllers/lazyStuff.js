app.controller("lazyStuff", ['$http', '$scope', '$location', '$routeParams', '$lhttp', 'urls', function ($http, $scope, $location, $routeParams, $lhttp, urls) {
  let vm = this;

  $scope.master.rate = function (game_id, action, i) {
    if (!$scope.master.request_in_progress) {
      $scope.master.request_in_progress = true;
      $http.get(urls.rating+"?action="+action+"&id="+game_id)
      .then(function(response){
        document.getElementById(game_id).innerHTML = response.data.data;
        $scope.master.request_in_progress = false;
      })
      .catch(function (status) {
        document.getElementById(game_id).innerHTML = "ERROR "+status;
        $scope.master.request_in_progress = false;
      });
    }
  };

  $scope.master.request_in_progress = false;

  let mas = $scope.master;
  mas.toggleTags = function () {
    mas.showAllTags = !mas.showAllTags;
  };
  mas.search = function () {
    $location.path('tag/'+mas.query);
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

  for (var attrname in mas) {
    try {
      $scope.master[attrname] = mas[attrname];
    } catch (e) {
      console.warn(e);
    }
  }

  getCss('ubuntu', 'ubuntu.css');
  getCss('glyphs', 'custom_bootstrap/glyphicons.min.css');
  getCss('listGroups', 'custom_bootstrap/list-groups.min.css')

  function getCss(x, url) {
    $lhttp.get("/src/css/"+url, 0).then(function (data) {
      $scope.master.css += data;
    })
  }

  $scope.master.mlcLoaded = true;
}]);
