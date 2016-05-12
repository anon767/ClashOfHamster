/* global createjs */

//player speed is currently 20*velocity, check the collission file
var Player = function () {
    var canvasO, stage, lastsend;
    var maxBoost, boostTimer, create, id, name, health, x, y, velocity, rotation, update, xvel, yvel, width, height, remove, addBoost, resetBoostTimer, boost;
    this.maxBoost = 500;
    this.boostTimer = this.maxBoost;
    this.resetBoostTimer = function () {
        this.boostTimer = this.maxBoost;
    };
    this.boost = function () {
        this.boostTimer -= 5;
    };
    this.addBoost = function () {
        if (this.boostTimer < this.maxBoost) {
            this.boostTimer++;
        }
    };
    this.remove = function () {
        this.stage.removeChild(this.canvasO);
    };
    this.update = function (socketO) {
        var data = JSON.stringify({1: {
                id: this.id,
                x: this.x,
                y: this.y,
                health: this.health,
                rotation: this.rotation
            }});
        if (data !== lastsend) {
            socketO.send(data);
            lastsend = data;
        }
    };
    this.initSend = function (socketO) {
        var data = JSON.stringify({
            0: {
                id: this.id,
                x: this.x,
                y: this.y,
                rotation: this.rotation,
                health: this.health,
                name: this.name
            }});
        socketO.send(data);
    };
    this.create = function (stage, name, health, x, y, velocity, rotation, xvel, yvel, id) {
        this.stage = stage;
        this.name = name;
        this.xvel = xvel;
        this.yvel = yvel;
        this.rotation = rotation;
        this.id = id;
        this.health = health;
        this.width = 40;
        this.height = 40;
        this.velocity = velocity;
        this.canvasO = new createjs.Shape();
        this.canvasO.graphics.beginFill("red").drawCircle(0, 0, 20);
        this.setX(x);
        this.setY(y);
        this.canvasO.regX = 20;
        this.canvasO.regY = 20;
        this.canvasO.setBounds(x, y, this.width, this.height);
        stage.addChild(this.canvasO);
    };
    this.setCoords = function (x, y) {
        this.setX(x);
        this.setY(y);
    };
    this.move = function (x, y) {
        this.setX(this.x + x);
        this.setY(this.y + y);
    };

    this.setX = function (x) {
        this.x = x;
        // complete fucking BS but required. maybe separate state from rendering
        this.canvasO.x = x ;
        this.canvasO.setBounds(this.canvasO.x, this.canvasO.y, this.width, this.height);
    };

    this.setY = function (y) {
        this.y = y;
        this.canvasO.y = y ;
        this.canvasO.setBounds(this.canvasO.x, this.canvasO.y, this.width, this.height);
    };
};