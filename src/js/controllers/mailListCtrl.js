console.log("Executing mailListCtrl.js");
app.controller('mailListCtrl', ['$http', '$timeout', 'local', '$scope', function ($http, $timeout, local, $scope) {
  var vm = this;
  vm.mail = "";
  var nextMonth = Date.now()+(1000*60*60*24*30);
  var date = new Date(nextMonth);
  console.log("Executing mailListCtrl controller");

  vm.init = function () {
    var hasVisited = local.get('hasVisitedThorinEarlier');
    var alreadyPrompted = local.keyExist('thorinMailPrompted') && local.get('thorinMailPrompted');
    if (hasVisited && !alreadyPrompted && !$scope.view.ifMobile) {
      $timeout(function () {
        $('.lightbox').css('display', 'flex !important');
        $timeout(function () {
          $('.lightbox').css('opacity', 1);
        }, 200);
      }, 8000);
    }
    local.set('hasVisitedThorinEarlier', true, nextMonth);
  };

  vm.subscribe = function () {
    if (vm.form.mail.$valid) {
      $('.lightbox').css('opacity', 0);
      $timeout(function () {
        $('.lightbox').css('display', 'none');
      }, 1001);
      local.set('thorinMailPrompted', true);

      var request = $http({
        method: 'post',
        url: '//static.thorin-games.tk/php/subscribe.php',
        data: vm.mail
      });

      request.success(function (data) {
        console.log(data);
      });
    } else {
      vm.form.mail.$setTouched();
    }
  };

  vm.cancel = function () {
    $('.lightbox').css('opacity', 0);
    $timeout(function () {
      $('.lightbox').css('display', 'none');
    }, 1001);
    local.set('thorinMailPrompted', true, Date.now()+(1000*60*60*24*7));
  };
}]);
