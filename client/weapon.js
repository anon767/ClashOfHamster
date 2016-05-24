/* global createjs, queue */

//player status info
var Weapon = function () {
    var create, canvasO;
    this.create = function (container) {
        var img = new Image(250, 114);
        img.src = queue.getResult("grenade").src;
        this.canvasO = new createjs.Shape();
        this.canvasO.x = 28;
        this.canvasO.y = 18;
        this.canvasO.tickEnabled = false;
        this.canvasO.graphics.beginBitmapFill(img, 'no-repeat').drawRect(0, 0, 16, 10);
        container.addChild(this.canvasO);
        return this.canvasO;
    };
};

