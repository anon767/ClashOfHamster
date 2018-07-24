/* global createjs, username */

console.log("     _           _              __   _                         _");
console.log("    | |         | |            / _| | |                       | |");
console.log(" ___| | __ _ ___| |__     ___ | |_  | |__   __ _ _ __ ___  ___| |_ ___ _ __");
console.log("/ __| |/ _` / __| '_ \\   / _ \\|  _| | '_ \\ / _` | '_ ` _ \\/ __| __/ _ \\ '__|");
console.log("| (__| | (_| \\__ \\ | | | | (_) | |   | | | | (_| | | | | | \\__ \\ ||  __/ |");
console.log("\\___|_|\\__,_|___/_| |_|  \\___/|_|   |_| |_|\\__,_|_| |_| |_|___/\\__\\___|_|");


var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Events = Matter.Events,
    render = null,
    MouseConstraint = Matter.MouseConstraint,
    MouseMatter = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies,
    runner = null;
var engine = Engine.create({
        enableSleeping: false
    }),
    world = engine.world;
var joystick, stage = null, timeCircle, socketObject, keyboard = new Keyboard(), collision, mePlayer = null, mouse,
    healthLabel, boostLabel;
var up = false, left = false, right = false, down = false, jump = false;
var players = [null, null, null, null, null, null]; //allocate some space for players
var queue = new createjs.LoadQueue(false);
var canshoot = true;
var objects = [];
var isMobile = false;
var adjust;
var lastTick = null;
var posrange = [[100, 100], [2000, 100]];

/**
 * moves when direction is set
 * @returns {undefined}
 * @param {type} event
 */
function keyboardCheck(event) {
    var x = 0, y = 0;
    if (keyboard.keys[89]) {
        $("#chatbox").show();
        $("#chatbox").focus();
    }
    if ((keyboard.keys[87] || keyboard.keys[38] || (isMobile && joystick.up())) && mePlayer.boostTimer > 0) { // up
        up = true;
        y = -mePlayer.speedY;
        mePlayer.blockRender.PlayerO.rotation = -mePlayer.blockRender.PlayerO.scaleX * 10;
        mePlayer.boost();
    } else {
        up = false;
        mePlayer.addBoost();
    }
    if (keyboard.keys[65] || keyboard.keys[37] || (isMobile && joystick.left())) { // left
        x = -mePlayer.speedX;
        mePlayer.blockRender.PlayerO.scaleX = -1;
        mePlayer.setScale(-1);
        if (mePlayer.blockRender.PlayerO._animation.name !== "run") {
            mePlayer.blockRender.PlayerO.gotoAndPlay("run");
        }
        left = true;
    } else {
        left = false;
    }
    if (keyboard.keys[68] || keyboard.keys[39] || (isMobile && joystick.right())) { // right
        x = mePlayer.speedX;
        if (mePlayer.blockRender.PlayerO._animation.name !== "run") {
            mePlayer.blockRender.PlayerO.gotoAndPlay("run");
        }

        mePlayer.setScale(1);
        right = true;
    } else {

        right = false;
    }
    if (keyboard.keys[83] || keyboard.keys[40] || (isMobile && joystick.down())) { // down
        y = mePlayer.speedY;
        mePlayer.blockRender.PlayerO.rotation = mePlayer.blockRender.PlayerO.scaleX * 10;
        down = true;
    } else {
        down = false;
    }
    if (!up && !down) {
        mePlayer.blockRender.PlayerO.rotation = 0;
        if (mePlayer.ps !== null && mePlayer.ps.particles.length > 0) {
            for (var i = 0; i < mePlayer.ps.particles.length; i++)
                mePlayer.ps.particles[i].dispose(stage);
        }
    } else if (up) {
        if (mePlayer.ps !== null) {
            mePlayer.particleUpdate();
        }
    }
    if (keyboard.keys[32] && !jump) { //space for Jump
        jump = true;
        y = -mePlayer.speedY * 20;
        window.setTimeout(function () {
            jump = false;
        }, mePlayer.jumpTime);
    }

    if (!right && !left) {
        if (mePlayer.blockRender.PlayerO._animation.name !== "breath") {
            mePlayer.blockRender.PlayerO.gotoAndPlay("breath");
        }
    }
    mePlayer.sendUpdate(socketObject);
    mePlayer.move(x, y);


}

