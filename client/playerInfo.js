/* global createjs, queue */

//player status info
var PlayerInfo = function () {
    var create, canvasO;
    this.create = function (stage) {
        var img = new Image(250, 114);
        img.src = queue.getResult("playerInfo").src;
        this.canvasO = new createjs.Shape();
        this.canvasO.x = 0;
        this.canvasO.y = 0;
        this.canvasO.tickEnabled = false;
        this.canvasO.graphics.beginBitmapFill(img, 'no-repeat').drawRect(stage.x, 0, 250, 114);
        this.canvasO.cache(-250, -114, 250 * 2, 114 * 2); //cache this shit, unless its moveable later we dont have to update cache
        stage.addChild(this.canvasO);
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};

