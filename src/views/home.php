<div class="content top-padded subheader" ng-if="master.lazyModulesLoaded">
  <div ng-controller="homeCtrl as h">
    <span ng-bind="master.textData.intro"></span><br><br>
    <span><span ng-bind="master.textData.amountOfGames"></span>: <span ng-if="master.lazyModulesLoaded">{{h.len}}</span><span ng-if="!master.lazyModulesLoaded">...</span></span>
  </div>
</div>

<div class="content games-wrapper noselect">
  <div id="games">
    <div ng-repeat="game in master.games track by $index" class="game-info-container">
      <div class="title" ng-click="master.goToGame(game.id)"><img src="{{::game.thumbnail}}">{{::game.title}}</div>
      <div ng-click="master.goToGame(game.id)"><img height="80px" class="appIcon" ng-src="{{::game.thumbnail}}" alt="{{::game.title}}"></div>
      <div ng-click="master.goToGame(game.id)">
        <span id="{{::game.id}}">{{game.likes}}</span> likes
      </div>
      <div class="app-desc" ng-click="master.goToGame(game.id)">{{::game.description}}</div>
      <div class="like-panel-wrapper">
        <div class="like-panel" ng-if="!view.ifMobile">
          <div>
            <button class="like" ng-disabled="master.ifDisabled()" ng-class="{ disabled:master.ifDisabled() }" ng-click="master.like(game.id)"><span class="glyphicon glyphicon-thumbs-up"></span></button>
          </div>
          <div>
            <button class="like" ng-disabled="master.ifDisabled()" ng-class="{ disabled:master.ifDisabled() }" ng-click="master.dislike(game.id)"><span class="glyphicon glyphicon-thumbs-down"></span></button>
          </div>
        </div>
        <ul class="nav nav-pills mob-like" ng-if="view.ifMobile">
          <li ng-class="{ disabled:master.ifDisabled() }"><a ng-click="master.like(game.id)"><span class="glyphicon glyphicon-thumbs-up"></span></a></li>
          <li ng-class="{ disabled:master.ifDisabled() }"><a ng-click="master.dislike(game.id)"><span class="glyphicon glyphicon-thumbs-down"></span></a></li>
        </ul>
      </div>
    </div>
    <!--div class="game-info-container" ng-if="( $index + 1 ) % 10 == 0 || $last" ng-repeat-end>
      <div class="title"><img src="https://cdn4.iconfinder.com/data/icons/advertising-soft/512/marketing_banner_promotion_advertising_advertisement_ad_ads-128.png">Advertisement</div>
      <div class="ad">
        <img src="https://lh3.ggpht.com/SwKJItV_dUKyXgtyB7ycADMWTVGscOmyr5zWyw8GgLfd6O1K8AyOCH8y_3xQBoChJ4JFCOSKew=w300">
      </div>
    </div-->
    <div class="game-info-container" ng-hide="cat.allGamesAreDisplayed()">
      <div class="title"><img src="https://static.thorin-games.tk/img/loading.svg" class="loader">Loading...</div>
      <img src="https://static.thorin-games.tk/img/loading.svg" class="loader">
    </div>
  </div>
</div>
