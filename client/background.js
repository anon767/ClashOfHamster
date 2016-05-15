/* global createjs */

//Background
var Background = function () {
    var create, canvasO;
    this.create = function (stage) {
        var img = new Image(1215, 608);
        img.src = "client/assets/img/background.jpg";
        this.canvasO =  new createjs.Shape();
        this.canvasO.x = 0;
        this.canvasO.y = -180;
        this.canvasO.tickEnabled = false;
        this.canvasO.graphics.beginBitmapFill(img, 'repeat').drawRect(0,0, stage.canvas.width*4, stage.canvas.height*4);
        stage.addChild(this.canvasO);
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.CanvasO;
    };
};