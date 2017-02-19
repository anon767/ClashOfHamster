var Mouse = function () {
    var setMouse;
    this.setMouse = function (stage,callback) {
        createjs.Touch.enable(stage);
        stage.mouseMoveOutside = false;
        stage.on("stagemousedown", callback,true);
    };


};