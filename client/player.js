/* global createjs, left, queue, socketObject, players */

//player speed is currently 20*velocity, check the collission file

//Player class is actually abstract, modify the canvasO!
var respawn = 5;
var Player = function (name, health, x, y, rotation, xvel, yvel, id, healthLabel, boostLabel, options) {
    var blockRender;
    if (!options)
        options = {};
    var img = new Image(44, 47);
    img.src = queue.getResult("player").src;
    this.blockRender = new createjs.Container();
    this.maxHealth = 100;
    this.lasthit = -1;
    this.points = 0;
    this.health = health;
    this.type = "player";
    this.name = name;
    this.PlayerO = new createjs.Shape();
    this.TextO = new createjs.Text(name, "13px Arial", "lightgreen");
    this.damageTracker = new createjs.Text("", "24px Arial", "white");
    this.damageTracker.yvel = 0;
    this.damageTracker.x = 15;
    this.damageTracker.xvel = 0;
    this.damageTracker.y = 15;
    this.damageTracker.gravityCounter = 0;
    this.gravityCounter = 0;
    this.maxBoost = 800;
    this.gravityCounter = 1;
    this.setScale = function (s) {
        this.blockRender.PlayerO.scaleX = s;
    }
    if (healthLabel) {
        this.healthLabel = healthLabel;
    }
    if (boostLabel) {
        this.boostLabel = boostLabel;
    }
    this.boostTimer = 500;
    this.jumpTime = 1500;
    this.mouseEnabled = false;
    this.lastsend = "";

    this.resetBoostTimer = function () {
        this.boostTimer = this.maxBoost;
    };
    this.boost = function () {
        if (this.boostTimer > 0) {
            this.boostTimer -= 4;
        }
    };
    this.addBoost = function () {
        if (this.boostTimer < this.maxBoost) {
            this.boostTimer += 3;
        }
    };

    this.remove = function (stage, by) {
        delete stage.blocking[this.id];
        stage.removeChild(this.healthLabel);
        Matter.World.remove(engine.world, [this.blockPhysics]);
        objects[this.blockRender.id] = null;
        delete objects[this.blockRender.id];
        if (by && by != -1) {
            stage.addChild(new Blood(this.blockRender.x, this.blockRender.y, stage));
            createjs.Tween.get(this.blockRender).to({alpha: 0}, 900).call(function (e) {
                stage.removeChild(e["target"]);
            });

        } else {
            stage.removeChild(this.blockRender);
        }
    };
    this.particleUpdate = function () {
        this.ps.position = {
            x: (this.blockRender.x + this.blockRender.x) / 2 - 17 * this.blockRender.PlayerO.scaleX,
            y: (this.blockRender.y + this.blockRender.height - 30)
        };
        this.ps.update(stage);
    };
    this.addStatus = function (text) {
        if (text.length > 5) {
            if ($("#status > div").size() > 10) {
                $("#status").html("");
            }
            $("#status").append("<div class=\"statusmsg\">" + text + "</div>");
        }
    };
    this.damageTrackerUpdate = function (x) {
        this.damageTracker.alpha = 1;
        this.damageTracker.gravityCounter = 0;
        this.damageTracker.x = 15;
        this.damageTracker.y = 15;
        this.addStatus(x);
        if (x && typeof x === "string" && x.indexOf("you killed") !== -1) {
            storage.addKills();
            this.point++;
            this.health += (100 - this.health) / 4;
        }
        this.damageTracker.text = x;
        this.damageTracker.yvel = -10;

        this.damageTracker.cache(-250, -50, 500, 100);
        createjs.Tween.get(this.damageTracker).to({alpha: 0.0, y: this.damageTracker.y - 155}, 6000);
    };
    this.update = function (socketO) {

        if (this.health < this.maxHealth) {
            this.health += 0.01;
        }

        if (this.health <= 0) {
            createjs.Ticker.isPaused = true;
            socketO.send('{"3": {"id": ' + this.socketId + ',"by": ' + this.lasthit + '}}');
            socketObject.socket.close();

            if (!$('#dead').is(":visible") && this.lasthit !== null) {
                if (this.lasthit === this.socketId) {
                    $('#dead').append("<h2> you killed yourself</h2>");
                } else {
                    if (typeof players[this.lasthit] != "undefined") {
                        $('#dead').append("<h2>Killed By " + players[this.lasthit].name + "</h2>");
                    } else {
                        $('#dead').append("<h2>You died</h2>");
                    }
                }
            }
            $("#dead").append("You respawn in <span id='timespawn'></span> seconds");
            setInterval(function () {
                console.log(respawn);
                respawn -= 1;
                $("#timespawn").html(respawn);
                if (respawn <= 0)
                    location.reload();
            }, 1000);
            $('#dead').show();
            storage.addDeaths();
            $('#dead').dialog({
                autoOpen: true,
                modal: true,
                draggable: true,
                title: "You are Dead!",
                close: function () {
                    location.href = "./index.html";
                }
            });

        }
        this.healthLabel.update(this.health, this.maxHealth);
        this.boostLabel.update(this.boostTimer, this.maxBoost);
        this.healthLabel.x = -stage.x + 94;
        this.boostLabel.x = -stage.x + 94;
        stage.playerInfo.x = -stage.x;
        stage.playerInfo.y = -stage.y;
        this.healthLabel.y = -stage.y + 42;
        this.boostLabel.y = -stage.y + 56;

    };
    this.sendUpdate = function (socketO) {
        var data = '{"1":"' + this.socketId + "," + this.blockPhysics.position.x + "," + this.blockPhysics.position.y + "," + Math.round(this.health) + "," + this.blockRender.PlayerO.scaleX + "," + Math.round(this.blockRender.weapon.rotation) + '"}';
        if (data !== this.lastsend) {
            socketO.send(data)
        }
        this.lastsend = data;
    };
    this.initSend = function (socketO) {
        var data = JSON.stringify({
            0: {
                i: this.socketId,
                x: this.blockRender.x,
                y: this.blockRender.y,
                r: this.blockRender.rotation,
                h: this.health,
                n: this.name
            }
        });
        socketO.send(data);
    };
    this.setCoords = function (x, y, dir) {
        this.blockRender.PlayerO.scaleX = dir;

        Matter.Body.setPosition(this.blockPhysics, {x: x, y: y});
        if (y < this.blockRender.y) {
            this.particleUpdate();
            this.blockRender.PlayerO.rotation = -this.blockRender.PlayerO.scaleX * 10;
        } else {
            for (var i = 0; i < this.ps.particles.length; i++) {
                this.ps.particles[i].dispose(stage);
            }
            this.blockRender.PlayerO.rotation = 0;
        }
        //Matter.Body.translate(this.blockPhysics, {x: x, y: y});

    };
    this.move = function (x, y) {
        Matter.Body.applyForce(this.blockPhysics, this.blockPhysics.position, {
            x: x,
            y: y
        })

        stage.moveStage();
    };
    this.ps = null;
    this.addParticle = function () {
        this.ps = new ParticleSystem();
        this.ps.lifetime = {min: 150, max: 200};
        this.ps.position = {
            x: (this.blockRender.x + this.blockRender.x + this.blockRender.width) / 2,
            y: (this.blockRender.y + this.blockRender.height)
        };
        this.ps.positionOffsetX = {min: -1, max: 2};
        this.ps.positionOffsetY = {min: -1, max: 2};
        this.ps.velocityY = {min: -2, max: 2};
        this.ps.velocityX = {min: -2, max: 2};
        this.ps.radius = {min: 3, max: 8};
        this.ps.count = 400;
        this.ps.startColor = {
            min: new RGBA(230, 50, 0, 255),
            max: new RGBA(255, 230, 0, 255)
        };
        this.ps.endColor = {
            min: new RGBA(255, 0, 0, 0),
            max: new RGBA(255, 0, 0, 0)
        };
    };
    this.blockRender.xvel = xvel;
    this.blockRender.width = 44;
    this.blockRender.height = 47;
    this.speedX = 0.001;
    this.speedY = 0.0015;
    this.socketId = id;
    this.blockRender.yvel = yvel;
    this.hit = function (objecta) {
        if (objecta.socketId !== this.socketId) {
            this.lasthit = objecta.socketId;
            var damage = Math.abs(Math.floor(1.5 * (10 * (this.blockRender.y - this.blockRender.height) / objecta.position.y)));
            this.damageTrackerUpdate("-" + damage);
            this.health -= damage;
        }
    };
    this.blockRender.rotation = rotation;
//this.blockRender.PlayerO.graphics.beginBitmapFill(img).drawRect(0, 0, 44, 47);
    var sprite = new createjs.SpriteSheet({
        "frames": {
            "width": 50,
            "regX": 0,
            "regY": 0,
            "height": 50,
            "count": 10
        },
        "animations": {
            "stand": 0,
            "run": [0, 4, true, 0.4],
            "breath": [5, 9, true, 0.08]
        },
        "images": [queue.getResult("player").src]
    });

    this.blockRender.PlayerO = new createjs.Sprite(sprite, "breath");
    this.blockRender.y = y;
    this.blockRender.x = x;
    this.blockRender.PlayerO.regX = this.blockRender.width / 2;
    this.blockRender.PlayerO.y += 3;
    this.blockRender.PlayerO.regY = this.blockRender.height / 2;
    this.blockPhysics = Bodies.rectangle(this.blockRender.x, this.blockRender.y, this.blockRender.width, this.blockRender.height, {
        mass: 1,
        frictionAir: 0.03,
        friction: 0.001,
        inertia: Infinity,
        isStatic: (mePlayer && mePlayer.socketId !== this.socketId)
    });
    this.blockRender.regX = 0;
    this.blockRender.snapToPixel = true;
    this.blockRender.regY = 0;
    this.TextO.x = -5;
    this.TextO.y = -45;
    this.TextO.cache(-50, -50, 100, 100);
    this.TextO.textBaseline = "alphabetic";
    if (mePlayer && mePlayer.socketId !== this.socketId)
        this.blockRender.addChild(this.blockRender.PlayerO, this.healthLabel, this.TextO, this.damageTracker);
    else
        this.blockRender.addChild(this.blockRender.PlayerO, this.TextO, this.damageTracker);
    this.blockRender.y = y;
    this.blockPhysics.label = "player";
    this.blockPhysics.blockRender = blockRender;
    this.blockPhysics.socketId = id;
    this.blockRender.x = x;
    this.addParticle();
    stage.addChild(this.blockRender);
    World.add(world, this.blockPhysics);
    objects[this.blockRender.id] = (this);
    return this;
};
