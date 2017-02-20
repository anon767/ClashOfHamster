<?php

foreach (glob(__DIR__ . "/controller/*.php") as $filename) {
    include_once $filename;
}
// prevent the server from timing out
set_time_limit(0);
// include the web sockets server script (the server is started at the far bottom of this file)
require_once 'lib/websocket.php';
require_once 'lib/gameroom.php';
$gamerooms = [];
$map = array("0" => array("width" => 2500,"height" => "400"),
    1 => array("x" => "150", "y" => "350", "w" => "150", "h" => "13"),
    2 => array("x" => "250", "y" => "70", "w" => "50", "h" => "13"),
    3 => array("x" => "450", "y" => "150", "w" => "50", "h" => "12"),
    4 => array("x" => "550", "y" => "150", "w" => "50", "h" => "15"),
    5 => array("x" => "750", "y" => "150", "w" => "50", "h" => "15"),
    6 => array("x" => "950", "y" => "250", "w" => "600", "h" => "20"),
    7 => array("x" => "1350", "y" => "150", "w" => "900", "h" => "15"));
$gamerooms[0] = new gameroom(0, $map);
$gamerooms[1] = new gameroom(1, $map);
$gamerooms[2] = new gameroom(2, $map);

// when a client sends data to the server
function wsOnMessage($clientID, $message, $messageLength, $binary, $Server)
{
    try {
        global $gamerooms;
        if ($message[0] === "7") {
            $s = explode(":", $message)[1];
            if (!array_key_exists($s, $gamerooms))
                $s = 0;
            $Server->wsClients[$clientID][13] = $s;
            if (count($gamerooms[$s]->getClients()) > 6)
                $Server->wsSend($clientID, "logoff:exceeded");
            $gamerooms[$s]->addClient($Server->wsClients[$clientID], $clientID);
            init($clientID, $Server, $gamerooms[$s]);
            return;
        }

        if ($messageLength == 0) {
            $Server->wsClose($clientID);
            return;
        }
        if (!array_key_exists(13, $Server->wsClients[$clientID]))
            return;

        foreach ($gamerooms[$Server->wsClients[$clientID][13]]->getClients() as $id => &$client) {
            if ($client && $id != $clientID) {
                $Server->wsSend($id, $message);
            }
        }
    } catch (Exception $e) {
        var_dump($e);
    }
}

function init($clientID, $Server, $gameroom)
{
    $Server->wsClients[$clientID][12] = false;
    $Server->log("Server {$Server->wsClients[$clientID][13]}: ($clientID) has connected.");
    $Server->wsSend($clientID, JSON_ENCODE(array("id" => $clientID)));
    $Server->wsSend($clientID, JSON_ENCODE(array("5" => $gameroom->getMap())));
    foreach ($gameroom->getClients() as $id => $client) {
        if ($client && $id != $clientID) {
            $Server->wsSend($id, JSON_ENCODE(array("2" => $clientID))); //request intial sends
        }
    }
}

function wsOnOpen($clientID)
{
    return;
}

function wsOnClose($clientID, $status)
{
    global $Server, $gamerooms;
    if (array_key_exists(13, $Server->wsClients[$clientID])) {
        $gameroom = $gamerooms[$Server->wsClients[$clientID][13]];
        $gameroom->removeClient($clientID);
    }
    $Server->log("($clientID) has disconnected.");
    foreach ($Server->wsClients as $id => $client) {
        if ($client)
            $Server->wsSend($id, JSON_ENCODE(array("3" => array("id" => $clientID, "by" => "-1"))));
    }
}

// start the server
$Server = new PHPWebSocket();
$Server->bind('message', 'wsOnMessage');
$Server->bind('open', 'wsOnOpen');
$Server->bind('close', 'wsOnClose');
// for other computers to connect, you will probably need to change this to your LAN IP or external IP,
// alternatively use: gethostbyaddr(gethostbyname($_SERVER['SERVER_NAME']))
$Server->wsStartServer('localhost', 9300);
