/* global createjs */
var stage, timeCircle, socketObject, keyboard = new Keyboard(), collision, mePlayer, mouse, healthLabel, boostLabel;
var up = false, left = false, right = false, down = false, jump = false;
var players = [null, null, null, null, null, null]; //allocate some space for players
var queue = new createjs.LoadQueue(false);
/**
 * moves when direction is set
 * @returns {undefined}
 * @param {type} event
 */
function keyboardCheck(event) {
    if ((keyboard.keys[87] || keyboard.keys[38]) && mePlayer.boostTimer > 0) { // up
        up = true;
        mePlayer.getChildAt(0).rotation = 10;
        mePlayer.boost();
    } else {
        up = false;
        mePlayer.addBoost();
    }
    if (keyboard.keys[65] || keyboard.keys[37]) { // left
        mePlayer.getChildAt(0).scaleX = -1;
        left = true;
    } else {
        left = false;
    }
    if (keyboard.keys[68] || keyboard.keys[39]) { // right
        mePlayer.getChildAt(0).scaleX = 1;
        right = true;
    } else {
        right = false;
    }
    if (keyboard.keys[83] ||  keyboard.keys[40]) { // down
        mePlayer.getChildAt(0).rotation = 10;
        down = true;
    } else {
        down = false;
    }
    if (!up && !down) {
        mePlayer.getChildAt(0).rotation = 0;
    } else if (up) {
        if (mePlayer.ps !== null) {
            mePlayer.particleUpdate();
        }
    }
    if (keyboard.keys[32] && mePlayer.jumpCounter === 0) { //space for Jump
        jump = true;
        mePlayer.jump();
    } else {
        jump = false;
    }
    collision.move(left, right, up, down, mePlayer, stage, event, jump);
}


/**
 * 
 * @returns {undefined}
 */
function calculateBullets(evt) {
    for (var i in stage.bullets) {
        if (stage.bullets[i] != null) {
            stage.bullets[i].xvel += evt.delta / 1000 * (stage.bullets[i].tox - stage.bullets[i].startX);
            stage.bullets[i].yvel += evt.delta / 1000 * (stage.bullets[i].toy - stage.bullets[i].startY);
            var nextposx = stage.bullets[i].x + stage.bullets[i].xvel;
            var nextposy = stage.bullets[i].y + stage.bullets[i].yvel;
            collision.obstacleCollision(stage.bullets[i], stage, nextposx, nextposy);
            if (stage.bullets[i] != null) {
                collision.stageCollision(nextposx, nextposy, stage.bullets[i]);
            }
            if (stage.bullets[i] != null) {
                stage.bullets[i].x = stage.bullets[i].x + stage.bullets[i].xvel;
                stage.bullets[i].y = stage.bullets[i].y + stage.bullets[i].yvel;
            }
        }

    }

}

function calculateMovingObjects(event) {
    for (var i in stage.moving) {
        if (stage.moving[i] != null && stage.moving[i].y < stage.canvas.height) {
            collision.applyGravity(stage.moving[i], stage, event);
            stage.moving[i].x = stage.moving[i].x + stage.moving[i].xvel;
            stage.moving[i].y = stage.moving[i].y + stage.moving[i].yvel;
            //console.log(stage.moving[i].y);
        }
    }
}

/**
 * callback function called every frame
 * @param {type} event
 * @returns {undefined}
 */
function tick(event) {
    if (mePlayer) {
        //always give event as param, needed for interpolation event.delta
        calculateBullets(event);
        calculateMovingObjects(event);
        keyboardCheck(event);
        mePlayer.update(socketObject);
    }
    stage.update(event);
}

/**
 * retrieve server information and parses
 * @param {type} data
 * @returns {Number}
 */
