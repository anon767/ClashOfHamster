/* global createjs */

//Block class is actually abstract modify the blockRender object!
var Block = function (x, y, color, width, height, stage, isBlock, options) {
    var create, blockRender;
    this.blockRender = new createjs.Shape();
    this.blockPhysics = Bodies.rectangle(x, y, width, height, options);
    this.blockPhysics.label = "block";
    this.blockRender.graphics.beginFill(color);
    this.blockRender.graphics.setStrokeStyle(2);
    this.blockRender.graphics.drawRect(0, 0, width, height);
    if (isBlock) {
        var img = new Image(1215, 792);
        img.src = queue.getResult("brick").src;
        this.blockRender.graphics.beginBitmapFill(img, 'repeat').drawRect(0, 0, width, height);
        this.blockRender.cache(-width , -height , width*2, height*2,0.5); //cache this shit, unless its moveable later we dont have to update cache

    }
    this.blockRender.regX = width / 2;
    this.blockRender.regY = height / 2;
    this.blockRender.mouseEnabled = false;
    this.blockRender.type = "block";
    this.blockRender.width = width;
    this.blockRender.height = height;
    this.blockRender.color = color;
    this.blockRender.snapToPixel = false;
    this.blockRender.tickEnabled = false;
    //this.blockRender.cache(-width, -height, width * 2, height * 2, 2); //cache this shit, unless its moveable later we dont have to update cache
    stage.addChild(this.blockRender);
    World.add(world, this.blockPhysics);
    objects[this.blockRender.id] = (this);
    return this;

};
