/* global createjs */

//Bullet
var Bullet = function (x, y, color, id, tox, toy) {
    var create, blockRender;
    var width = 4, height = 4;
    this.blockPhysics = new Bodies.circle(x, y, (width + height) / 2, {
        friction: 0,
        continuous: 2,
        restitution: 1,
        inertia: Infinity,
        mass: 1
    });
    this.blockPhysics.label = "bullet";
    this.blockRender = new createjs.Shape();
    this.blockRender.tox = tox;
    this.blockRender.toy = toy;
    this.blockPhysics.blockRender = this.blockRender;
    this.blockRender.xvel = 0;
    this.blockRender.yvel = 0;
    this.blockRender.on("tick", function (event) {
        this.timer += 1;
        if (this.timer > this.maxTime) {
            this.explode();
        }
    });
    this.blockRender.startX = x;
    this.blockRender.type = "bullet";
    this.blockRender.maxTime = 75;
    this.blockRender.startY = y;
    this.blockRender.timer = 0;
    this.blockRender.accelerationTime = 10;
    this.blockRender.graphics.beginFill(color).drawCircle(0, 0, width, height);
    this.blockRender.regX = 0;
    this.blockRender.regY = 0;
    this.blockRender.playerId = id;
    this.blockRender.x = x;
    this.blockRender.mouseEnabled = false;
    this.blockRender.width = width;
    this.blockPhysics.socketId = id;
    this.blockRender.height = height;
    this.blockRender.color = color;
    this.blockRender.gravityCounter = 0;
    this.blockRender.explode = function () {
        (new Explosion()).create(this.x, this.y, this.playerId, stage);
        stage.removeChild(this);
        Matter.World.remove(engine.world, [this.blockPhysics]);
    };
    this.move = function () {
        Matter.Body.applyForce(this.blockPhysics, this.blockPhysics.position, {
            x: parseFloat(this.blockRender.tox - this.blockRender.startX)/6500,
            y: parseFloat(this.blockRender.toy - this.blockRender.startY)/6500
        })
    };
    this.blockRender.blockPhysics = this.blockPhysics;
    this.blockRender.y = y;
    this.blockRender.snapToPixel = true;
    this.blockPhysics.timer = this.blockRender.timer;
    stage.addChild(this.blockRender);
    World.add(world, this.blockPhysics);
    objects.push(this);
    return this;

};
