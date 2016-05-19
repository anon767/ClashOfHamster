
//Block class is actually abstract modify the canvasO object!
var StatusLabel = function () {
    var create, canvasO, updateFlag, newColor;
    this.create = function (x, y, color, width, height, stage) {
        this.canvasO = new createjs.Shape();
        this.canvasO.graphics.beginFill(color);
        this.canvasO.graphics.beginStroke("black");
        this.canvasO.graphics.setStrokeStyle(2);
        this.canvasO.graphics.drawRect(0, 0, width, height).endFill();
        this.canvasO.regX = 0;
        this.canvasO.regY = 0;
        this.canvasO.x = x;
        this.canvasO.mouseEnabled = false;
        this.canvasO.width = width;
        this.canvasO.height = height;
        this.canvasO.color = color;
        this.canvasO.y = y;
        this.canvasO.snapToPixel = true;
        this.canvasO.tickEnabled = false;
        this.canvasO.cache(-width, -height, width * 2, height * 2); //cache this shit, unless its moveable later we dont have to update cache
        this.canvasO.update = function(value, maxValue){
            var scalar = 1/maxValue * value;
            this.scaleX = scalar;
            if(this.color === "green" || this.color === "red" || this.color === "yellow") {
                if (scalar <= 0.5 && scalar > 0.2) {
                    newColor = "yellow";
                } else if (scalar <= 0.2) {
                    newColor = "red";
                } else {
                    newColor = "green";
                }

                if (this.color != newColor) {
                    this.color = newColor;
                this.graphics.beginFill(this.color).drawRect(0, 0, width, height);
                this.updateCache();
                }
            }
        };
        stage.addChild(this.canvasO);
        stage.nonBlocking[this.canvasO.id] = this.canvasO;
        return this.canvasO;
    };
};