function Eventcallback(data) {
    if (data === null) {
        return 0;
    }

    data = $.parseJSON(data); //parse
    if (data['id']) { //retrieve unique ID for identification in network

        mePlayer = new Player().create(stage, username, 100, 100, 100, 0, 0, 0, data['id'], healthLabel, boostLabel); //create Player

        mePlayer.initSend(socketObject);
    }
    if (data['0']) { //retrieved initial send (onjoin)
        if (players[data['0']['id']]) { //if there already was a bootstrap attempt for the player
            players[data['0']['id']].remove(stage);
            players[data['0']['id']] = null; //remove
        }

        var joinedPlayer = new Player(); //create a new player
        var hl = new StatusLabel().create(data['0']['x'], data['0']['y'], "green", 50, 5, stage);
        players[data['0']['id']] = joinedPlayer.create(stage, data[0]['name'], data['0']['health'], data['0']['x'],
                data['0']['y'], data['0']['rotation'], 0, 0, data['0']['id'], hl);
    }
    if (data['1']) { //update player
        if (players[data['1']['id']]) {
            players[data['1']['id']].setCoords(data['1']['x'], data['1']['y'], data['1']['dir']);
            if (players[data['1']['id']].health - data['1']['health'] !== 0) {
                players[data['1']['id']].damageTrackerUpdate(players[data['1']['id']].health - data['1']['health']);
            }
            players[data['1']['id']].health = data['1']['health'];
            players[data['1']['id']].healthLabel.update(players[data['1']['id']].health, mePlayer.maxHealth);
            players[data['1']['id']].healthLabel.x = data['1']['x'];
            players[data['1']['id']].healthLabel.y = data['1']['y'] - 12;
        } else {
            socketObject.send(JSON.stringify({2: data['1']['id']})); //on missing player request initial sends
        }
    }
    if (data['2']) { //populate initial send (again),someone requested it
        mePlayer.initSend(socketObject);
    }
    if (data['3']) { //player dead
        if (data['3']['by'] === mePlayer.socketId && typeof players[data['3']['id']] != undefined && players[data['3']['id']]) {
            mePlayer.damageTrackerUpdate("you killed " + players[data['3']['id']].name);
        } else if (typeof players[data['3']['by']] != undefined && typeof players[data['3']['id']] != undefined && players[data['3']['id']] !== null && players[data['3']['by']] !== null && data['3']['by'] != "-1") {
            mePlayer.damageTrackerUpdate(players[data['3']['by']].name + " killed " + players[data['3']['id']].name);
        } else if (typeof players[data['3']['id']] != undefined && players[data['3']['id']] && data['3']['by'] == "-1") {
            mePlayer.damageTrackerUpdate(players[data['3']['id']].name + " had disconnect");
        }
        if (players[data['3']['id']] != null) {
            players[data['3']['id']].remove(stage);
            delete players[data['3']['id']]; //remove
        }
    }

    if (data['5']) { //initialize map
        stage.size = data['5']['0']["size"]; //set map size
        var amount = data['5'].length;
        for (var i = 1; i < amount; ++i) {
            var b = new Block();
            var o = data['5'][i];
            b.create(parseFloat(o['x']), parseFloat(o['y']), "#C2826D", parseFloat(o['w']), parseFloat(o['h']), stage);
        }
    }
    if (data['6']) {
        new Bullet().create(data['6']['x'], data['6']['y'], "black", data['6']['id'], stage, data['6']['tox'], data['6']['toy']);
    }

}

/**
 * callback from mouse listener, used for shooting
 * @param {type} evt
 * @returns {undefined}
 */
function mouseEvent(evt) {
    var x = mePlayer.x + 22;
    var y = mePlayer.y + 23;
    var b = new Bullet().create(x, y, "black", mePlayer.socketId, stage, evt.stageX - stage.x, evt.stageY);
    if (evt.stageX - stage.x < mePlayer.x) {
        mePlayer.PlayerO.scaleX = -1;
    } else if (evt.stageX - stage.x > mePlayer.x) {
        mePlayer.PlayerO.scaleX = 1;
    }
    socketObject.send(JSON.stringify({6: {
            id: mePlayer.socketId,
            x: x,
            y: y,
            tox: evt.stageX + -1 * stage.x,
            toy: evt.stageY
        }}));
}

$(document).ready(function () {

    queue.loadManifest([
        {id: "bg", src: "client/assets/img/background.jpg"},
        {id: "explosion", src: "client/assets/img/explosion.png"},
        {id: "player", src: "client/assets/img/player.png"},
        {id: "playerInfo", src: "client/assets/img/playerInfo.png"}
    ]);
    queue.on("complete", handleComplete, this);
    function handleComplete() {
        socketObject = new Communication(Eventcallback); //reduce globals, parameterize callbacks
        stage = new Stage();
        healthLabel = new StatusLabel().create(83, 38, "green", 120, 10, stage);
        boostLabel = new StatusLabel().create(83, 50, "Yellow", 120, 10, stage);
        window.addEventListener('resize', stage.resizeCanvas, false);
        //$(window).on("down",function(e){console.log("bla")});
        $(window).keydown(function (e) {
            keyboard.keydown(e);
        });
        $(window).keyup(function (e) {
            keyboard.keyup(e);
        });
        mouse = new Mouse();
        mouse.setMouse(stage, mouseEvent);
        collision = new Collision();
        createjs.Ticker.on("tick", tick);
        createjs.Ticker.setFPS(75); //smooth performance
    }
});
