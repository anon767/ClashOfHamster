/* global createjs, queue */

//Explosion
var Explosion = function () {
    var create, canvasO;
    this.create = function (x, y, id, stage) {
        var width = 65, height = 65;
        var sprite = new createjs.SpriteSheet({
            "frames": {
                "width": 65,
                "regX": 0,
                "regY": 0,
                "height": 65,
                "count": 25
            },
            "animations": {
                "run": [0, 24, false,1.2]
            },
            "images": [queue.getResult("explosion").src]
        });

        this.canvasO = new createjs.Sprite(sprite, "run");
        this.canvasO.mystage = stage;

        this.canvasO.playerId = id;
        this.canvasO.scaleX = 0.7;
        this.canvasO.scaleY = 0.7;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.regX = width / 2;
        this.canvasO.regY = height / 2;
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;
        this.canvasO.mystage.addChild(this.canvasO);
        this.canvasO.on("animationend", function () {
            this.mystage.removeChild(this);
        });
        return this.canvasO;
    };
};
