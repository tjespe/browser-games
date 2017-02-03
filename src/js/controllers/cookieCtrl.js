app.controller('cookieCtrl', ['$timeout', function ($timeout) {
  var vm = this;
  vm.template = "";

  vm.close = function () {
    $('.cookie-box').css('opacity', 0);
    $timeout(function () {
      $('.cookie-box').remove();
    }, 500);
    if (typeof(Storage) !== "undefined") {
      localStorage.cookieAccept = "true";
    } else {
      document.cookie = "cookiescriptaccept=visit"
    }
  }

  if ((typeof(Storage) !== "undefined" && localStorage.cookieAccept != "true") && getCookieValue("cookiescriptaccept") != "visit") {
    $timeout(function () {
      try {
        document.getElementsByClassName('cookie-box')[0].setAttribute('style', 'opacity:1;');
      } catch (e) {
        console.warn(e);
      }
      $timeout(vm.close, 5000);
    }, 2500);
  } else {
    document.querySelector('#cookies').remove();
  }

  function getCookieValue(a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
  }
}]);
