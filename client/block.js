/* global createjs */

var Block = function () {
    var x, y, color, width, height;
    var create, canvasO, stage, remove ;
    this.remove = function () { //incase we need to remove it
        this.stage.removeChild(this.canvasO);
    };
   
    this.create = function (x, y, color, width, height, stage) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.color = color;
        this.height = height;
        this.stage = stage;
        this.canvasO = new createjs.Shape();
        this.canvasO.graphics.beginStroke(color);
        this.canvasO.graphics.setStrokeStyle(2);
        this.canvasO.graphics.drawRect(0, 0, width, height);
        this.canvasO.setBounds(x, y, width, height);
        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.x = x;
        this.canvasO.snapToPixel = true;
        this.canvasO.y = y;
        this.canvasO.cache(-width,-height,width*2,height*2,1); //cache this shit, unless its moveable later we dont have to update cache
        stage.addChild(this.canvasO);
    };
};