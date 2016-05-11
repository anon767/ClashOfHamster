var Collision = function () {
    var move, cls, obstacleCollision, maxvel, moveStage; // Maximum velocity
    this.maxvel = 80;
//when colliding witch obstacle -> bounce to other direction
    this.cls = function (clsdir, Player) {
        if (clsdir === 0) { //top
            Player.yvel = (Player.yvel > 4) ? Math.round(Player.yvel * -0.5) : 0;
        }
        if (clsdir === 1) { //left
            Player.xvel = (Player.xvel > 4) ? Math.round(Player.xvel * -0.5) : 0;
        }
        if (clsdir === 2) { //right
            Player.xvel = (Player.xvel < -4) ? Math.round(Player.xvel * -0.5) : 0;
        }
        if (clsdir === 3) { //bottom
            Player.yvel = (Player.yvel < -4) ? Math.round(Player.yvel * -0.5) : 0;
        }
    };
    /**
     * moves "camera" by moving the stage to opposite direction the player walks
     * @param {type} x
     * @param {type} stage
     * @param {type} Player
     * @returns {undefined}
     */
    this.moveStage = function (x, stage, Player) {
        var xNew = stage.x + x;
        if (Player.x - Player.width > -stage.size + stage.innerWidth && xNew < 0) { //only move stage if its between size
            stage.x = xNew;
        } else if (xNew > 0) { //if stage.x is above 0 for what reason ever: reset it
            stage.x = 0;
        }
    };
    //check collission with every other object
    this.obstacleCollision = function (Player, stage, nextposx, nextposy) {
        var amount = stage.getNumChildren();
        for (var i = 0; i < amount; ++i) { //for instead of foreach 
            var rect = stage.getChildAt(i); //faster than getChild();
            if (Player.canvasO.id !== rect.id) {
                if(this.hitTest({ x: nextposx, y: nextposy }, Player, rect)) {
                    Player.yvel = (Math.abs(Player.yvel) > 4) ? Math.round(Player.yvel * -0.5) : 0;
                    Player.xvel = (Math.abs(Player.xvel) > 4) ? Math.round(Player.xvel * -0.5) : 0;
                }
            }
        }
    };

    this.hitTest = function(nextpos, player, displayObject) {
        var nextCoords = [
            { x: nextpos.x, y: nextpos.y },
            { x: nextpos.x + player.width, y: nextpos.y },
            { x: nextpos.x + player.width, y: nextpos.y + player.height },
            { x: nextpos.x,  y: nextpos.y + player.height }
        ];
        var bounds = displayObject.getBounds();
        // x, y, regx and regy are all set to 0 for rects, so we rotate around the upper left corner (== point 1)
        var rotated = [
            rotateClockwise({ x: 0, y: 0 }, displayObject.rotation),
            rotateClockwise({ x: bounds.width, y: 0}, displayObject.rotation),
            rotateClockwise({ x: bounds.width, y: bounds.height }, displayObject.rotation),
            rotateClockwise({ x: 0, y: bounds.height }, displayObject.rotation)
        ];
        var objectCoords = rotated.map(function(rota) {
            return { x: rota.x + displayObject.x, y: rota.y + displayObject.y }
        });
        return intersectRect(nextCoords, objectCoords);
    };

//add velocity and check colliding with ceiling,left,right,and bottom of stage
    this.move = function (left, right, up, down, Player, stage, event) {
        if (up === true) {
            Player.yvel -= 2;
        } else {
            if (Player.yvel < 0) {
                Player.yvel++;
            }
        }
        if (left === true) {
            Player.xvel -= 2;

        } else {
            if (Player.xvel < 0) {
                Player.xvel++;
            }
        }
        if (right === true) {

            Player.xvel += 2;

        } else {
            if (Player.xvel > 0) {
                Player.xvel--;
            }
        }
        if (down === true) {
            Player.yvel += 2;
        } else {
            if (Player.yvel > 0) {
                Player.yvel--;
            }
        }
        //gravity
        if (Player.y < stage.canvas.height) {
            Player.yvel += 1.5;
        }
        var nextposx = Player.x + event.delta / 1000 * Player.xvel * 20;
        var nextposy = Player.y + event.delta / 1000 * Player.yvel * 20;
        // Velocity limiter:

        if (Player.xvel > this.maxvel || Player.xvel < this.maxvel * -1) {
            (Player.xvel > 0) ? Player.xvel = this.maxvel : Player.xvel = this.maxvel * -1;
        }
        if (Player.yvel > this.maxvel || Player.yvel < this.maxvel * -1) {
            (Player.yvel > 0) ? Player.yvel = this.maxvel : Player.yvel = this.maxvel * -1;
        }
        this.obstacleCollision(Player, stage, nextposx, nextposy);
        if (nextposy - Player.height < 0) {
            this.cls(3, Player); // Inverted collision side is proposital!
        }
        if (nextposx + Player.width > stage.canvas.width + Math.abs(stage.canvas.width - stage.size)) {
            this.cls(1, Player);
        }
        if (nextposx - Player.width < 0) {
            this.cls(2, Player);
        }
        if (nextposy + Player.height > stage.canvas.height) {
            this.cls(0, Player);
        }
        this.moveStage(-1 * event.delta / 1000 * Player.xvel * 15, stage, Player);
        Player.move(event.delta / 1000 * Player.xvel * 20, event.delta / 1000 * Player.yvel * 20);
    };

};