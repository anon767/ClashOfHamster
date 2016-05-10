<?php

include("bootstrap.php");
foreach (glob(__DIR__ . "/controller/*.php") as $filename) {
    include_once $filename;
}
// prevent the server from timing out
set_time_limit(0);
// include the web sockets server script (the server is started at the far bottom of this file)
require_once 'lib/websocket.php';
require_once 'lib/jsend.php';

// when a client sends data to the server
function wsOnMessage($clientID, $message, $messageLength, $binary, $Server) {

    //$data = json_decode($message);
// check if message length is 0
    if ($messageLength == 0) {
        $Server->wsClose($clientID);
        return;
    }
    if (isset($Server->wsClients[$clientID][12]) && $Server->wsClients[$clientID][12] == 1) {
        $message = jSEND::getData($message);
    }
    $jsmsg = json_decode($message, true);
    if (isset($jsmsg['4']) && $jsmsg['4'] == 1) {
        $Server->wsClients[$clientID][12] = true;
        $server - log($clientID . " set compression to " . $Server->wsClients[$clientID][12]);
    } else {
//Send the message to everyone but the person who said it
        foreach ($Server->wsClients as $id => &$client) {
            if ($id != $clientID) {
                $Server->wsSend($id, $message);
            }
        }
    }
}

// when a client connects
function wsOnOpen($clientID) {
    global $Server;
    $map = array("0" => array("size" => 4000),
        1 => array("x" => "150", "y" => "150", "w" => "50", "h" => "50"),
        2 => array("x" => "250", "y" => "150", "w" => "50", "h" => "50"));

    $ip = long2ip($Server->wsClients[$clientID][6]);
    $Server->wsClients[$clientID][12] = false;
    $Server->log("$ip ($clientID) has connected.");
    $Server->wsSend($clientID, JSON_ENCODE(array("id" => $clientID)));
    $Server->wsSend($clientID, JSON_ENCODE(array("5" => $map)));
    foreach ($Server->wsClients as $id => $client) {
        if ($id != $clientID) {
            $Server->wsSend($id, JSON_ENCODE(array("2" => $clientID))); //request intial sends
        }
    }
}

// when a client closes or lost connection
function wsOnClose($clientID, $status) {
    global $Server;
    $ip = long2ip($Server->wsClients[$clientID][6]);
    $Server->log("$ip ($clientID) has disconnected.");

    foreach ($Server->wsClients as $id => $client) {
        $Server->wsSend($id, JSON_ENCODE(array("3" => $clientID)));
    }
}

// start the server
$Server = new PHPWebSocket();
$Server->bind('message', 'wsOnMessage');
$Server->bind('open', 'wsOnOpen');
$Server->bind('close', 'wsOnClose');
// for other computers to connect, you will probably need to change this to your LAN IP or external IP,
// alternatively use: gethostbyaddr(gethostbyname($_SERVER['SERVER_NAME']))
$Server->wsStartServer('127.0.0.1', 9300);
