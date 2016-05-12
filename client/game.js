/* global createjs */
var stage, timeCircle, socketObject, keyboard, collision, mePlayer, mouse;
var up = false, left = false, right = false, down = false, jump = false;
var players = [null, null, null, null, null, null]; //allocate some space for players

/**
 * moves when direction is set
 * @param {type} event
 * @returns {undefined}
 */
function keyboardCheck(event) {
    if (keyboard.keys[38] && mePlayer.boostTimer > 0) { // up
        up = true;
        mePlayer.boost();
    } else {
        mePlayer.addBoost();
        up = false;
    }
    if (keyboard.keys[37]) { // left
        left = true;
    } else {
        left = false;
    }
    if (keyboard.keys[39]) { // right
        right = true;
    } else {
        right = false;
    }
    if (keyboard.keys[40]) { // down
        down = true;
    } else {
        down = false;
    }
    if (keyboard.keys[32] && mePlayer.jumpCounter <= 2) { //space for Jump
        jump = true;
        mePlayer.jump();
    } else {
        jump = false;
    }
    collision.move(left, right, up, down, jump, mePlayer, stage, event, mePlayer.resetJumpCounter());


}

/**
 * callback function called every frame
 * @param {type} event
 * @returns {undefined}
 */
function tick(event) {
    if (mePlayer) {
        //always give event as param, needed for interpolation event.delta
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
        mePlayer = new Player(stage, "tom", 100, 100, 100, 200, 0, 0, data['id']); //create Player
        mePlayer.initSend(socketObject);
    }
    if (data['0']) { //retrieved initial send (onjoin)
        if (players[data['0']['id']]) { //if there already was a bootstrap attempt for the player
            players[data['0']['id']].remove();
            players[data['0']['id']] = null; //remove
        }
        var joinedPlayer = new Player(stage, data[0]['name'], data['0']['health'], data['0']['x'],
                data['0']['y'], data['0']['rotation'], data['0']['id']); //create a new player
        players[data['0']['id']] = joinedPlayer;
    }
    if (data['1']) { //update player
        if (players[data['1']['id']]) {
            if (Math.abs(data['1']['x'] - players[data['1']['id']].x) < 100 && Math.abs(data['1']['y'] - players[data['1']['id']].y) < 100) {
                players[data['1']['id']].x = data['1']['x'];
                players[data['1']['id']].y = data['1']['y'];
                players[data['1']['id']].health = data['1']['health'];
            }
        } else {
            socketObject.send(JSON.stringify({2: data['1']['id']})); //on missing player request initial sends
        }
    }
    if (data['2']) { //populate initial send (again),someone requested it
        mePlayer.initSend(socketObject);
    }
    if (data['3']) { //player dead
        players[data['3']].remove();
        players[data['3']] = null; //remove
    }

    if (data['5']) { //initialize map
        stage.size = data['5']['0']["size"]; //set map size
        var amount = data['5'].length;
        for (var i = 1; i < amount; ++i) {
            var b = new Block();
            var o = data['5'][i];
            b.create(parseFloat(o['x']), parseFloat(o['y']), "black", parseFloat(o['w']), parseFloat(o['h']), stage);
        }
    }

}

/**
 * callback from mouse listener, used for shooting
 * @param {type} evt
 * @returns {undefined}
 */
function mouseEvent(evt) {
    evt.preventDefault();
    console.log("stageX/Y: " + evt.stageX + "," + evt.stageY); // always in bounds
}

$(document).ready(function () {
    //queue = new createjs.LoadQueue(false); dont know what it does but it sucks
    socketObject = new Communication(Eventcallback); //reduce globals, parameterize callbacks
    stage = new createjs.Stage("stage");
    mouse = new Mouse();
    mouse.setMouse(stage, mouseEvent);
    stage.innerWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    collision = new Collision();
    createjs.Ticker.on("tick", tick);
    createjs.Ticker.setFPS(75); //smooth performance
    stage.snapToPixelEnabled = true; //seems like lagging out the game but idk
});