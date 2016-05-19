/* global createjs */

//player status info
var PlayerInfo = function () {
    var create, canvasO;
    this.create = function (stage) {
        var img = new Image(250, 114);
        img.src = queue.getResult("playerInfo").src;
        this.canvasO =  new createjs.Shape();
        this.canvasO.x = 0;
        this.canvasO.y = 0;
        this.canvasO.tickEnabled = false;
        this.canvasO.graphics.beginBitmapFill(img, 'no-repeat').drawRect(stage.x, 0, 250, 114);
        stage.addChild(this.canvasO);
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};

