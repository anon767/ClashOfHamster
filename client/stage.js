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

    stage.background = (new Background()).create(stage);
    stage.playerInfo = (new PlayerInfo()).create(stage);
    stage.mouseEnabled = true;
    stage.snapToPixelEnabled = true; //seems like lagging out the game but idk
    stage.resizeCanvas = function () {

    };
    return stage;
};

