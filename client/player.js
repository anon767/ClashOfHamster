/* global createjs */
var Player = function (stage, name, health, x, y, rotation, xvel, yvel, id) {
    this.DisplayObject_initialize();
    this.lastsend = "";
    this.stage = stage;
    this.name = name;
    this.health = health;
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.snapToPixel = true;
    this.yvel = yvel;
    this.socketId = id;
    this.maxBoost = 500;
    this.boostTimer = this.maxBoost;
    this.rotation = rotation;
    this.regX = 20;
    this.regY = 20;
    this.width = 40;
    this.height = 40;
    this.setBounds(x, y, this.width, this.height);
    this.graphics.beginFill("red").drawCircle(0, 0, 20);
    this.stage.addChild(this);
};
Player.prototype = new createjs.Shape;
Player.prototype.constructor = Player;
Player.prototype.resetBoostTimer = function () {
    this.boostTimer = this.maxBoost;

};

Player.prototype.addBoost = function () {
    if (this.boostTimer < this.maxBoost) {
        this.boostTimer++;
    }
};
Player.prototype.boost = function () {
    this.boostTimer -= 5;
};
Player.prototype.remove = function () {
    this.stage.removeChild(this);
};
Player.prototype.update = function (socketO) {
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
Player.prototype.initSend = function (socketO) {
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
Player.prototype.resetBoostTimer = function () {
    this.boostTimer = this.maxBoost;
};
