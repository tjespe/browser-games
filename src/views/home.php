<?php
header("Access-Control-Allow-Origin: *");
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$t1 = round(microtime(true) * 1000000) - $start;
if (($lang == "nb" || $lang == "nn" || $lang == "no" || (isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "no")) && !(isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "en")) {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/no-text.json"));
} else {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/en-text.json"));
}

?>

<div class="content top-padded subheader" ng-if="master.lazyModulesLoaded">
  <div ng-controller="homeCtrl as h">
    <?= $text->{"intro"} ?><br><br>
    <span><?= $text->{"amountOfGames"} ?>: {{h.len}}</span>
  </div>
</div>

<div class="content top-padded subheader" ng-if="!master.lazyModulesLoaded">
  <div>
    <?= $text->{"intro"} ?><br><br>
    <span><?= $text->{"amountOfGames"} ?>: ...</span>
  </div>
</div>

<!--div class="content top-padded" ng-show="master.weatherWarning">
  <div class="container">
    <div class="col-sm-4">
      <img class="weather-icon" ng-src="{{::master.weatherIcon}}">
    </div>
    <div class="col-sm-8">
      <li class="list-group-item list-group-item-warning"><?= $text->{'weatherWarning'} ?></li>
    </div>
  </div>

  <div class="container" style="margin-top:20px;">
    <div class="col-sm-4">
      <b><?= $text->{'degrees'} ?>:</b> {{::master.degrees}}°C<br>
      <b><?= $text->{'weather'} ?>:</b> {{::master.weather}}<br>
    </div>
    <div class="col-sm-8">
      <a href="{{::master.credit.link}}" style="color: #005493;"><?= $text->{'weatherCredit'} ?></a>
    </div>
  </div>
</div-->

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
