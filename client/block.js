/* global createjs */

//Block class is actually abstract modify the canvasO object!
var Block = function () {
    var create, canvasO;
    this.create = function (x, y, color, width, height, stage) {
        this.canvasO = new createjs.Shape();
        this.canvasO.graphics.beginFill("#C2826D");
        this.canvasO.graphics.setStrokeStyle(2);
        this.canvasO.graphics.drawRect(0, 0, width, height);
        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.color = color;
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;
        this.canvasO.tickEnabled = false;
        this.canvasO.cache(-width, -height, width * 2, height * 2); //cache this shit, unless its moveable later we dont have to update cache
        stage.addChild(this.canvasO);
        stage.blocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};
