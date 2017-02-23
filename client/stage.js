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
    $(window).bind('resize', function (e) {
        if (window.RT) clearTimeout(window.RT);
        window.RT = setTimeout(function () {
            alert("please dont resize window!");
            location.href = "index.html";
            /* false to get page from cache */
        }, 100);
    });
    return stage;
};

