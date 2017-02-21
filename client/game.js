/* global createjs, username */
var joystick, stage = null, timeCircle, socketObject, keyboard = new Keyboard(), collision, mePlayer, mouse, healthLabel, boostLabel;
var up = false, left = false, right = false, down = false, jump = false;
var players = [null, null, null, null, null, null]; //allocate some space for players
var queue = new createjs.LoadQueue(false);
var canshoot = true;
var isMobile = false;
/**
 * moves when direction is set
 * @returns {undefined}
 * @param {type} event
 */
function keyboardCheck(event) {
    if ((keyboard.keys[87] || keyboard.keys[38] || (isMobile && joystick.up())) && mePlayer.boostTimer > 0) { // up
        up = true;
        mePlayer.getChildAt(0).rotation = 10;
        mePlayer.boost();
    } else {
        up = false;
        mePlayer.addBoost();
    }
    if (keyboard.keys[65] || keyboard.keys[37] || (isMobile && joystick.left())) { // left
        mePlayer.getChildAt(0).scaleX = -1;
        if (mePlayer.PlayerO._animation.name !== "run") {
            mePlayer.PlayerO.gotoAndPlay("run");
        }
        left = true;
    } else {
        left = false;
    }
    if (keyboard.keys[68] || keyboard.keys[39] || (isMobile && joystick.right())) { // right
        if (mePlayer.PlayerO._animation.name !== "run") {
            mePlayer.PlayerO.gotoAndPlay("run");
        }

        mePlayer.getChildAt(0).scaleX = 1;
        right = true;
    } else {

        right = false;
    }
    if (keyboard.keys[83] || keyboard.keys[40] || (isMobile && joystick.down())) { // down
        mePlayer.getChildAt(0).rotation = 10;
        down = true;
    } else {
        down = false;
    }
    if (!up && !down) {
        mePlayer.getChildAt(0).rotation = 0;
        if (mePlayer.ps !== null && mePlayer.ps.particles.length > 0) {
            for (i = 0; i < mePlayer.ps.particles.length; i++)
                mePlayer.ps.particles[i].dispose(stage);
        }
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
    if (!right && !left) {
        if (mePlayer.PlayerO._animation.name !== "breath") {
            mePlayer.PlayerO.gotoAndPlay("breath");
        }
    }
    collision.move(left, right, up, down, mePlayer, stage, event, jump);
}


/**
 *
 * @returns {undefined}
 */
function calculateBullets(evt) {
    for (var i in stage.bullets) {
        if (stage.bullets[i] === undefined || stage.bullets[i] == null) {
            continue;
        }

        stage.bullets[i].timer += 1;
        if (stage.bullets[i].timer < stage.bullets[i].accelerationTime) {
            stage.bullets[i].xvel += (stage.bullets[i].tox - stage.bullets[i].startX) / 200;
            stage.bullets[i].yvel += (stage.bullets[i].toy - stage.bullets[i].startY) / 200;
        }
        collision.applyGravity(stage.bullets[i], stage, evt, 1.5);
        if (stage.bullets[i] === undefined || stage.bullets[i] == null) {
            continue;
        }
        collision.obstacleCollision(stage.bullets[i], stage, stage.bullets[i].x + stage.bullets[i].xvel, stage.bullets[i].y + stage.bullets[i].yvel);
        if (stage.bullets[i] === undefined || stage.bullets[i] == null) {
            continue;
        }
        if (stage.bullets[i].timer > stage.bullets[i].maxTime) {
            stage.bullets[i].explode();
        }
        if (stage.bullets[i] === undefined || stage.bullets[i] == null) {
            continue;
        }
        collision.stageCollision(stage.bullets[i].x + stage.bullets[i].xvel, stage.bullets[i].y + stage.bullets[i].yvel, stage.bullets[i]);
        if (stage.bullets[i] === undefined || stage.bullets[i] == null) {
            continue;
        }
        stage.bullets[i].x = stage.bullets[i].x + stage.bullets[i].xvel;
        stage.bullets[i].y = stage.bullets[i].y + stage.bullets[i].yvel;
    }

}

function calculateMovingObjects(event) {
    for (var i in stage.moving) {
        if (stage.moving[i] != null && stage.moving[i].y < stage.canvas.height) {
            collision.applyGravity(stage.moving[i], stage, event, 2.0);
            stage.moving[i].x = stage.moving[i].x + stage.moving[i].xvel;
            stage.moving[i].y = stage.moving[i].y + stage.moving[i].yvel;
        }
    }
}

/**
 * callback function called every frame
 * @param {type} event
 * @returns {undefined}
 */
function tick(event) {
    calculateBullets(event);
    calculateMovingObjects(event);
    keyboardCheck(event);
    mePlayer.update(socketObject);
    stage.update(event);
}

function OnOpen() {
    socketObject.send("7:" + server);
}
/**
 * retrieve server information and parses
 * @param {type} data
 * @returns {Number}
 */
function Eventcallback(data) {
    data = $.parseJSON(data); //parse
    if (data['id']) { //retrieve unique ID for identification in network
        mePlayer = (new Player()).create(stage, username, 100, 100, 100, 0, 0, 0, data['id'], healthLabel, boostLabel); //create Player
        createjs.Ticker.on("tick", tick);
        mePlayer.initSend(socketObject);
        // socketObject.setCompression();
    } else if (data['0']) { //retrieved initial send (onjoin)
        if (players[data['0']['i']]) { //if there already was a bootstrap attempt for the player
            players[data['0']['i']].remove(stage);
            players[data['0']['i']] = null; //remove
        }
        var joinedPlayer = new Player(); //create a new player
        var hl = new StatusLabel().create(data['0']['x'], data['0']['y'], "#76B852", 50, 5, stage);
        players[data['0']['i']] = joinedPlayer.create(stage, data[0]['n'], data['0']['h'], data['0']['x'],
            data['0']['y'], data['0']['r'], 0, 0, data['0']['i'], hl);
        mePlayer.damageTrackerUpdate(data[0]['n'] + " joined the game");
    } else if (data['1']) { //update player
        if (players[data['1']['i']]) {
            players[data['1']['i']].setCoords(data['1']['x'], data['1']['y'], data['1']['d']);
            if (Math.ceil(players[data['1']['i']].health - data['1']['h']) > 1) {
                players[data['1']['i']].damageTrackerUpdate(Math.ceil(players[data['1']['i']].health - data['1']['h']));
            }
            players[data['1']['i']].health = data['1']['h'];
            players[data['1']['i']].healthLabel.update(players[data['1']['i']].health, mePlayer.maxHealth);
            players[data['1']['i']].healthLabel.x = data['1']['x'];
            players[data['1']['i']].healthLabel.y = data['1']['y'] - 12;
        } else {
            socketObject.send(JSON.stringify({2: data['1']['id']})); //on missing player request initial sends
        }
    } else if (data['2']) { //populate initial send (again),someone requested it
        mePlayer.initSend(socketObject);
    } else if (data['3']) { //player dead
        if (data['3']['by'] === mePlayer.socketId && players[data['3']['id']] !== undefined && players[data['3']['id']]) {
            mePlayer.damageTrackerUpdate("you killed " + players[data['3']['id']].name);
        } else if (players[data['3']['by']] !== undefined && players[data['3']['id']] !== undefined && players[data['3']['id']] !== null && players[data['3']['by']] !== null && data['3']['by'] != "-1") {
            mePlayer.damageTrackerUpdate(players[data['3']['by']].name + " killed " + players[data['3']['id']].name);
        } else if (players[data['3']['id']] !== undefined && players[data['3']['id']] && data['3']['by'] == "-1") {
            mePlayer.damageTrackerUpdate(players[data['3']['id']].name + " had disconnect");
        }
        if (players[data['3']['id']] != null) {
            players[data['3']['id']].remove(stage);
            delete players[data['3']['id']]; //remove
        }
    } else if (data['5']) { //initialize map
        stage.size = data['5']['0']["width"]; //set map size
        stage.height = (data['5']['0']["height"]);
        stage.canvas.height = (stage.height);
        var amount = data['5'].length;
        for (var i = 1; i < amount; ++i) {
            var b = new Block();
            var o = data['5'][i];
            b.create(parseFloat(o['x']), parseFloat(o['y']), "#C2826D", parseFloat(o['w']), parseFloat(o['h']), stage);
        }
        var adjust = (window.innerHeight - stage.height) > 0 ? 0 : window.innerHeight - stage.height;
        stage.y = adjust;
        healthLabel.y -= adjust;
        boostLabel.y -= adjust;
        stage.playerInfo.y -= adjust;
    } else if (data['6']) {
        (new Bullet()).create(data['6']['x'], data['6']['y'], "black", data['6']['id'], stage, data['6']['tox'], data['6']['toy']);
    }

}

/**
 * callback from mouse listener, used for shooting
 * @param {type} evt
 * @returns {undefined}
 */
function mouseEvent(evt) {
    if (canshoot) {
        var x = mePlayer.x + 22;
        var y = mePlayer.y + 23;
        (new Bullet()).create(x, y, "black", mePlayer.socketId, stage, evt.stageX - stage.x, evt.stageY);
        if (evt.stageX - stage.x < mePlayer.x) {
            mePlayer.PlayerO.scaleX = -1;
        } else if (evt.stageX - stage.x > mePlayer.x) {
            mePlayer.PlayerO.scaleX = 1;
        }
        socketObject.send(JSON.stringify({
            6: {
                id: mePlayer.socketId,
                x: x,
                y: y,
                tox: evt.stageX + -1 * stage.x,
                toy: evt.stageY
            }
        }));
        canshoot = false;
        setTimeout(function () {
            canshoot = true;
        }, 500);
    }
}

$(document).ready(function () {
    if (window.StatusBar) window.StatusBar.hide();
    queue.loadManifest([
        {id: "bg", src: "client/assets/img/background.jpg"},
        {id: "explosion", src: "client/assets/img/explosion.png"},
        {id: "player", src: "client/assets/img/playeranimation.png"},
        {id: "grenade", src: "client/assets/img/grenadelauncher.png"},
        {id: "playerInfo", src: "client/assets/img/playerInfo.png"}
    ]);
    queue.on("complete", handleComplete, this);
    function handleComplete() {
        socketObject = new Communication(Eventcallback, OnOpen); //reduce globals, parameterize callbacks
        stage = new Stage();
        healthLabel = new StatusLabel().create(94, 42, "#76B852", 137, 13, stage);
        boostLabel = new StatusLabel().create(94, 56, "#ffd699", 137, 13, stage);

        window.addEventListener('resize', stage.resizeCanvas, false);


        collision = new Collision();

        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

        if (isMobile) {
            joystick = new VirtualJoystick({
                mouseSupport: true,
                limitStickTravel: true,
                stickRadius: 50,
                stationaryBase: true,
                baseX: 60,
                baseY: 280,
                container: document.getElementById("joystick"),
            });
        } else {
            $(window).keydown(function (e) {
                keyboard.keydown(e);
            });
            $(window).keyup(function (e) {
                keyboard.keyup(e);
            });
        }
        mouse = new Mouse();
        mouse.setMouse(stage, mouseEvent);
        createjs.Ticker.setFPS(55); //smooth performance
    }
});
