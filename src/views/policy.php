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

<div class="content top-padded subheader">
  <?=$text->{"cookiePolicy"}?>
  <h4><a href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage#analyticsjs"><?=$text->{"visitGoogle"}?></a></h4>
</div>
