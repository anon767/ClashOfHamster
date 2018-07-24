/* global createjs, queue */

//player status info
var Weapon = function (container) {
    var img = new Image(250, 114);
    img.src = queue.getResult("grenadelauncher").src;
    this.canvasO = new createjs.Shape();
    this.canvasO.x = 0;
    this.canvasO.y = -10;
    this.canvasO.scaleX = 2;
    this.canvasO.scaleY = 2;
    this.canvasO.regX = 8;
    this.canvasO.regX = 5;
    this.canvasO.cooldown = 600; //ms
    this.canvasO.bulletWidth = 4;
    this.canvasO.bulletHeight = 4;
    this.canvasO.tickEnabled = false;
    this.canvasO.graphics.beginBitmapFill(img, 'no-repeat').drawRect(0, 0, 16, 10);
    this.canvasO.cache(-16 , -10 , 16*2, 10*2); //cache this shit, unless its moveable later we dont have to update cache

    container.weapon = this.canvasO;
    container.addChild(this.canvasO);
    return this.canvasO;
};

