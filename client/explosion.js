/* global createjs */

//Explosion
var Explosion = function () {
    var create, canvasO, stage;
    this.create = function (x, y, id, stage) {
        var width = 5, height = 5;
        this.stage = stage;
        var sprite = new createjs.SpriteSheet({
            "frames": {
                "width": 65,
                "regX": 0,
                "regY": 0,
                "height": 65,
                "count": 25
            },
            "animations": {
                "run": [0, 24, false]
            },
            "images": ["client/assets/img/explosion.png"]
        });

        this.canvasO = new createjs.Sprite(sprite, "run");

        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.playerId = id;
        this.canvasO.scaleX = 0.7;
        this.canvasO.scaleY = 0.7;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;
        this.stage.addChild(this.canvasO);
        this.canvasO.on("animationend", function () {
            stage.nonBlocking[this.id] = null;
            stage.removeChild(this);
        });
        this.stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};
