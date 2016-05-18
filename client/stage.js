/**
 * Created by rbaum on 13.05.2016.
 */


var Stage = function () {
    var stage = new createjs.Stage("stage");
    stage.size = 800;
    stage.bullets = [];
    stage.blocking = [];
    stage.moving = [];
    stage.nonBlocking = [];
    var tempWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    stage.innerWidth = (tempWidth < stage.size) ? tempWidth : stage.size;
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = 400;
    stage.background = (new Background()).create(stage);
    stage.mouseEnabled = false;
    stage.snapToPixelEnabled = true; //seems like lagging out the game but idk
    stage.resizeCanvas = function () {
        var tempWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;
        stage.canvas.width = tempWidth;
        stage.innerWidth = (tempWidth < stage.size) ? tempWidth : stage.size;
    };
    return stage;
};

