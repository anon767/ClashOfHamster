/* global createjs */

//player speed is currently 20*velocity, check the collission file

//Player class is actually abstract, modify the canvasO!
var Player = function () {
    var canvasO,stage, lastsend;
    this.create = function (stage, name, health, x, y, rotation, xvel, yvel, id) {
        this.canvasO = new createjs.Shape();
        this.canvasO.maxBoost = 500;
        this.canvasO.stage = stage;
        this.canvasO.gravityCounter = 1;
        this.canvasO.boostTimer = 500;
        this.canvasO.jumpCounter = 0;
        this.canvasO.mouseEnabled = false;
        this.canvasO.resetBoostTimer = function () {
            this.boostTimer = this.maxBoost;
        };
        this.canvasO.boost = function () {
            this.boostTimer -= 5;
        };
        this.canvasO.addBoost = function () {
            if (this.boostTimer < this.maxBoost) {
                this.boostTimer++;
            }
        };
        this.canvasO.jump = function () {
            this.jumpCounter += 1;
        };
        this.canvasO.resetJumpCounter = function () {
            if (this.jumpCounter >= 1) {
                this.jumpCounter = 0;
            }
        };
        this.canvasO.remove = function (stage) {
            stage.removeChild(this);
        };
        this.canvasO.update = function (socketO) {
            var data = JSON.stringify({1: {
                    id: this.socketId,
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
        this.canvasO.initSend = function (socketO) {
            var data = JSON.stringify({
                0: {
                    id: this.socketId,
                    x: this.x,
                    y: this.y,
                    rotation: this.rotation,
                    health: this.health,
                    name: this.name
                }});
            socketO.send(data);
        };
        this.canvasO.setCoords = function (x, y) {
            this.x = x;
            this.y = y;
        };
        this.canvasO.move = function (x, y) {
            this.x += x;
            this.y += y;
        };
        this.canvasO.xvel = xvel;
        this.canvasO.width = 40;
        this.canvasO.height = 40;
        this.canvasO.socketId = id;
        this.canvasO.yvel = yvel;
        this.canvasO.health = health;
        this.canvasO.name = name;
        this.canvasO.rotation = rotation;
        this.canvasO.graphics.beginFill("red").drawCircle(-6, 9, 20);
        this.canvasO.y = y;
        this.canvasO.x = x;
        this.canvasO.regX = 20;
        this.canvasO.snapToPixel = true;
        this.canvasO.regY = 20;
        stage.addChild(this.canvasO);
        return this.canvasO;
    };

};
