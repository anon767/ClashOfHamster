<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>Clash of Hamsters</title>
        <meta charset="utf-8">

        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="overflow: hidden">
        <link rel="stylesheet" href="client/assets/css/style.css">
        <canvas id="stage" height="400" style="position:absolute; left: 0px; top: 0px;"></canvas>
        <script
            src="//code.jquery.com/jquery-1.12.3.min.js"
            integrity="sha256-aaODHAgvwQW1bFOGXMeX+pC4PZIPsvn2h1sArYOhgXQ="
        crossorigin="anonymous"></script>
        <script>
            $.urlParam = function (name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                return results[1] || 0;
            }
            var username = $.urlParam("user");
        </script>
        <script src="client/stage.js"></script>
        <script src="//code.createjs.com/tweenjs-0.6.2.min.js"></script>
        <script src="//code.createjs.com/preloadjs-0.6.2.min.js"></script>

        <script src="client/lib/jsend.js"></script>
        <script src="client/lib/virtualJoystick.js"></script>
        <script src="//code.createjs.com/easeljs-0.8.2.min.js"></script>
        <script src="client/explosion.js"></script>
        <script src="client/socket.js"></script>
        <script src="client/mouse.js"></script>
        <script src="client/keyboard.js"></script>
        <script src="client/particle.js"></script>
        <script src="client/player.js"></script>
        <script src="client/block.js"></script>
        <script src="client/statusLabel.js"></script>
        <script src="client/collision.js"></script>
        <script src="client/bullet.js"></script>
        <script src="client/background.js"></script>
        <script src="client/game.js"></script>
        <script src="client/playerInfo.js"></script>

    </body>

</html>
