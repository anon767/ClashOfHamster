/* global createjs */

//Bullet
var Blood = function (x, y, stage) {

    var sprite = new createjs.SpriteSheet({
        "frames": {
            "width": 500,
            "regX": 0,
            "regY": 0,
            "height": 500,
            "count": 9
        },
        "animations": {
            "run": [0, 8, false, 0.4]
        },
        "images": [queue.getResult("blood").src]
    });
    this.canvasO = new createjs.Sprite(sprite, "run");
    this.canvasO.x = x;
    this.canvasO.y = y;
    this.canvasO.regX = 500 / 2;
    this.canvasO.regY = 500 / 2;
    this.canvasO.mystage = stage;
    this.canvasO.scaleX = 0.2;
    this.canvasO.scaleY = 0.2;
    this.canvasO.on("animationend", function () {
        this.mystage.removeChild(this);
    });
    return this.canvasO;
}