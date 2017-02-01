<?php
header("Access-Control-Allow-Origin: *");
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$t1 = round(microtime(true) * 1000000) - $start;
if (($lang == "nb" || $lang == "nn" || $lang == "no" || (isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "no")) && !(isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "en")) {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/no-text.json"));
} else {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/en-text.json"));
}
$error = $_GET['error_code'];
 ?>

<div class="content error-content">
  <h2><?= $error ?> — <?= $text->{"$error-header"} ?></h2>
  <img src="https://thorin-apps.tk/redirect/redirect.gif" class="col-xs-12" style="max-width:600px;float:none;margin:auto;"><br>
  <span><?= $text->{"$error-content"} ?>:</span> <a href="/">thorin-games.tk</a>
  <lazy ng-if="master.lazyModulesLoaded"><lazy ng-controller="404Ctrl as 404"></lazy></lazy>
</div>
