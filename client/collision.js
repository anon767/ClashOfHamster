var maxvel = 80; // Maximum velocity
//when colliding witch obstacle -> bounce to other direction
function cls(clsdir, Player) {
    if (clsdir === "top") {
        Player.yvel = (Player.yvel > 2) ? Math.round(Player.yvel * -0.5) : 0;
    }
    if (clsdir === "left") {
        Player.xvel = (Player.xvel > 2) ? Math.round(Player.xvel * -0.5) : 0;
    }
    if (clsdir === "right") {
        Player.xvel = (Player.xvel < -2) ? Math.round(Player.xvel * -0.5) : 0;
    }
    if (clsdir === "bottom") {
        Player.yvel = (Player.yvel < -2) ? Math.round(Player.yvel * -0.5) : 0;
    }
}
//add velocity and check colliding with ceiling,left,right,and bottom of stage
function move(left, right, up, down, Player, stage, event) {

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

    if (Player.xvel > maxvel || Player.xvel < maxvel * -1) {
        (Player.xvel > 0) ? Player.xvel = maxvel : Player.xvel = maxvel * -1;
    }
    if (Player.yvel > maxvel || Player.yvel < maxvel * -1) {
        (Player.yvel > 0) ? Player.yvel = maxvel : Player.yvel = maxvel * -1;
    }
    obstacleCollision(Player, stage, nextposx, nextposy);
    if (nextposy - Player.height < 0) { // Collided with TOP of stage. Trust me.
        cls("bottom", Player); // Inverted collision side is proposital!
    }
    if (nextposx - Player.width < 0) {
        cls("right", Player);
    }
    if (nextposx + Player.width > stage.canvas.width) {
        cls("left", Player);
    }
    if (nextposy + Player.height > stage.canvas.height) {

        cls("top", Player);
    }

    return [event.delta / 1000 * Player.xvel * 20, event.delta / 1000 * Player.yvel * 20];
}
//check collission with every other object
function obstacleCollision(Player, stage, nextposx, nextposy) {
    var amount = stage.getNumChildren() - 1;
    for (var i = amount; i >= 0; --i) { //for instead of foreach , backwards iterator
        var rect = stage.getChildAt(i); //faster than getChild();
        if (Player.canvasO !== rect) {
            if (nextposy + Player.height > rect.y &&
                    nextposx + Player.width > rect.x &&
                    nextposx < rect.x + rect.getBounds().width &&
                    nextposy < rect.y + rect.getBounds().height) {
                if (Player.y + Player.height < rect.y) {
                    cls("top", Player);
                }
                if (Player.x + Player.width < rect.x) {

                    cls("left", Player);
                }
                if (Player.x > rect.x + rect.getBounds().width) {

                    cls("right", Player);
                }
                if (Player.y > rect.y + rect.getBounds().height) {

                    cls("bottom", Player);
                }
            }
        }
    }
}