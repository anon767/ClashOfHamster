/* global mePlayer */

var Collision = function () {
    var move, cls, obstacleCollision, maxvel, moveStage, collide; // Maximum velocity
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
     * moves camera
     * @param x
     * @param stage
     * @param nextx
     */

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
                        mePlayer.hit(1, objecta);
                    }
                    this.cls(0, objecta);
                }
                if (objecta.x + objecta.width < objectb.x) {
                    this.cls(1, objecta);
                    if (typeof objecta.leftCallBack == 'function') {
                        objecta.leftCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(1, objecta);
                    }
                }
                if (objecta.x > objectb.x + objectb.width) {
                    this.cls(2, objecta);
                    if (typeof objecta.rightCallBack == 'function') {
                        objecta.rightCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(0, objecta);
                    }
                }
                if (objecta.y > objectb.y + objectb.height) {
                    if (typeof objecta.topCallBack == 'function') {
                        objecta.topCallBack(objectb);
                    }
                    if (objectb.id === mePlayer.id) {
                        mePlayer.hit(0, objecta);
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
            if (Player != null && Player.id !== rect.id) {
                this.collide(Player, nextposx, nextposy, rect);
            }
        }
    };


    this.stageCollision = function (nextposx, nextposy, object) {
        if (nextposy - object.height < ((window.innerHeight - stage.height) < 0 ? (window.innerHeight - stage.height) : -60)) {
            this.cls(3, object);
            if (typeof object.topCallBack == 'function') {
                object.topCallBack(null);
            }
        }
        if (nextposx + object.width > stage.size) {
            this.cls(1, object);
            if (typeof object.leftCallBack == 'function') {
                object.leftCallBack(null);
            }
        }
        if (nextposx - object.width < 0) {
            this.cls(2, object);
            if (typeof object.rightCallBack == 'function') {
                object.rightCallBack(null);
            }
        }
        if (nextposy + object.height > stage.height) {
            if (typeof object.bottomCallBack == 'function') {
                object.bottomCallBack(null);
            }
            this.cls(0, object);
        }

    };
    this.applyGravity = function (object, stage, event, slow) {
        if (slow == null) {
            slow = 0;
        }

        //gravity
        if ((object.y + 50 < stage.canvas.height)) {
            object.yvel += Math.floor(0.05 * object.gravityCounter);
            object.gravityCounter += object.gravityCounter < 150 ? 3 - slow : 0;
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

        if (!up && !jump) {
            this.applyGravity(Player, stage, event);
        }

        // Velocity limiter:
        if (Player.xvel > this.maxvel || Player.xvel < this.maxvel * -1) {
            (Player.xvel > 0) ? Player.xvel = this.maxvel : Player.xvel = this.maxvel * -1;
        }
        if (Player.yvel > this.maxvel || Player.yvel < this.maxvel * -1) {
            (Player.yvel > 0) ? Player.yvel = this.maxvel : Player.yvel = this.maxvel * -1;
        }

        this.obstacleCollision(Player, stage, Player.x + event.delta / 1000 * Player.xvel * Player.speed, Player.y + event.delta / 1000 * Player.yvel * Player.speed);
        this.stageCollision(Player.x + event.delta / 1000 * Player.xvel * Player.speed, Player.y + event.delta / 1000 * Player.yvel * Player.speed, Player);

        this.moveStage(-1 * event.delta / 1000 * Player.xvel * Player.speed, stage, (Player.x + event.delta / 1000 * Player.xvel * Player.speed) - Player.width, -1 * event.delta / 1000 * Player.yvel * Player.speed, (Player.y - event.delta / 1000 * Player.yvel * Player.speed) - Player.height);
        Player.x += (event.delta / 1000 * Player.xvel * Player.speed);
        Player.y += (event.delta / 1000 * Player.yvel * Player.speed);
    };


};

