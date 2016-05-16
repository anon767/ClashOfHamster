/* global createjs */

//Bullet
var Bullet = function () {
    var create, canvasO;
    this.create = function (x, y, color, id, stage) {
        var width = 5, height = 5;
        this.canvasO = new createjs.Shape();
        this.canvasO.graphics.beginFill(color).drawCircle(0, 0, width);
        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.playerId = id;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.color = color;
        this.canvasO.stage = stage;
        this.canvasO.explode = function () {
            (new Explosion()).create(this.x,this.y,this.playerId,this.stage);
            stage.nonBlocking[this.id] = null;
            stage.removeChild(this);
        };
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;
        stage.addChild(this.canvasO);
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};
