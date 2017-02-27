/* global createjs, queue */

//Background
var Minimap = function (stage) {
    this.canvasO = new createjs.Container();
    this.canvasO.width = 360;
    this.canvasO.height = this.canvasO.width * stage.canvas.height / stage.canvas.width;
    this.canvasO.scaleX = this.canvasO.width / stage.canvas.width;
    this.canvasO.scaleY = this.canvasO.height / stage.canvas.height;
    this.canvasO.x = stage.canvas.width;
    this.canvasO.y = 0;
    this.canvasO.setTransform(this.canvasO.x, 0, this.canvasO.scaleX, this.canvasO.scaleY);
    this.canvasO.tickEnabled = false;
    for (var i = 0; i < objects.length; i++) {
        var newO = objects[i].blockRender.clone();
        this.canvasO.addChild(newO);
    }
    stage.addChild(this.canvasO);
    return this.canvasO;
};
