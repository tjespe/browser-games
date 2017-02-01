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

<div ng-if="cat.noGames" class="content top-padded">
  <?= $text->{'noGamesWithTag'} ?> {{cat.tag}}!
</div>

<div class="content games-wrapper">
  <div id="games">
    <div ng-repeat="game in cat.games track by $index" class="game-info-container">
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
    <div class="game-info-container" ng-hide="cat.allGamesAreDisplayed()">
      <div class="title"><img src="https://static.thorin-games.tk/img/loading.svg" class="loader">Loading...</div>
      <img src="https://static.thorin-games.tk/img/loading.svg" class="loader">
    </div>
  </div>
</div>
