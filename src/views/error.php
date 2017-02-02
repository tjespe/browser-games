<div class="content error-content" ng-controller="errorCtrl as error">
  <h2><span ng-bind="error.errorCode"></span> — <span ng-bind="master.textData[error.errorCode+'-header']"></span></h2>
  <img src="https://thorin-apps.tk/redirect/redirect.gif" class="col-xs-12" style="max-width:600px;float:none;margin:auto;"><br>
  <span><span ng-bind="master.textData[error.errorCode+'-content']"></span>:</span> <a href="/">thorin-games.tk</a>
  <lazy ng-if="master.lazyModulesLoaded"><lazy ng-controller="404Ctrl as 404"></lazy></lazy>
</div>

<script type="text/javascript-lazy">
  app.controller('errorCtrl', ['$location', function ($location) {
    vm.errorCode = $location.path();
  }]);
</script>
