var Mouse = function () {
    var setMouse;
    this.setMouse = function (stage,callback) {
        stage.mouseMoveOutside = false;
        stage.on("stagemousedown", callback);
    };


};