/**
 * callback function called every frame
 * @param {type} event
 * @returns {undefined}
 */
var pingi = 0;

function refreshCanvas() {
    for (var i = 0; i < objects.length; i++) {
        if (objects[i]) {
            objects[i].blockRender.x = objects[i].blockPhysics.position.x;
            objects[i].blockRender.y = objects[i].blockPhysics.position.y;
        }
    }
}

var event = {};
var fps = 60;
var now;
var then = Date.now();
var interval = 1000 / fps;
var delta;

function tick() {
    now = Date.now();
    delta = now - then;

    if (!createjs.Ticker.isPaused) {
        if (delta > interval) {
            event.delta = socketObject.socket.latency;
            Runner.tick(runner, engine, event.delta);
            keyboardCheck(event);
            refreshCanvas();
            if (pingi == 0) {
                socketObject.getLatency();
                pingi = 200;
            }
            else
                pingi--;
            mePlayer.update(socketObject);
            stage.update(event);
            mePlayer.sendUpdate(socketObject);
            lastTick = event.timestamp;
            then = now - (delta % interval);
        }
        requestAnimationFrame(tick);
    }
}

function OnOpen() {
    if (!mePlayer)
        socketObject.send("7:" + server);
}

function compare(a, b) {
    if (a == null || b == null)
        return 0;
    else if (a.points < b.points)
        return 1;
    else if (a.points > b.points)
        return -1;
    return 0;
}

function refreshTopList() {
    $("#statistic").html("");
    var temp = [];
    players.forEach(function each(e) {
        if (e)
            temp.push({"name": e.name, "points": e.points});
    });
    temp.push({"name": mePlayer.name, "points": mePlayer.points});
    temp.sort(compare);
    for (var i = 0; i < Math.min(5, temp.length); i++) {
        $("#statistic").append((i + 1) + ". <b>" + temp[i].name + "</b><br>");
    }
    return;
}

/**
 * retrieve server information and parses
 * @param {type} data
 * @returns {Number}
 */
