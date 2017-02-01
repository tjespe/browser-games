console.log("Executing scroll.js");
app.directive("scroll", ['$window', 'initialJSON', function ($window, initialJSON) {
  console.log("Executing scroll directive");
  return function(scope) {

    var scrollHandler = function () {
      initialJSON.jquery.then(function () {
        if ($('#games').length && this.pageYOffset >= $('#games').outerHeight() - 2000) {
          if (scope.cat !== undefined) {
            scope.cat.requestGames(18);
          } else {
            scope.master.requestGames(18);
          }
        }
      });
    };

    angular.element($window).on('scroll', scrollHandler);

    scope.$on('$destroy', function () {
      angular.element($window).off('scroll', scrollHandler);
    });
  };
}]);
