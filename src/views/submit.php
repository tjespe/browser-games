<div class="content submit-content">
  <div ng-if="master.lazyModulesLoaded">
    <div ng-controller="submitCtrl as sub">
      <h2 ng-bind="master.textData.submitYourGame"></h2>
      <span ng-bind="master.textData.submitInfo"></span>
      <form name="sub.submitGame" class="submit-form" ng-hide="sub.loading" ng-if="!sub.success">
        <textarea type="text" ng-model="sub.game.title" name="title" placeholder="{{master.textData.gameTitle}}" required></textarea>
        <li class="list-group-item list-group-item-danger input-error" ng-show="sub.submitGame.title.$invalid && sub.submitGame.title.$touched" ng-bind="master.textData.gameTitleErr"></li>
        <textarea type="url" ng-model="sub.game.file" name="file" placeholder="{{master.textData.gameUrl}}" required></textarea>
        <li class="list-group-item list-group-item-danger input-error" ng-show="sub.submitGame.file.$invalid && sub.submitGame.file.$touched" ng-bind="master.textData.gameUrlErr"></li>
        <textarea type="url" ng-model="sub.game.thumbnail" name="thumbnail" placeholder="{{master.textData.thumbUrl}}" required></textarea><!--a href="{{'https://www.google.no/search?q='+sub.game.title+'&tbs=isz:i,ic:trans&tbm=isch'}}" target="_blank">Søk på google</a-->
        <li class="list-group-item list-group-item-danger input-error" ng-show="sub.submitGame.thumbnail.$invalid && sub.submitGame.thumbnail.$touched" ng-bind="master.textData.thumbUrlErr"></li>
        <textarea type="text" ng-model="sub.game.description" name="description" placeholder="{{master.textData.gameDesc}}" required></textarea>
        <li class="list-group-item list-group-item-danger input-error" ng-show="sub.submitGame.description.$invalid && sub.submitGame.description.$touched" ng-bind="master.textData.gameDescErr"></li>
        <textarea type="text" ng-model="sub.gameHeight" name="height" placeholder="{{master.textData.gameHeight}}"></textarea>
        <textarea type="text" ng-model="sub.gameWidth" name="width" placeholder="{{master.textData.gameWidth}}"></textarea>
        <input name="mobile" type="checkbox" ng-model="sub.game.mobile" id="mob-friend"><label class="noselect" for="mob-friend"><span></span>{{master.textData.mobileFriendly}}</label>
        <textarea type="text" ng-model="sub.gameTags" ng-pattern="sub.tagValReg" name="tags" placeholder="{{master.textData.gameTags}}" required></textarea>
        <li class="list-group-item list-group-item-danger input-error" ng-show="sub.submitGame.tags.$invalid && sub.submitGame.tags.$touched" ng-bind="master.textData.gameTagsErr"></li>
        <div ng-show="master.verifiedUser"><input name="public" type="checkbox" ng-model="sub.game.public" id="public"><label class="noselect" for="public"><span></span>{{master.textData.public}}</label></div>
        <textarea ng-model="sub.game.instructions" name="instructions" placeholder="{{master.textData.gameInstr}}" ng-init="sub.init()"></textarea>
      </form>
      <div ng-if="sub.showPreview" ng-hide="sub.loading" ng-show="!sub.success">
        <h2 ng-bind="master.textData.preview"></h2>
        <h4 ng-bind="master.textData.gameOnHome"></h4>
        <div class="game-info-container" style="margin: 10px auto;">
          <div class="title"><img src="{{sub.game.thumbnail}}">{{sub.game.title}}</div>
          <div><img height="80px" class="appIcon" ng-src="{{sub.game.thumbnail}}"></div>
          <div>
            <span>{{sub.game.likes}}</span> likes
          </div>
          <div class="app-desc">{{sub.game.description}}</div>
          <div class="like-panel-wrapper">
            <div class="like-panel" ng-if="!view.ifMobile">
              <div>
                <button class="like"><span class="glyphicon glyphicon-thumbs-up"></span></button>
              </div>
              <div>
                <button class="like"><span class="glyphicon glyphicon-thumbs-down"></span></button>
              </div>
            </div>
            <ul class="nav nav-pills mob-like" ng-if="view.ifMobile">
              <li><a><span class="glyphicon glyphicon-thumbs-up"></span></a></li>
              <li><a><span class="glyphicon glyphicon-thumbs-down"></span></a></li>
            </ul>
          </div>
        </div>
        <div>
          <h4 ng-bind="master.textData.gamePreview"></h4>
          <iframe embed-src="{{sub.game.file}}" width="80%" height="450"></iframe>
        </div>
      </div>
      <ul class="list-group">
        <li class="list-group-item list-group-item-success" ng-show="sub.success" ng-bind="master.textData.gameIsSubmitted"></li>
        <li class="list-group-item list-group-item-danger" ng-show="sub.errors.EMBED_ERROR" ng-bind="master.textData.EMBED_ERROR"></li>
        <li class="list-group-item list-group-item-danger" ng-show="sub.errors.IMAGE_ERROR" ng-bind="master.textData.IMAGE_ERROR"></li>
        <li class="list-group-item list-group-item-danger" ng-show="sub.errors.DESC_ERROR" ng-bind="master.textData.DESC_ERROR"></li>
        <li class="list-group-item list-group-item-danger" ng-show="sub.errors.OTHER_ERROR" ng-bind="master.textData.UNKNOWN_ERROR"></li>
        <li class="list-group-item list-group-item-danger" ng-repeat="key in sub.errors.MISSING_KEYS">{{master.textData.theKey}} '{{key}}' {{master.textData.isMissing}}.<br>{{master.textData.notSubmitted}}</li>
      </ul>
      <ul class="nav nav-pills single-pill" ng-if="!sub.success">
        <li ng-if="!sub.showPreview"><a href ng-click="sub.showP()" ng-bind="master.textData.showPreview"></a></li>
        <li ng-if="sub.showPreview" ng-class="{ disabled:sub.submitGame.$invalid }" ng-hide="sub.loading"><a href ng-click="sub.submit()" ng-bind="master.textData.submit"></a></li>
      </ul>
      <div ng-show="sub.loading"><img src="https://static.thorin-games.tk/img/loading.svg" class="loader"></div>
    </div>
  </div>
  <div ng-if="!master.lazyModulesLoaded">
    <img src="https://static.thorin-games.tk/img/loading.svg" class="loader">
  </div>
</div>
