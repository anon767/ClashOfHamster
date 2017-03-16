<?php
/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 10.03.2017
 * Time: 21:30
 */
include("jshrink.php");
$files = glob('client/*.{js}', GLOB_BRACE);
$contents = "(function(){\"use strict\";";
foreach ($files as $file) {
    if (!strstr($file, "game.js"))
        $contents .= file_get_contents($file);
}
$contents .= file_get_contents("client/game.js");
$contents .= "})();";
$contents = JShrink\Minifier::minify($contents);
file_put_contents("playit.js", $contents);