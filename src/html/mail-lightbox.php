<?php
header("Access-Control-Allow-Origin: *");
$lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
$norsk = ($lang == "nb" || $lang == "nn" || $lang == "no" || (isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "no")) && !(isset($_GET['lang']) && substr($_GET['lang'], 0, 2) == "en");
if ($norsk) {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/no-text.json"));
} else {
  $text = json_decode(file_get_contents("/home/u981191581/games-js/objects/en-text.json"));
}
 ?>
<div class="lightbox flex" ng-controller="mailListCtrl as m" ng-init="m.init()">
  <div class="content top-padded flex" style="flex-wrap:wrap;">
    <div class="mail-icon" style="flex:1;">
      <span class="glyphicon glyphicon-envelope testimonial-glyph"></span>
    </div>
    <form name="m.form" style="flex:2;">
      <h3><?= $text->{'mailListHeading'} ?></h3>
      <div><?= $text->{'mailListContent'} ?></div>
      <input class="mail-input" type="email" name="mail" ng-model="m.mail" placeholder="<?= $text->{'yourMail'} ?>" required>
      <ul class="nav nav-pills mail-menu flex">
        <li style="flex:1;"><a href ng-click="m.subscribe()" ng-disabled="m.mailAddress.$invalid"><?= $text->{'signMeUp'} ?></a></li>
        <li style="flex:1;"><a href ng-click="m.cancel()"><?= $text->{'notToday'} ?></a></li>
      </ul>
    </form>
  </div>
</div>
