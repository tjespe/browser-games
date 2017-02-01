<?php
header("Access-Control-Allow-Origin: *");
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
if (($lang == "nb" || $lang == "nn" || $lang == "no" || (isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "no")) && !(isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "en")) {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/no-text.json"));
} else {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/en-text.json"));
}
 ?>

<style>
 .game-info-container {
    border: 1px solid hsla(0,0%,80%,1);
    margin-top:15px;
 }
 .flexbox {
   display: flex;
   flex-wrap: wrap;
   margin-top: 25px;
 }
 .description {
   padding: 0 15px;
 }
 .link {
   padding: 10px 15px;
 }
 .title { background-color:transparent; text-align:center; margin-bottom: 10px;}
</style>

<script type="text/javascript-lazy">
  app.controller('contactCtrl', ['$scope', function ($scope) {
    $scope.master.loc = "Thorin-Games — <?= $text->{'contactHead'} ?>";
    $scope.master.desc = "<?= $text->{'contactCont'} ?>";
  }]);
</script>

<div class="content" ng-controller="contactCtrl">
  <h2><?= $text->{'contactHead'} ?></h2>
  <div><?= $text->{'contactCont'} ?></div>
  <div class="flexbox">
    <div class="game-info-container">
      <div class="title"><?= $text->{'supportStaff'} ?></div>
      <div class="description"><?= $text->{'supportStaffDesc'} ?></div>
      <div class="link"><a href="mailto:support@thorin-games.tk">support@thorin-games.tk</a></div>
    </div>
    <div class="game-info-container">
      <div class="title"><?= $text->{'bugReport'} ?></div>
      <div class="description"><?= $text->{'bugReportDesc'} ?></div>
      <div class="link"><a href="mailto:bugreport@thorin-games.tk">bugreport@thorin-games.tk</a></div>
    </div>
  </div>
</div>