function Eventcallback(data) {
    data = JSON.parse(data); //parse
    if (data['id']) { //retrieve unique ID for identification in network
        var pos = posrange[Math.floor(Math.random() * posrange.length)];
        if (pos[0] > window.innerWidth / 2) {
            stage.x = Math.floor(-pos[0] + stage.innerWidth * 0.5);
            //    stage.background.x = stage.background.x - stage.x + stage.x * 0.1;
        }
        // if (pos[1] < window.innerHeight / 2) {
        stage.y = Math.floor(window.innerHeight * 0.5);
        // }
        runner = Runner.create();
        //Runner.run(runner, engine);
        runner.isFixed = true;
        mePlayer = new Player(username, 100, pos[0], pos[1], 0, 0, 0, data['id'], healthLabel, boostLabel); //create Player
        new Weapon(mePlayer.blockRender);
        $("#overlay").hide();
        tick();
        stage.addEventListener("stagemousemove", mouseMove);
        mePlayer.initSend(socketObject);
        // socketObject.setCompression();
    } else if (data['0']) { //retrieved initial send (onjoin)
        if (players[data['0']['i']]) { //if there already was a bootstrap attempt for the player
            players[data['0']['i']].remove(stage, null);
            players[data['0']['i']] = null; //remove
        } else {
            mePlayer.damageTrackerUpdate(data['0']['n'] + " joined the game");
        }

        var hl = new StatusLabel().create(-5, -30, "#76B852", 50, 5, stage);
        var joinedPlayer = new Player(data[0]['n'], data['0']['h'], data['0']['x'],
            data['0']['y'], data['0']['r'], 0, 0, data['0']['i'], hl); //create a new player
        joinedPlayer.points = data['0']['p'];
        players[data['0']['i']] = joinedPlayer;
        new Weapon(joinedPlayer.blockRender);
        refreshTopList();

    } else if (data['1']) { //update player
        var params = data['1'].split(",");
        var id = parseInt(params[0]);
        var x = parseFloat(params[1]);
        var y = parseFloat(params[2]);
        var h = parseInt(params[3]);
        var d = parseInt(params[4]);
        var a = parseInt(params[5]);
        if (players[id]) {
            players[id].setCoords(x, y, d);
            if (Math.ceil(players[id].health - h) > 1) {
                players[id].damageTrackerUpdate(Math.ceil(players[id].health - h));
            }
            players[id].health = h;
            players[id].healthLabel.update(players[id].health, mePlayer.maxHealth);
            players[id].blockRender.weapon.rotation = a;
            players[id].blockRender.weapon.scaleY = Math.abs(a) > 90 ? -2 : 2;
            //players[id].healthLabel.x = x;
            //players[id].healthLabel.y = y - 50;
        } else {
            socketObject.send(JSON.stringify({2: data['1']['id']})); //on missing player request initial sends
        }
    } else if (data['2']) { //populate initial send (again),someone requested it
        mePlayer.initSend(socketObject);
    } else if (data['3']) { //player dead
        if (data['3']['by'] === mePlayer.socketId && players[data['3']['id']] !== undefined && players[data['3']['id']]) {
            mePlayer.damageTrackerUpdate("you killed " + players[data['3']['id']].name);
            mePlayer.points++;
        } else if (players[data['3']['by']] !== undefined && players[data['3']['id']] !== undefined && players[data['3']['id']] !== null && players[data['3']['by']] !== null && data['3']['by'] != "-1") {
            //  mePlayer.damageTrackerUpdate(players[data['3']['by']].name + " killed " + players[data['3']['id']].name);
            mePlayer.addStatus(players[data['3']['by']].name + " killed " + players[data['3']['id']].name);
            players[data['3']['by']].points++;
        } else if (players[data['3']['id']] !== undefined && players[data['3']['id']] && data['3']['by'] == "-1") {
            //  mePlayer.damageTrackerUpdate(players[data['3']['id']].name + " had disconnect");
            mePlayer.addStatus(players[data['3']['id']].name + " had disconnect");
        }
        if (players[data['3']['id']] != null) {
            players[data['3']['id']].remove(stage, data['3']['by']);
            players[data['3']['id']] = null;
            delete players[data['3']['id']]; //remove
        }
        refreshTopList();
    } else if (data['5']) { //initialize map
        stage.size = data['5']['0']["width"]; //set map size
        stage.height = (data['5']['0']["height"]);
        stage.canvas.height = (stage.height);
        var amount = data['5'].length;
        for (var i = 1; i < amount; ++i) {
            var o = data['5'][i];
            var b = new Block(parseFloat(o['x']), parseFloat(o['y']), "#C2826D", parseFloat(o['w']), parseFloat(o['h']), stage, true,
                {isStatic: true});
            if (o['r'])
                Matter.Body.rotate(b.blockPhysics, o['r']);
        }
        adjust = (window.innerHeight - stage.height) > 0 ? 0 : window.innerHeight - stage.height;
        stage.y = adjust;
        healthLabel.y -= adjust;
        boostLabel.y -= adjust;
        stage.playerInfo.y -= adjust;
        stage.height = window.innerHeight;
        stage.innerWidth = window.innerWidth;
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
    } else if (data['6']) {
        var b = new Bullet(data['6']['x'], data['6']['y'], "darkgrey", data['6']['id'], data['6']['tox'], data['6']['toy']);
        b.move();
    } else if (data['10']) {
        mePlayer.addStatus("<b>" + escapeHtml(data["10"]) + "</b>");
    }
}

/**
 * callback from mouse listener, used for shooting
 * @param {type} evt
 * @returns {undefined}
 */
