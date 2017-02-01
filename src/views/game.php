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
<div class="back-container" ng-class="{'absolute-container':ifSpace()}">
  <a class="back-arrow" href ng-click="goBack()"><span class="glyphicon glyphicon-arrow-left"></span></a>
</div>

<div style="height:100%; width:100%;display:table; margin:0 auto;margin-top: 15px;">
  <div style="vertical-align:middle; display:table-cell;">

    <div ng-hide="view.ifMobile && !detail.mobile" style="width:95%;height:85%;margin-left:auto;margin-top:auto;margin-bottom:15px;margin-right:auto;text-align:center" id="wrapper">
      <embed width="{{detail.width}}" height="{{detail.height}}" style="margin-left:auto;margin-right:auto;">
    </div>

    <div class="game-sec flex" ng-class="{ noMargin:view.ifMobile }">

      <div style="flex:1;"></div>

      <div class="comments">

        <div class="com-container flex" ng-if="!noInstr">
          <div class="instructions">
            {{::detail.instructions}}
          </div>
        </div>

        <div class="com-container flex">
          <div style="flex:1;">
            <button ng-disabled="ifDisabled()" ng-class="{ disabled:ifDisabled() }" class="like" ng-click="like(detail.id)" style="background-color:#3a3a3a;"><span class="glyphicon glyphicon-thumbs-up"></span></button>
          </div>
          <div class="instructions">
            <!--span ng-if="!view.ifMobile"></span-->
            {{detail.likes}} likes
          </div>
          <div style="flex:1;">
            <button ng-disabled="ifDisabled()" ng-class="{ disabled:ifDisabled() }" class="like" ng-click="dislike(detail.id)" style="background-color:#3a3a3a;"><span class="glyphicon glyphicon-thumbs-down"></span></button>
          </div>
        </div>

        <div ng-repeat="com in detail.comments track by $index" class="com-container" ng-if="master.mlcLoaded">
          <div class="com">{{::com.com | mouthWash:this}}</div>
          <div class="com-author">— {{::com.author | mouthWash:this}}</div>
          <div class="com-date">{{com.date | chatTime}}</div>
        </div>

        <form class="com-container flex" name="commentForm" style="align-items:stretch;">
          <div style="flex:3;">
            <textarea type="text" name="comment" class="com new-com-field" ng-model="comment" style="max-width: /*98*/99%;" placeholder="<?= $text->{'yourComment'} ?>" ng-class="{ 'red-border':commentForm.comment.$invalid && commentForm.comment.$touched }" rows="1" required></textarea>
            <div class="com-author">— <input type="text" name="author" ng-model="author" class="new-com-field" style="max-width:/*89.8288536*/84%;" placeholder="<?= $text->{'yourNick'} ?>" ng-class="{ 'red-border':commentForm.author.$invalid && commentForm.author.$touched }" required></div>
          </div>
          <div style="flex:1;display:flex;" class="send-message">
            <a ng-class="{ disabled:ifDisabled() }" class="glyphicon glyphicon-send" ng-click="submit()"></a>
          </div>
        </form>

      </div>

      <div style="flex:1;"></div>

    </div>

  </div>
</div>
