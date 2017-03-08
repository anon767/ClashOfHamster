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
    stage.background3 = (new Background()).create(stage);
    stage.playerInfo = (new PlayerInfo()).create(stage);
    stage.mouseEnabled = true;
    stage.snapToPixelEnabled = true; //seems like lagging out the game but idk
    $(window).bind('resize', function (e) {
        stage.height = window.innerHeight;
        stage.innerWidth = window.innerWidth;
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
/*        if (window.RT) clearTimeout(window.RT);
        window.RT = setTimeout(function () {
            location.reload();
        }, 100);*/
    });
    stage.moveStage = function () {
        if (mePlayer.blockRender.x > (stage.innerWidth * 0.5)) { //only move stage if its between size
            var xNew = Math.floor(-mePlayer.blockRender.x + stage.innerWidth * 0.5);
            if (xNew > stage.x || xNew < stage.x && -stage.x < stage.size) {
                if (Math.floor(xNew) < Math.floor(stage.x)) {
                    stage.background.x -= -1;
                    stage.background2.x -= -1;
                    stage.background3.x -= -1;
                } else {
                    stage.background.x -= 1;
                    stage.background2.x -= 1;
                    stage.background3.x -= 1;
                }
                if (Math.abs(stage.background.x) >= Math.abs(stage.background.width) || stage.background.x > 0) {
                    stage.background.x = 0;
                    stage.background2.x = stage.size;
                }

                stage.x = xNew;

            }
        }

        if (mePlayer.blockRender.y + adjust < window.innerHeight / 2 ) { //only move stage if its between size
            var yNew = Math.floor(-mePlayer.blockRender.y + window.innerHeight / 2);
            if (yNew >= (window.innerHeight - stage.height)) {
                stage.y = yNew;
            }
        }

    };
    return stage;
};

