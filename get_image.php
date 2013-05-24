<?php
function hex2rgb($hex) {
   $hex = str_replace("#", "", $hex);

   if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
   } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
   }
   $rgb = array($r, $g, $b);
   //return implode(",", $rgb); // returns the rgb values separated by commas
   return $rgb; // returns an array with the rgb values
}

function multiplyColor(&$im, $color = array(255, 0, 0))
{
   //get opposite color
   $opposite = array(255 - $color[0], 255 - $color[1], 255 - $color[2]);

   //now we subtract the opposite color from the image
   imagefilter($im, IMG_FILTER_COLORIZE, -$opposite[0], -$opposite[1], -$opposite[2]);
}

header('Content-Type: image/png');
$cache_expire = 60*60*24*365;
header("Pragma: public");
header("Cache-Control: max-age=".$cache_expire);
header('Expires: ' . gmdate('D, d M Y H:i:s', time()+$cache_expire) . ' GMT');

if(isset($_GET['explode'])){
   $im = imagecreatefrompng('media/img/EteExplode.png');
   $width = imagesx($im);
   $height = imagesy($im);
   $imn = imagecreatetruecolor($width, $height);
   imagealphablending($imn,false);
   $col=imagecolorallocatealpha($imn,255,255,255,127);
   imagesavealpha($imn,true);
   imagefilledrectangle($imn,0,0,$width,$height,$col);
   imagealphablending($imn,true);
   imagecopy($imn, $im, 0, 0, 0, 0, $width, $height);

   // FOR A TRANSPARENT PNG FILE WITH SOMETHING INSIDE, YOU CAN CHANGE THE COLOR HERE: I HAVE RGB: 0, 255, 0
   multiplyColor($imn, hex2rgb($_GET['color']));

   imagepng($imn);
   imagedestroy($imn);
}else{
   $im = imagecreatefrompng('media/img/EteLayer1.png');
   $layer = imagecreatefrompng('media/img/EteLayer2.png');

   $width = imagesx($im);
   $height = imagesy($im);

   $imn = imagecreatetruecolor($width, $height);
   imagealphablending($imn,false);
   $col=imagecolorallocatealpha($imn,255,255,255,127);
   imagesavealpha($imn,true);
   imagefilledrectangle($imn,0,0,$width,$height,$col);
   imagealphablending($imn,true);
   imagecopy($imn, $im, 0, 0, 0, 0, $width, $height);

   $layern = imagecreatetruecolor($width, $height);
   imagealphablending($layern,false);
   $col=imagecolorallocatealpha($layern,255,255,255,127);
   imagesavealpha($layern,true);
   imagefilledrectangle($layern,0,0,$width,$height,$col);
   imagealphablending($layern,true);
   imagecopy($layern, $layer, 0, 0, 0, 0, $width, $height);

   // FOR A TRANSPARENT PNG FILE WITH SOMETHING INSIDE, YOU CAN CHANGE THE COLOR HERE: I HAVE RGB: 0, 255, 0
   multiplyColor($imn, hex2rgb($_GET['color']));

   imagecopy($imn, $layern, 0, 0, 0, 0, $width, $height);
   imagepng($imn);
   imagedestroy($imn);
}
