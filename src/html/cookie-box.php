<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');
header('Content-Type: application/json;charset=utf-8');
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$norsk = ($lang == "nb" || $lang == "nn" || $lang == "no" || (isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "no")) && !(isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "en");
if ($norsk) {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/no-text.json"));
} else {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/en-text.json"));
}

 ?>
<div class="content cookie-box">
  <?= $text->{'cookiePolicy'} ?>
  <a class="glyphicon glyphicon-remove" href ng-click="c.close()"></a>
</div>
