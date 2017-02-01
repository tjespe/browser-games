<?php

$video_url = $_GET['video'];
$subtitles_url = urlencode($_GET['subtitles']);

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Video</title>
</head>
<body style="margin:0px;">
  <video src="<?= $video_url ?>" autoplay controls style="width:100%;height:auto;max-height:100%;">
    <track label="Auto" kind="subtitles" srclang="en" src="https://static.thorin-games.tk/assets/subtitles.php?url=<?= $subtitles_url ?>" default>
  </video>
</body>
</html>
