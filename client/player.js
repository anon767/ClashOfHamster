/* global createjs */

//player speed is currently 20*velocity, check the collission file

//Player class is actually abstract, modify the canvasO!
var Player = function () {
    var PlayerO, ContainerO, Texto;
    this.create = function (stage, name, health, x, y, rotation, xvel, yvel, id) {
        this.PlayerO = new createjs.Shape();
        this.ContainerO = new createjs.Container();
        this.TextO = new createjs.Text(name, "12px Arial", "darkblue");
        this.ContainerO.maxBoost = 500;
        this.ContainerO.stage = stage;
        this.ContainerO.gravityCounter = 1;
        this.ContainerO.boostTimer = 500;
        this.ContainerO.jumpCounter = 0;
        this.ContainerO.mouseEnabled = false;
        this.ContainerO.lastsend = "";
        this.ContainerO.resetBoostTimer = function () {
            this.boostTimer = this.maxBoost;
        };
        this.ContainerO.boost = function () {
            if (this.boostTimer > 0) {
                this.boostTimer -= 2;
            }
        };
        this.ContainerO.addBoost = function () {
            if (this.boostTimer < this.maxBoost) {
                this.boostTimer += 1;
            }
        };
        this.ContainerO.jump = function () {
            this.jumpCounter = 1;
        };
        this.ContainerO.resetJumpCounter = function () {
            this.jumpCounter = 0;
        };
        this.ContainerO.remove = function (stage) {
            stage.removeChild(this);
        };
        this.ContainerO.update = function (socketO) {
            var data = JSON.stringify({1: {
                    id: this.socketId,
                    x: this.x,
                    y: this.y,
                    health: this.health,
                    rotation: this.rotation
                }});
            if (data !== this.lastsend) {
                socketO.send(data);
                this.lastsend = data;
            }
        };
        this.ContainerO.initSend = function (socketO) {
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
        this.ContainerO.setCoords = function (x, y) {
            this.x = x;
            this.y = y;
        };
        this.ContainerO.move = function (x, y) {
            this.x += x;
            this.y += y;
        };
        this.ContainerO.xvel = xvel;
        this.ContainerO.width = 20;
        this.ContainerO.height = 20;
        this.ContainerO.socketId = id;
        this.ContainerO.yvel = yvel;
        this.ContainerO.health = health;
        this.ContainerO.name = name;
        this.ContainerO.rotation = rotation;
        this.PlayerO.graphics.beginFill("red").drawCircle(+20, +20, 10);
        this.ContainerO.y = y;
        this.ContainerO.x = x;
        this.ContainerO.regX = 10;
        this.ContainerO.snapToPixel = true;
        this.ContainerO.regY = 10;
        this.TextO.x = -5;
        this.TextO.y = 5;
        this.TextO.textBaseline = "alphabetic";
        this.ContainerO.addChild(this.PlayerO, this.TextO);
        this.ContainerO.y = y;
        this.ContainerO.x = x;
        stage.blocking.push(this.ContainerO);
        stage.addChild(this.ContainerO);
        return this.ContainerO;
    };

};
