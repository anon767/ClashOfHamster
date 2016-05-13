/* global createjs */

//Bullet
var Bullet = function () {
    var create, canvasO;
    this.create = function (x, y, color, id, stage) {
        var width = 20, height = 20;
        this.canvasO = new createjs.Shape();
        this.canvasO.graphics.beginFill(color).drawCircle(-6, 9, width);
        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.name = "bullet";
        this.canvasO.playerId = id;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.color = color;
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;
        this.canvasO.cache(-width, -height, width * 2, height * 2); //cache this shit, unless its moveable later we dont have to update cache
        stage.addChild(this.canvasO);
        return this.canvasO;
    };
};
