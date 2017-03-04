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
    stage.innerWidth = tempWidth;
    stage.canvas.width = window.innerWidth;

    stage.background = (new Background()).create(stage);
    stage.background2 = (new Background()).create(stage);

    stage.playerInfo = (new PlayerInfo()).create(stage);
    stage.mouseEnabled = true;
    stage.snapToPixelEnabled = true; //seems like lagging out the game but idk
    $(window).bind('resize', function (e) {
        if (window.RT) clearTimeout(window.RT);
        window.RT = setTimeout(function () {
            location.reload();
        }, 100);
    });
    stage.moveStage = function () {
        if (mePlayer.blockRender.x > (stage.innerWidth * 0.5) && mePlayer.blockRender.x < stage.size - (stage.innerWidth * 0.5 )) { //only move stage if its between size
            var xNew = Math.floor(-mePlayer.blockRender.x + stage.innerWidth * 0.5);
            if (xNew > stage.x || xNew < stage.x && -stage.x < stage.size) {
                if (Math.floor(xNew) < Math.floor(stage.x))
                    stage.background.x -= -1;
                else
                    stage.background.x -= 1;
                if (Math.abs(stage.background.x) >= Math.abs(stage.background.width) || stage.background.x > 0)
                    stage.background.x = 0;
                stage.x = xNew;

            }
        }

        if (mePlayer.blockRender.y < window.innerHeight / 2 && window.innerHeight < stage.height) { //only move stage if its between size
            var yNew = -mePlayer.blockRender.y + window.innerHeight / 2;
            if (yNew >= (window.innerHeight - stage.height))
                stage.y = yNew + adjust;
        }

    };
    return stage;
};

