/* global createjs */

//Bullet
var Bullet = function () {
    var create, canvasO;
    this.create = function (x, y, color, id, stage, tox, toy) {
        var width = 4, height = 4;
        this.canvasO = new createjs.Shape();
        this.canvasO.tox = tox;
        this.canvasO.toy = toy;
        this.canvasO.xvel = 0;
        this.canvasO.yvel = 0;
        this.canvasO.startX = x;
        this.canvasO.maxTime = 75;
        this.canvasO.startY = y;
        this.canvasO.timer = 0;
        this.canvasO.accelerationTime = 10;
        this.canvasO.bottomCallBack = function (object) {
            if (this.timer > this.maxTime || (object !== null && object.type === "player")) {
                this.explode();
            }
        };
        this.canvasO.topCallBack = function (object) {
            if (this.timer > this.maxTime || (object !== null && object.type === "player")) {
                this.explode();
            }
        };
        this.canvasO.leftCallBack = function (object) {
            if (this.timer > this.maxTime || (object !== null && object.type === "player")) {
                this.explode();
            }
        };
        this.canvasO.rightCallBack = function (object) {
            if (this.timer > this.maxTime || (object !== null && object.type === "player")) {
                this.explode();
            }
        };
        this.canvasO.graphics.beginFill(color).drawCircle(0, 0, width, height);
        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.playerId = id;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.color = color;
        this.canvasO.stage = stage;
        this.canvasO.gravityCounter = 0;
        this.canvasO.explode = function () {
            (new Explosion()).create(this.x, this.y, this.playerId, stage);
            delete stage.nonBlocking[this.id];
            delete stage.bullets[this.id];
            stage.removeChild(this);
        };
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;

        stage.addChild(this.canvasO);
        stage.bullets[this.canvasO.id] = this.canvasO;
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};
