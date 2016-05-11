var Collision = function () {
    var move, cls, obstacleCollision, maxvel, moveStage; // Maximum velocity
    this.maxvel = 80;
//when colliding witch obstacle -> bounce to other direction
    this.cls = function (clsdir, Player) {
        if (clsdir === "top") {
            Player.yvel = (Player.yvel > 4) ? Math.round(Player.yvel * -0.5) : 0;
        }
        if (clsdir === "left") {
            Player.xvel = (Player.xvel > 4) ? Math.round(Player.xvel * -0.5) : 0;
        }
        if (clsdir === "right") {
            Player.xvel = (Player.xvel < -4) ? Math.round(Player.xvel * -0.5) : 0;
        }
        if (clsdir === "bottom") {
            Player.yvel = (Player.yvel < -4) ? Math.round(Player.yvel * -0.5) : 0;
        }
    };
    this.moveStage = function (x, stage, Player) {
        var xNew = stage.x + x;
        if (Player.x - Player.width > -stage.size + stage.innerWidth && xNew < 0) { //only move stage if its between size
            stage.x = xNew;
        } else if (xNew > 0) { //if stage.x is above 0 for what reason ever reset it
            stage.x = 0;
        }

    };
    //check collission with every other object
    this.obstacleCollision = function (Player, stage, nextposx, nextposy) {
        var amount = stage.getNumChildren() - 1;
        for (var i = amount; i >= 0; --i) { //for instead of foreach , backwards iterator
            var rect = stage.getChildAt(i); //faster than getChild();
            if (Player.canvasO !== rect) {
                if (nextposy + Player.height > rect.y &&
                        nextposx + Player.width > rect.x &&
                        nextposx < rect.x + rect.getBounds().width &&
                        nextposy < rect.y + rect.getBounds().height) {
                    if (Player.y + Player.height < rect.y) {
                        this.cls("top", Player);
                    }
                    if (Player.x + Player.width < rect.x) {
                        this.cls("left", Player);
                    }
                    if (Player.x > rect.x + rect.getBounds().width) {

                        this.cls("right", Player);
                    }
                    if (Player.y > rect.y + rect.getBounds().height) {

                        this.cls("bottom", Player);
                    }
                }
            }
        }
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
        if (nextposy - Player.height < 0) { // Collided with TOP of stage. Trust me.
            this.cls("bottom", Player); // Inverted collision side is proposital!
        }
        //change: 
        if (nextposx + Player.width > stage.canvas.width + Math.abs(stage.canvas.width - stage.size)) {
            this.cls("left", Player);
        }
        if (nextposx - Player.width < 0) {
            this.cls("right", Player);
        }
        if (nextposy + Player.height > stage.canvas.height) {
            this.cls("top", Player);
        }
        this.moveStage(-1 * event.delta / 1000 * Player.xvel * 15, stage, Player);
        Player.move(event.delta / 1000 * Player.xvel * 20, event.delta / 1000 * Player.yvel * 20);

    };

};