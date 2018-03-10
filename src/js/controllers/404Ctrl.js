app.controller('404Ctrl', ['$location', '$timeout', '$scope', function($location, $timeout, $scope) {
    var redirect = function () {
      $location.path('/');
    };
    $timeout(redirect, 3000);

    $scope.master.loc = "Tekiplay — "+$('h2')[0].innerText;
    $scope.master.desc = $('.error-content')[0].innerText.replace("\n", ".");
}]);
