var Collision = function () {
    var move, cls, obstacleCollision, maxvel, moveStage; // Maximum velocity
    this.maxvel = 80;
//when colliding witch obstacle -> bounce to other direction
    this.cls = function (clsdir, Player) {
        if (clsdir === 'top' || clsdir === 'bottom') {
            Player.yvel = (Math.abs(Player.yvel) > 4) ? Math.round(Player.yvel * -0.5) : 0;
        }
        if (clsdir === 'left' || clsdir === 'right') {
            Player.xvel = (Math.abs(Player.xvel) > 4) ? Math.round(Player.xvel * -0.5) : 0;
        }
    };
    this.moveStage = function (x, stage) {
        var xNew = stage.x + x;
        if (xNew > -stage.size + stage.innerWidth && xNew < 0) {
            stage.x = xNew;
        }

    };
    //check collission with every other object
    this.obstacleCollision = function (Player, stage, nextposx, nextposy) {
        var amount = stage.getNumChildren() - 1;
        for (var i = amount; i >= 0; --i) { //for instead of foreach , backwards iterator
            var rect = stage.getChildAt(i); //faster than getChild();
            if (Player.canvasO !== rect) {
                if(this.hitTest({ x: nextposx, y: nextposy }, Player, rect).every(id)) {
                    Player.yvel = (Math.abs(Player.yvel) > 4) ? Math.round(Player.yvel * -0.5) : 0;
                    Player.xvel = (Math.abs(Player.xvel) > 4) ? Math.round(Player.xvel * -0.5) : 0;
                }
            }
        }
    };

    this.hitTest = function(nextpos, player, displayObject) {
       nextCoords = {
           x1: nextpos.x,
           y1: nextpos.y,
           x2: nextpos.x + player.width,
           y2: nextpos.y,
           x3: nextpos.x + player.width,
           y3: nextpos.y + player.height,
           x4: nextpos.x,
           y4: nextpos.y + player.height
       };
        var bounds = displayObject.getBounds();
        // x, y, regx and regy are all set to 0 for rects, so we rotate around the upper left corner (== point 1)
        rotated1 = rotateClockwise({ x: 0, y: 0 }, displayObject.rotation);
        rotated2 = rotateClockwise({ x: bounds.width, y: 0}, displayObject.rotation);
        rotated3 = rotateClockwise({ x: bounds.width, y: bounds.height }, displayObject.rotation);
        rotated4 = rotateClockwise({ x: 0, y: bounds.height }, displayObject.rotation);
        objectCoords = {
            x1: rotated1.x + displayObject.x,
            y1: rotated1.y + displayObject.y,
            x2: rotated2.x + displayObject.x,
            y2: rotated2.y + displayObject.y,
            x3: rotated3.x + displayObject.x,
            y3: rotated3.y + displayObject.y,
            x4: rotated4.x + displayObject.x,
            y4: rotated4.y + displayObject.y
        };
        return intersectRect(nextCoords, objectCoords);
    };
//add velocity and check colliding with ceiling,left,right,and bottom of stage
    this.move = function (left, right, up, down, Player, stage, event, actionCallBack) {


        if (up === true) {
            Player.yvel -= 2;
        } else {
            if (Player.yvel < 0) {
                Player.yvel++;
            }
        }
        if (left === true) {
            Player.xvel -= 2;
            this.moveStage(-1 * event.delta / 1000 * Player.xvel * 18, stage);
        } else {
            if (Player.xvel < 0) {
                Player.xvel++;
            }
        }
        if (right === true) {

            Player.xvel += 2;
            this.moveStage(-1 * event.delta / 1000 * Player.xvel * 18, stage);
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
        if (nextposy < 0) { // Collided with TOP of stage. Trust me.
            this.cls("bottom", Player); // Inverted collision side is proposital!
        }
        if (nextposx < 0) {
            this.cls("right", Player);
        }
        if (nextposx + Player.width > stage.canvas.width) {
            this.cls("left", Player);
        }
        if (nextposy + Player.height > stage.canvas.height) {
            this.cls("top", Player);
        }
        Player.move(event.delta / 1000 * Player.xvel * 20, event.delta / 1000 * Player.yvel * 20);

    };

};