function mouseEvent(evt) {

    if (mePlayer.blockRender.weapon && canshoot) {
        if (isMobile)
            mouseMove();
        if (evt.stageX - stage.x < mePlayer.blockRender.x) {
            mePlayer.setScale(-1);
        } else if (evt.stageX - stage.x > mePlayer.blockRender.x) {
            mePlayer.setScale(1);
        }
        var angle = mePlayer.blockRender.weapon.rotation / (180 / Math.PI);
        var multx = (mePlayer.blockPhysics.speed) > 1 ? (mePlayer.blockPhysics.speed) / 2 : 1;
        var multy = (mePlayer.blockPhysics.speed) > 1 ? (mePlayer.blockPhysics.speed) / 3 : 1;

        var x = mePlayer.blockRender.x + (multx) * 27 * Math.cos(angle);
        var y = mePlayer.blockRender.y + (multy) * 29 * Math.sin(angle);

        socketObject.send(JSON.stringify({
            6: {
                id: mePlayer.socketId,
                x: x,
                y: y,
                tox: (evt.stageX - 1 * stage.x),
                toy: (evt.stageY - 1 * stage.y)
            }
        }));
        var rand = Math.floor(Math.random() * 4);
        // if (rand === 0) {
        Matter.Body.applyForce(mePlayer.blockPhysics, mePlayer.blockPhysics.position, {
            x: -mePlayer.blockRender.PlayerO.scaleX * 0.001 * rand,
            y: 0
        });
        //}
        canshoot = false;
        setTimeout(function () {
            canshoot = true;
        }, mePlayer.blockRender.weapon.cooldown);
    }
}


Matter.Events.on(engine, 'collisionStart', function (e) {
    e.pairs.forEach(function (f) {
        if ((f.bodyA.label === "bullet")) {
            if (f.bodyB.label === "player") {
                if (f.bodyB.socketId === mePlayer.socketId)
                    mePlayer.hit(f.bodyA);
                f.bodyA.blockRender.explode();
                stage.addChild(new Blood(f.bodyB.position.x, f.bodyB.position.y, stage));
            }
        } else if ((f.bodyB.label === "bullet")) {
            if (f.bodyA.label === "player") {
                if (f.bodyA.socketId === mePlayer.socketId)
                    mePlayer.hit(f.bodyB);
                f.bodyB.blockRender.explode();
                stage.addChild(new Blood(f.bodyA.position.x, f.bodyA.position.y, stage));
            }
        }
    });
});
var mouseMove = function () {
    if (!mePlayer.blockRender.weapon)
        return;
    var rads = Math.atan2(stage.mouseY - 1 * stage.y - mePlayer.blockRender.y - mePlayer.blockRender.weapon.y, stage.mouseX - 1 * stage.x - mePlayer.blockRender.x + mePlayer.blockRender.weapon.x);
    var angle = rads * (180 / Math.PI);
    mePlayer.blockRender.PlayerO.scaleX = (stage.mouseX - 1 * stage.x) > mePlayer.blockRender.x ? 1 : -1;
    mePlayer.blockRender.weapon.scaleY = Math.abs(angle) > 90 ? -2 : 2;
    mePlayer.blockRender.weapon.rotation = angle;
};
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

$(document).ready(function () {
    if (window.StatusBar) window.StatusBar.hide();
    queue.loadManifest([
        {id: "bg", src: "client/assets/img/bg_1_1.png"},
        {id: "explosion", src: "client/assets/img/explosion.png"},
        {id: "player", src: "client/assets/img/playeranimation2.png"},
        {id: "grenadelauncher", src: "client/assets/img/grenadelauncher.png"},
        {id: "playerInfo", src: "client/assets/img/playerInfo.png"},
        {id: "brick", src: "client/assets/img/bricks.jpg"},
        {id: "blood", src: "client/assets/img/blood.png"}
    ]);
    queue.on("complete", handleComplete, this);

    function handleComplete() {
        stage = new Stage();
        socketObject = new Communication(Eventcallback, OnOpen); //reduce globals, parameterize callbacks
        $("#chatbox").hide();
        healthLabel = new StatusLabel().create(94, 42, "#76B852", 137, 13, stage);
        boostLabel = new StatusLabel().create(94, 56, "#ffd699", 137, 13, stage);


        render = Render.create({
            element: document.body,
            engine: engine,
            options: {
                width: 2500,
                height: 600,
                showAngleIndicator: true
            }
        });
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
        $("#chatbox").keypress(function (event) {
            if (event.which == 13) {
                socketObject.socket.send(JSON.stringify({
                    "10": username + "> " + $("#chatbox").val()
                }));
                mePlayer.addStatus("<b>" + username + "> " + escapeHtml($("#chatbox").val()) + "<b>");
                $("#chatbox").val("");
                $("#chatbox").hide();
                return false;
            }
        });
        createjs.Ticker.isPaused = false

    }
});
