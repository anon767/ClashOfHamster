

var Collision = function () {
    var move, cls, obstacleCollision, maxvel, moveStage, collide // Maximum velocity
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
     * @param {type} nextx
     * @returns {undefined}
     */
    this.moveStage = function (x, stage, nextx) {
        var xNew = stage.x + x;
        if (nextx > (stage.innerWidth * 2 - stage.size) / 2 && xNew <= 0) { //only move stage if its between size
            stage.x = xNew;
            stage.background.x = stage.background.x - x + x * 0.1;
        } else if (xNew > 0 || (nextx < 100 && stage.x !== 0)) { //if stage.x is above 0 for what reason ever: reset it
            stage.x = 0;
            stage.background.x = 0;
        }
    };
    this.collide = function (objecta, nextposx, nextposy, objectb) {
        if (objecta && objectb) {
            if (nextposy + objecta.height > objectb.y &&
                    nextposx + objecta.width > objectb.x &&
                    nextposx < objectb.x + objectb.width &&
                    nextposy < objectb.y + objectb.height) {
                if (objecta.y + objecta.height < objectb.y) {
                    if (typeof objecta.bottomCallBack == 'function') {
                        objecta.bottomCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(1);
                    }
                    this.cls(0, objecta);
                }
                if (objecta.x + objecta.width < objectb.x) {
                    this.cls(1, objecta);
                    if (typeof objecta.leftCallBack == 'function') {
                        objecta.leftCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(1);
                    }
                }
                if (objecta.x > objectb.x + objectb.width) {
                    this.cls(2, objecta);
                    if (typeof objecta.rightCallBack == 'function') {
                        objecta.rightCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(0);
                    }
                }
                if (objecta.y > objectb.y + objectb.height) {
                    if (typeof objecta.topCallBack == 'function') {
                        objecta.topCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(0);
                    }
                    this.cls(3, objecta);
                }
            }
        }
    };

    //check collision with every other object
    this.obstacleCollision = function (Player, stage, nextposx, nextposy) {
        for (var i in stage.blocking) { //for instead of foreach 
            var rect = stage.blocking[i]; //faster than getChild();
            if (Player != null && rect != undefined && Player.id !== rect.id) {
                this.collide(Player, nextposx, nextposy, rect);
            }
        }
    };


    this.stageCollision = function (nextposx, nextposy, object) {
        if (nextposy - object.height < 0) {
            this.cls(3, object);
            if (typeof object.topCallBack == 'function') {
                object.topCallBack();
            }
        }
        if (nextposx + object.width > stage.size) {
            this.cls(1, object);
            if (typeof object.leftCallBack == 'function') {
                object.leftCallBack();
            }
        }
        if (nextposx - object.width < 0) {
            this.cls(2, object);
            if (typeof object.rightCallBack == 'function') {
                object.rightCallBack();
            }
        }
        if (nextposy + object.height > stage.canvas.height) {
            if (typeof object.bottomCallBack == 'function') {
                object.bottomCallBack();
            }
            this.cls(0, object);
        }

    };
//add velocity and check colliding with ceiling,left,right,and bottom of stage
    this.move = function (left, right, up, down, Player, stage, event, jump) {

        if (up) {

            Player.yvel -= 1.15;
        } else {
            if (Player.yvel < 0) {
                Player.yvel++;
            }
        }
        if (left) {
            Player.xvel -= 2;

        } else {
            if (Player.xvel < 0) {
                Player.xvel++;
            }
        }
        if (right) {

            Player.xvel += 2;

        } else {
            if (Player.xvel > 0) {
                Player.xvel--;
            }
        }
        if (down) {
            Player.yvel += 2;
        } else {
            if (Player.yvel > 0) {
                Player.yvel--;
            }
        }
        if (jump && Player.yvel === 0) {
            Player.yvel -= 30;
        }

        //gravity
        if ((Player.y + 50 < stage.canvas.height) && !up && !jump) {
            Player.yvel += Math.floor(2.5 * Player.gravityCounter * event.delta / 1000);
            Player.gravityCounter += 3;
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
        this.stageCollision(nextposx, nextposy, Player);

        this.moveStage(-1 * event.delta / 1000 * Player.xvel * 15, stage, nextposx - Player.width);
        Player.x += (event.delta / 1000 * Player.xvel * 20);
        Player.y += (event.delta / 1000 * Player.yvel * 20);
    }
    ;

};

