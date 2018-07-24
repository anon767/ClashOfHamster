var Stage = function () {
    var stage = new createjs.StageGL("stage");
    stage.size = 800;
    stage.bullets = [];
    stage.blocking = [];
    stage.moving = [];
    stage.nonBlocking = [];
    stage.innerWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
    stage.background = (new Background()).create(stage);
    stage.playerInfo = (new PlayerInfo()).create(stage);
    stage.mouseEnabled = true;
    stage.updateViewport(window.innerWidth, window.innerHeight);
    $(window).bind('resize', function (e) {
        stage.height = window.innerHeight;
        stage.innerWidth = window.innerWidth;
        stage.canvas.width = window.innerWidth;
        stage.canvas.height = window.innerHeight;
        adjust = (window.innerHeight - stage.height) > 0 ? 0 : window.innerHeight - stage.height;
        stage.y = adjust;
        healthLabel.y -= adjust;
        boostLabel.y -= adjust;
        stage.playerInfo.y -= adjust;
        stage.y = Math.floor(-mePlayer.blockRender.y + window.innerHeight / 2);

        stage.updateViewport(window.innerWidth, window.innerHeight);
    });
    stage.moveStage = function () {
        if (mePlayer.blockRender.x > (stage.innerWidth * 0.5)) { //only move stage if its between size
            var xNew = Math.floor(-mePlayer.blockRender.x + stage.innerWidth * 0.5);
            if (xNew > stage.x || xNew < stage.x && -stage.x < stage.size) {
                if (Math.floor(xNew) < Math.floor(stage.x)) {
                    stage.background.x -= -1;
                } else {
                    stage.background.x -= 1;
                }
                if (Math.abs(stage.background.x) >= Math.abs(stage.background.width) || stage.background.x > 0) {
                    stage.background.x = 0;
                }

                stage.x = xNew;

            }
        }

        if (mePlayer.blockRender.y + adjust < window.innerHeight / 2) { //only move stage if its between size
            var yNew = Math.floor(-mePlayer.blockRender.y + window.innerHeight / 2);

            stage.y = yNew;

        }

    };
    return stage;
};

