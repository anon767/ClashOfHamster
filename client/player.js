/* global createjs, left */

//player speed is currently 20*velocity, check the collission file

//Player class is actually abstract, modify the canvasO!
var Player = function () {
    var ContainerO, Texto;
    this.create = function (stage, name, health, x, y, rotation, xvel, yvel, id) {
        var img = new Image(44, 47);
        img.src = "client/assets/img/player.png";
        this.ContainerO = new createjs.Container();
        this.ContainerO.PlayerO = new createjs.Shape();
        this.TextO = new createjs.Text(name, "12px Arial", "darkblue");
        this.ContainerO.maxBoost = 500;
        this.ContainerO.stage = stage;
        this.ContainerO.gravityCounter = 1;
        this.ContainerO.boostTimer = 500;
        this.ContainerO.jumpCounter = 0;
        this.ContainerO.mouseEnabled = false;
        this.ContainerO.lastsend = "";
        this.ContainerO.bottomCallBack = function () {
            this.gravityCounter = Math.floor(this.gravityCounter / 2);
            this.resetJumpCounter();
        };
        this.ContainerO.topCallBack = function () {

        };
        this.ContainerO.leftCallBack = function () {

        };
        this.ContainerO.rightCallBack = function () {

        };
        this.ContainerO.resetBoostTimer = function () {
            this.boostTimer = this.maxBoost;
        };
        this.ContainerO.boost = function () {
            if (this.boostTimer > 0) {
                this.boostTimer -= 4;
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
        this.ContainerO.particleUpdate = function () {
            this.ps.position = {x: (this.x + this.x) / 2 - 10*this.PlayerO.scaleX, y: (this.y + this.height - 4)};
            this.ps.update(stage);
        };
        this.ContainerO.update = function (socketO) {
            var data = JSON.stringify({1: {
                    id: this.socketId,
                    x: this.x,
                    y: this.y,
                    health: this.health,
                    rotation: this.rotation,
                    dir: this.PlayerO.scaleX
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
        this.ContainerO.setCoords = function (x, y, dir) {
            this.PlayerO.scaleX = dir;
            if (this.y - y < 0) {
                this.particleUpdate();
            }
            this.x = x;
            this.y = y;
        };
        this.ContainerO.move = function (x, y) {
            this.x += x;
            this.y += y;
        };
        this.ContainerO.ps = null;
        this.ContainerO.addParticle = function () {
            this.ps = new ParticleSystem();
            this.ps.lifetime = {min: 150, max: 200};
            this.ps.position = {x: (this.x + this.x + this.width) / 2, y: (this.y + this.height)};
            this.ps.positionOffsetX = {min: -1, max: 1};
            this.ps.positionOffsetY = {min: -1, max: 1};
            this.ps.velocityY = {min: -2, max: 2};
            this.ps.velocityX = {min: -2, max: 2};
            this.ps.radius = {min: 1, max: 7};
            this.ps.count = 150;
            this.ps.startColor = {
                min: new RGBA(230, 50, 0, 255),
                max: new RGBA(255, 230, 0, 255)
            };

            this.ps.endColor = {
                min: new RGBA(255, 0, 0, 0),
                max: new RGBA(255, 0, 0, 0)
            };
        };
        this.ContainerO.xvel = xvel;
        this.ContainerO.width = 44;
        this.ContainerO.height = 47;
        this.ContainerO.socketId = id;
        this.ContainerO.yvel = yvel;
        this.ContainerO.health = health;
        this.ContainerO.name = name;
        this.ContainerO.rotation = rotation;
        this.ContainerO.PlayerO.graphics.beginBitmapFill(img).drawRect(0, 0, 44, 47);
        //this.PlayerO.graphics.beginFill("red").drawCircle(+20, +20, 10);
        this.ContainerO.y = y;
        this.ContainerO.x = x;
        this.ContainerO.PlayerO.y = 23;
        this.ContainerO.PlayerO.x = 24;
        this.ContainerO.PlayerO.regX = this.ContainerO.width / 2;
        this.ContainerO.PlayerO.regY = this.ContainerO.height / 2;
        this.ContainerO.regX = 0;
        this.ContainerO.snapToPixel = true;
        this.ContainerO.regY = 0;
        this.TextO.x = -5;
        this.TextO.y = 5;
        this.TextO.textBaseline = "alphabetic";
        this.ContainerO.addChild(this.ContainerO.PlayerO, this.TextO);
        this.ContainerO.y = y;
        this.ContainerO.x = x;
        this.ContainerO.addParticle();
        stage.addChild(this.ContainerO);
        stage.blocking[this.ContainerO.id] = this.ContainerO;
        return this.ContainerO;
    };

};
