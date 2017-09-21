app.controller('submitCtrl', ['$http', '$scope', 'initialJSON', 'urls', function ($http, $scope, initialJSON, urls) {
  var vm = this;
  $scope.master.loc = "Thorin-Games — Submit a game";
  $scope.master.desc = "If you want to, you can submit a game to Thorin-Games, all you have to do is to fill out the form below and tap submit";
  if ($scope.master.norsk) {
    $scope.master.loc = "Thorin-Games — Legg til et spill";
    $scope.master.desc = "Dersom du \u00f8nsker det kan du legge til et spill til Thorin-Games. Alt du m\u00e5 gj\u00f8re er \u00e5 fylle ut skjemaet nedenfor og trykke legg til.";
  }

  vm.tagValReg = /.*#.+/i;
  vm.game = {
    "title":"",
    "comments":[],
    "likes":2,
    "height":"n",
    "width":"100%",
    "public":true,
    "instructions":"",
    "tags":[],
    "thumbnail":"",
    "file":"",
    "description":"",
    "mobile": false
  };
  vm.gameTags = "";
  vm.gameHeight = "";
  vm.gameWidth = "";
  vm.showPreview = false;
  vm.loading = false;
  vm.success = false;
  vm.errors = {
    "EMBED_ERROR" : false,
    "IMAGE_ERROR" : false,
    "DESC_ERROR" : false,
    "MISSING_KEYS" : [],
    "OTHER_ERROR" : false
  };
  vm.showP = function () {
    vm.showPreview = true;
  };
  var isNum = (val)=>/^[\d\.,]+$/.test(val) || val=="n" || val=="r" || /[0-9\.,]*px$/.test(val) || /[0-9\.,]*%$/.test(val);
  vm.submit = function () {
    if (isNum(vm.gameHeight) && isNum(vm.gameWidth)) {
      vm.game.height = vm.gameHeight;
      vm.game.width = vm.gameWidth;
    }
    vm.game.tags = extractTags(vm.gameTags);
    if (vm.submitGame.$valid) {
      vm.loading = true;

      var request = $http({
        method: 'get',
        url: urls.submitGame+"?"+createQueryString(vm.game)
      });

      request.success(function(data){
        vm.showPreview = false;
        vm.loading = false;
        vm.errors = data.errors;
        vm.success = data.success;
        if (data.success) {
          vm.game = {"title":"", "comments":[], "likes":2, "height":"n", "width":"100%", "public":true, "instructions":"", "tags":[], "thumbnail":"", "file":"", "description":""};
          vm.showPreview = false;
        }
      });

      request.error(function (data, status) {
        vm.errors.OTHER_ERROR = true;
        vm.loading = false;
        console.log("Data:", data, "status:", status);
      })

    }
  };

  function toTitleCase(str) { return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); }

  function extractTags(str) {
    if (str.length>0) {
      var tags = str.match(/#[^#]+/g);
      for (i=0;i<tags.length;i++){
        try {
          tags[i]=tags[i].replace('#', '');
          tags[i]=tags[i].trim();
          tags[i]=toTitleCase(tags[i]);
        } catch (e) {
          console.warn(e);
        }
      }
      return tags;
    }
    return [];
  };

  function createQueryString(obj) {
    var str = [];
    for (let p in obj) obj.hasOwnProperty(p) ? str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p])) : null;
    return str.join("&");
  }

  vm.init = function () {
    initialJSON.jquery.then(function () {
      $( "textarea" ).each(function( index ) {
        $(this).attr('rows', Math.ceil($(this).attr('placeholder').length*(430/56)/$(this).width()));
      });
    })
  };


}]);
