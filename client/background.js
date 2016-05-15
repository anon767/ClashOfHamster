/* global createjs */

//Background
var Background = function () {
    var create, canvasO;
    this.create = function (stage) {
        this.canvasO = new createjs.Shape();
        img = new Image(path);
        CanvasO = new Shape();
        CanvasO.x = 0;
        CanvasO.y = 0;
        CanvasO.graphics.beginBitmapFill(img, 'repeat').drawRect(0, 0, stage.width, stage.height);
        this.canvasO.snapToPixel = true;
        stage.addChild(this.canvasO);
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};
