<?php
header('Content-Type: application/json');
require_once "bootstrap.php";
$target = explode("#", $match['target']);
if (file_exists("controller/" . $target[0] . ".php")) {
  include("controller/" . $target[0] . ".php");
}
else {
  header($_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
}

if ($match && is_callable($target[1])) {

  $match['params'] = array("em" => $entityManager) + $match['params'];
  call_user_func_array($target[1], $match['params']);
}
else {
  header($_SERVER["SERVER_PROTOCOL"] . ' 404 Not Found');
}