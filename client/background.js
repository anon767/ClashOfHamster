/* global createjs, queue */

//Background
var Background = function () {
    var create, canvasO;
    this.create = function (stage) {
        var img = new Image(1215, 792);
        img.src = queue.getResult("bg").src;
        this.canvasO = new createjs.Shape();
        this.canvasO.width = 1215;
        this.canvasO.x = 0;
        this.canvasO.y = -350;
        this.canvasO.tickEnabled = false;
        this.canvasO.graphics.beginBitmapFill(img, 'repeat').drawRect(0, 0, stage.size * 4, stage.canvas.height * 8);
        stage.addChild(this.canvasO);
        return this.canvasO;
    };
};
