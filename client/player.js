/* global createjs, left, queue, socketObject */

//player speed is currently 20*velocity, check the collission file

//Player class is actually abstract, modify the canvasO!
var Player = function () {
    var ContainerO;
    this.create = function (stage, name, health, x, y, rotation, xvel, yvel, id, healthLabel, boostLabel) {
        var img = new Image(44, 47);
        img.src = queue.getResult("player").src;
        this.ContainerO = new createjs.Container();
        this.ContainerO.maxHealth = 100;
        this.ContainerO.lasthit = -1;
        this.ContainerO.PlayerO = new createjs.Shape();
        this.TextO = new createjs.Text(name, "13px Arial", "#171369");
        this.ContainerO.damageTracker = new createjs.Text("", "12px Arial", "#B33646");
        this.ContainerO.damageTracker.yvel = 0;
        this.ContainerO.damageTracker.x = 15;
        this.ContainerO.damageTracker.xvel = 0;
        this.ContainerO.damageTracker.y = 15;
        this.ContainerO.damageTracker.gravityCounter = 0;
        this.ContainerO.gravityCounter = 0;
        this.ContainerO.maxBoost = 500;
        this.ContainerO.stage = stage;
        this.ContainerO.gravityCounter = 1;
        if (healthLabel) {
            this.ContainerO.healthLabel = healthLabel;
        }
        if (boostLabel) {
            this.ContainerO.boostLabel = boostLabel;
        }
        this.ContainerO.boostTimer = 500;
        this.ContainerO.jumpCounter = 0;
        this.ContainerO.mouseEnabled = false;
        this.ContainerO.lastsend = "";
        this.ContainerO.bottomCallBack = function () {
            this.gravityCounter = this.y !== 0 ? Math.floor(this.gravityCounter / 2) : 0;
            this.resetJumpCounter();
        };
        this.ContainerO.topCallBack = function () {

        };
        this.ContainerO.leftCallBack = function () {
            if (!this.PlayerO.paused) {
                this.PlayerO.gotoAndStop("stand");
            }

        };
        this.ContainerO.rightCallBack = function () {
            if (!this.PlayerO.paused) {
                this.PlayerO.gotoAndStop("stand");
            }

        };
        this.ContainerO.resetBoostTimer = function () {
            this.boostTimer = this.maxBoost;
        };
        this.ContainerO.boost = function () {
            if (this.boostTimer > 0) {
                this.boostTimer -= 4;
            }
        };
        this.ContainerO.addBoost = function () {
            if (this.boostTimer < this.maxBoost) {
                this.boostTimer += 1;
            }
        };
        this.ContainerO.jump = function () {
            this.jumpCounter = 1;
        };
        this.ContainerO.resetJumpCounter = function () {
            this.jumpCounter = 0;
        };
        this.ContainerO.remove = function (stage) {
            delete stage.blocking[this.id];
            stage.removeChild(this.healthLabel);
            stage.removeChild(this);
        };
        this.ContainerO.particleUpdate = function () {
            this.ps.position = {x: (this.x + this.x) / 2 - 10 * this.PlayerO.scaleX, y: (this.y + this.height - 4)};
            this.ps.update(stage);
        };
        this.ContainerO.damageTrackerUpdate = function (x) {
            this.damageTracker.alpha = 1;
            this.damageTracker.gravityCounter = 0;
            this.damageTracker.x = 15;
            this.damageTracker.y = 15;
            this.damageTracker.text = x;
            this.damageTracker.yvel = -5;
            createjs.Tween.get(this.damageTracker).to({alpha: 0.4}, 500);
        };
        this.ContainerO.update = function (socketO) {
            if (this.health <= 0) {
                socketO.send(JSON.stringify({
                    3:
                            {
                                "id": this.socketId,
                                "by": this.lasthit
                            }
                }));
                socketObject.socket.close();
                $('dead').show();
                $('#dead').dialog({
                    autoOpen: true,
                    modal: true,
                    draggable: true,
                    title: "You are Dead!",
                    close: function () {
                        location.href = "./index.php";
                    }
                });

            }
            this.healthLabel.update(this.health, this.maxHealth);
            this.boostLabel.update(this.boostTimer, this.maxBoost);
            this.healthLabel.x = -stage.x + 94;
            this.boostLabel.x = -stage.x + 94;
            stage.playerInfo.x = -stage.x;
            var data = JSON.stringify({1: {
                    id: this.socketId,
                    x: this.x,
                    y: this.y,
                    health: this.health,
                    rotation: this.rotation,
                    dir: this.PlayerO.scaleX
                }});
            if (data !== this.lastsend) {
                socketO.send(data);
                this.lastsend = data;
            }
        };
        this.ContainerO.initSend = function (socketO) {
            var data = JSON.stringify({
                0: {
                    id: this.socketId,
                    x: this.x,
                    y: this.y,
                    rotation: this.rotation,
                    health: this.health,
                    name: this.name
                }});
            socketO.send(data);
        };
        this.ContainerO.setCoords = function (x, y, dir) {
            this.PlayerO.scaleX = dir;
            if (this.y - y < 0) {
                this.particleUpdate();
            }
            this.x = x;
            this.y = y;
        };
        this.ContainerO.move = function (x, y) {
            this.x += x;
            this.y += y;
        };
        this.ContainerO.ps = null;
        this.ContainerO.addParticle = function () {
            this.ps = new ParticleSystem();
            this.ps.lifetime = {min: 150, max: 200};
            this.ps.position = {x: (this.x + this.x + this.width) / 2, y: (this.y + this.height)};
            this.ps.positionOffsetX = {min: -1, max: 2};
            this.ps.positionOffsetY = {min: -1, max: 2};
            this.ps.velocityY = {min: -2, max: 2};
            this.ps.velocityX = {min: -2, max: 2};
            this.ps.radius = {min: 3, max: 8};
            this.ps.count = 450;
            this.ps.startColor = {
                min: new RGBA(230, 50, 0, 255),
                max: new RGBA(255, 230, 0, 255)
            };
            this.ps.endColor = {
                min: new RGBA(255, 0, 0, 0),
                max: new RGBA(255, 0, 0, 0)
            };
        };
        this.ContainerO.xvel = xvel;
        this.ContainerO.width = 44;
        this.ContainerO.height = 47;
        this.ContainerO.socketId = id;
        this.ContainerO.yvel = yvel;
        this.ContainerO.hit = function (dir, by) {
            if (dir) {
                this.xvel += 25;
            } else {
                this.xvel -= 25;
            }
            this.lasthit = by;
            this.damageTrackerUpdate("-10");
            this.yvel -= 25;
            this.health -= 10;
        };
        this.ContainerO.health = health;
        this.ContainerO.name = name;
        this.ContainerO.rotation = rotation;
        //this.ContainerO.PlayerO.graphics.beginBitmapFill(img).drawRect(0, 0, 44, 47);
        var sprite = new createjs.SpriteSheet({
            "frames": {
                "width": 50,
                "regX": 0,
                "regY": 0,
                "height": 50,
                "count": 5
            },
            "animations": {
                "stand": 0,
                "run": [0, 4, true, 0.4]
            },
            "images": [queue.getResult("player").src]
        });

        this.ContainerO.PlayerO = new createjs.Sprite(sprite, "stand");
        this.ContainerO.y = y;
        this.ContainerO.x = x;
        this.ContainerO.PlayerO.y = 25;
        this.ContainerO.PlayerO.x = 24;
        this.ContainerO.PlayerO.regX = this.ContainerO.width / 2;
        this.ContainerO.PlayerO.regY = this.ContainerO.height / 2;
        this.ContainerO.regX = 0;
        this.ContainerO.snapToPixel = true;
        this.ContainerO.regY = 0;
        this.TextO.x = -5;
        this.TextO.y = 7;
        this.TextO.textBaseline = "alphabetic";
        this.ContainerO.addChild(this.ContainerO.PlayerO, this.TextO, this.ContainerO.damageTracker);
        this.ContainerO.y = y;
        this.ContainerO.x = x;
        this.ContainerO.addParticle();
        stage.addChild(this.ContainerO);
        stage.moving[this.ContainerO.damageTracker.id] = this.ContainerO.damageTracker;
        stage.blocking[this.ContainerO.id] = this.ContainerO;
        return this.ContainerO;
    };
};
