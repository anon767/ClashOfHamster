/* global createjs */
var stage, timeCircle, socketObject, keyboard = new Keyboard(), collision, mePlayer, mouse;
var up = false, left = false, right = false, down = false, jump = false;
var players = [null, null, null, null, null, null]; //allocate some space for players
var queue = new createjs.LoadQueue(false);
/**
 * moves when direction is set
 * @param {type} event
 * @returns {undefined}
 */
function keyboardCheck(event) {
    if (keyboard.keys[38] && mePlayer.boostTimer > 0) { // up
        up = true;
        mePlayer.getChildAt(0).rotation = 10;
        mePlayer.boost();
    } else {
        up = false;
        mePlayer.addBoost();
    }
    if (keyboard.keys[37]) { // left
        mePlayer.getChildAt(0).scaleX = -1;
        left = true;
    } else {
        left = false;
    }
    if (keyboard.keys[39]) { // right
        mePlayer.getChildAt(0).scaleX = 1;
        right = true;
    } else {
        right = false;
    }
    if (keyboard.keys[40]) { // down
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

        mePlayer = new Player().create(stage, "hamsti" + (Math.floor(Math.random() * (5)) + 1), 100, 100, 100, 0, 0, 0, data['id'], queue); //create Player

        mePlayer.initSend(socketObject);
    }
    if (data['0']) { //retrieved initial send (onjoin)
        if (players[data['0']['id']]) { //if there already was a bootstrap attempt for the player
            players[data['0']['id']].remove(stage);
            players[data['0']['id']] = null; //remove
        }

        var joinedPlayer = new Player(); //create a new player
        players[data['0']['id']] = joinedPlayer.create(stage, data[0]['name'], data['0']['health'], data['0']['x'],
                data['0']['y'], data['0']['rotation'], 0, 0, data['0']['id'], queue);

    }
    if (data['1']) { //update player
        if (players[data['1']['id']]) {
            players[data['1']['id']].setCoords(data['1']['x'], data['1']['y'], data['1']['dir']);
            players[data['1']['id']].health = data['1']['health'];
        } else {
            socketObject.send(JSON.stringify({2: data['1']['id']})); //on missing player request initial sends
        }
    }
    if (data['2']) { //populate initial send (again),someone requested it
        mePlayer.initSend(socketObject);
    }
    if (data['3']) { //player dead
        players[data['3']].remove(stage);
        players[data['3']] = null; //remove
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

}

/**
 * callback from mouse listener, used for shooting
 * @param {type} evt
 * @returns {undefined}
 */
function mouseEvent(evt) {
    var x = evt.stageX < mePlayer.x ? mePlayer.x : mePlayer.x + 40;
    var y = evt.stageY < mePlayer.y ? mePlayer.y : mePlayer.y + 40;
    new Bullet().create(x, y, "black", mePlayer.socketId, stage);
}

$(document).ready(function () {

    queue.loadManifest([
        {id: "bg", src: "client/assets/img/background.jpg"},
        {id: "explosion", src: "client/assets/img/explosion.png"},
        {id: "player", src: "client/assets/img/player.png"},
    ]);
    queue.on("complete", handleComplete, this);
    function handleComplete() {
        socketObject = new Communication(Eventcallback); //reduce globals, parameterize callbacks
        stage = new Stage();
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
