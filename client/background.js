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
        this.canvasO.y = -window.innerHeight;
        this.canvasO.tickEnabled = false;
        this.canvasO.graphics.beginBitmapFill(img, 'repeat').drawRect(0, 0, window.innerWidth * 4, window.innerHeight * 6);
        this.canvasO.cache(-window.innerWidth * 2, -window.innerHeight * 3, window.innerWidth * 4, window.innerHeight * 6); //cache this shit, unless its moveable later we dont have to update cache

        stage.addChild(this.canvasO);
        return this.canvasO;
    };
};
