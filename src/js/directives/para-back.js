app.directive("paraBack", ['$window', function ($window) {
  return function(scope, element, attrs) {
    element.css("background-image", "url("+attrs.paraBack+")");
    element.css("background-attachment", "fixed");
    var max = Infinity;

    var image = new Image();
    image.src = attrs.paraBack;
    image.onload = function () {
      max = image.height - window.innerHeight;
      var xOffset = -(image.width/2-element[0].offsetWidth/2);
      element.css("background-position-x", xOffset+'px');
    }

    var scrollHandler = function () {
      var offset = Math.floor(this.pageYOffset*0.1);
      if (offset<max) {
        element.css('background-position-y', '-'+offset+'px');
      }
    };

    if (!scope.master.ifMobile) {
      angular.element($window).on('scroll', scrollHandler);

      scope.$on('$destroy', function () {
        angular.element($window).off('scroll', scrollHandler);
      });
    }
  };
}]);
