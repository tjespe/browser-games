app.directive('jsonLink', function() {
    var hrefLinks=function (obj, pretty) {
      var space = pretty || '';
      var html = '';
      $.each(obj, function(key, val) {
        if ($.isPlainObject(val)) {
          html += key + ': <br>';
          html += hrefLinks(val, space + '&nbsp;&nbsp;');
        } else if (key === 'href') {
          html += space + 'LINK: <a href="' + val + '">' + val + '</a><br>';
        } else {
          html += space + key + ': ' + val + '<br>';
        }
      });
      return html;
    }
    return {
      restrict: 'E',
      template: '<div></div>',
      replace: true,
      scope: {
        obj: '='
      },
      link: function(scope, element, attr) {
        element.html(hrefLinks(scope.obj));
      }
    };
  });
