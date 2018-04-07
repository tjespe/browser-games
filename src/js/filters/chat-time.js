app.filter('chatTime', ["$filter", function ($filter) {
  var text = {secs: "seconds ago",mins: "minutes ago",hours: "hours ago"};
  if (navigator.language.indexOf('nb')>-1 || navigator.language.indexOf('nn')>-1 || navigator.language.indexOf('no')>-1 ) {
    text = {secs: "sekunder siden",mins: "minutter siden",hours: "timer siden"};
  }

  return function(input) {
    if (typeof input == "number") {
      var now = Date.now();
      var diff = now - input;
      if (diff < 60000) {
        var secs = Math.floor(diff/1000);
        return secs + " " + text.secs;
      } else if (diff < 3600000) {
        var mins = Math.floor(diff/60000);
        return mins + " " + text.mins;
      } else if (diff < 86400000) {
        return $filter('date')(input, "HH:mm");
      } else if (diff < 600000000) {
        return $filter('date')(input, "EEE HH:mm");
      } else if (diff < 31104000000) {
        return $filter('date')(input, "dd/MM HH:mm");
      } else {
        return $filter('date')(input, "dd/MM/yyyy");
      }
    } else {
      return input;
    }
  };

}]);
