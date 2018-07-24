(function(){"use strict";var Blood=function(x,y,stage){var sprite=new createjs.SpriteSheet({"frames":{"width":500,"regX":0,"regY":0,"height":500,"count":9},"animations":{"run":[0,8,false,0.4]},"images":[queue.getResult("blood").src]});this.canvasO=new createjs.Sprite(sprite,"run");this.canvasO.x=x;this.canvasO.y=y;this.canvasO.regX=500 / 2;this.canvasO.regY=500 / 2;this.canvasO.mystage=stage;this.canvasO.scaleX=0.2;this.canvasO.scaleY=0.2;this.canvasO.on("animationend",function(){this.mystage.removeChild(this);});return this.canvasO;}
var Minimap=function(stage){this.canvasO=new createjs.Container();this.canvasO.width=360;this.canvasO.height=this.canvasO.width*stage.canvas.height / stage.canvas.width;this.canvasO.scaleX=this.canvasO.width / stage.canvas.width;this.canvasO.scaleY=this.canvasO.height / stage.canvas.height;this.canvasO.x=stage.canvas.width;this.canvasO.y=0;this.canvasO.setTransform(this.canvasO.x,0,this.canvasO.scaleX,this.canvasO.scaleY);this.canvasO.tickEnabled=false;for(var i=0;i<objects.length;i++){var newO=objects[i].blockRender.clone();this.canvasO.addChild(newO);}
stage.addChild(this.canvasO);return this.canvasO;};var Background=function(){var create,canvasO;this.create=function(stage){var img=new Image(1215,792);img.src=queue.getResult("bg").src;this.canvasO=new createjs.Shape();this.canvasO.width=1215;this.canvasO.x=0;this.canvasO.y=-window.innerHeight;this.canvasO.tickEnabled=false;this.canvasO.graphics.beginBitmapFill(img,'repeat').drawRect(0,0,window.innerWidth*4,window.innerHeight*6);this.canvasO.cache(-window.innerWidth*2,-window.innerHeight*3,window.innerWidth*4,window.innerHeight*6);stage.addChild(this.canvasO);return this.canvasO;};};var Block=function(x,y,color,width,height,stage,isBlock,options){var create,blockRender;this.blockRender=new createjs.Shape();this.blockPhysics=Bodies.rectangle(x,y,width,height,options);this.blockPhysics.label="block";this.blockRender.graphics.beginFill(color);this.blockRender.graphics.setStrokeStyle(2);this.blockRender.graphics.drawRect(0,0,width,height);if(isBlock){var img=new Image(1215,792);img.src=queue.getResult("brick").src;this.blockRender.graphics.beginBitmapFill(img,'repeat').drawRect(0,0,width,height);this.blockRender.cache(-width,-height,width*2,height*2,0.5);}
this.blockRender.regX=width / 2;this.blockRender.regY=height / 2;this.blockRender.mouseEnabled=false;this.blockRender.type="block";this.blockRender.width=width;this.blockRender.height=height;this.blockRender.color=color;this.blockRender.snapToPixel=false;this.blockRender.tickEnabled=false;stage.addChild(this.blockRender);World.add(world,this.blockPhysics);objects[this.blockRender.id]=(this);return this;};var Bullet=function(x,y,color,id,tox,toy){var create,blockRender;var width=4,height=4;this.blockPhysics=new Bodies.circle(x,y,(width+height)/ 2,{friction:0,frictionAir:0,continuous:2,restitution:1,inertia:Infinity,mass:1});this.blockPhysics.label="bullet";this.blockRender=new createjs.Shape();this.blockRender.tox=tox;this.blockRender.toy=toy;this.blockPhysics.blockRender=this.blockRender;this.blockRender.xvel=0;this.blockRender.yvel=0;this.blockRender.maxTime=70;this.blockRender.on("tick",function(event){this.timer+=1;if(this.timer>this.maxTime){this.explode();}});this.blockRender.startX=x;this.blockRender.type="bullet";this.blockRender.startY=y;this.blockRender.timer=0;this.blockRender.accelerationTime=10;this.blockRender.graphics.beginFill(color).drawCircle(0,0,width,height);this.blockRender.cache(-width,-height,width*2,height*2);this.blockRender.regX=0;this.blockRender.regY=0;this.blockRender.playerId=id;this.blockRender.x=x;this.blockRender.mouseEnabled=false;this.blockRender.width=width;this.blockPhysics.socketId=id;this.blockRender.height=height;this.blockRender.color=color;this.blockRender.gravityCounter=0;this.blockRender.explode=function(){(new Explosion()).create(this.x,this.y,this.playerId,stage);stage.removeChild(this);delete objects[this.id];Matter.World.remove(engine.world,[this.blockPhysics]);};this.move=function(){var angle=Math.atan2(-this.blockRender.startY+this.blockRender.toy,-this.blockRender.startX+this.blockRender.tox);Matter.Body.setAngle(this.blockPhysics,angle);this.blockPhysics.force={x:0.06*Math.cos(angle),y:0.06*Math.sin(angle)};};this.blockRender.blockPhysics=this.blockPhysics;this.blockRender.y=y;this.blockRender.snapToPixel=true;this.blockPhysics.timer=this.blockRender.timer;stage.addChild(this.blockRender);World.add(world,this.blockPhysics);objects[this.blockRender.id]=(this);return this;};var Collision=function(){var move,cls,obstacleCollision,maxvel,moveStage,collide;this.maxvel=80;this.cls=function(clsdir,Player){if(clsdir===0){Player.yvel=(Player.yvel>4)?Math.round(Player.yvel*-0.5):0;}
if(clsdir===1){Player.xvel=(Player.xvel>4)?Math.round(Player.xvel*-0.5):0;}
if(clsdir===2){Player.xvel=(Player.xvel<-4)?Math.round(Player.xvel*-0.5):0;}
if(clsdir===3){Player.yvel=(Player.yvel<-4)?Math.round(Player.yvel*-0.5):0;}};this.collide=function(objecta,nextposx,nextposy,objectb){if(objecta&&objectb){if(nextposy+objecta.height>objectb.y&&nextposx+objecta.width>objectb.x&&nextposx<objectb.x+objectb.width&&nextposy<objectb.y+objectb.height){if(objecta.y+objecta.height<objectb.y){if(typeof objecta.bottomCallBack=='function'){objecta.bottomCallBack(objectb);}
if(objectb.id===mePlayer.id){mePlayer.hit(1,objecta);}
this.cls(0,objecta);}
if(objecta.x+objecta.width<objectb.x){this.cls(1,objecta);if(typeof objecta.leftCallBack=='function'){objecta.leftCallBack(objectb);}
if(objectb.id===mePlayer.id){mePlayer.hit(1,objecta);}}
if(objecta.x>objectb.x+objectb.width){this.cls(2,objecta);if(typeof objecta.rightCallBack=='function'){objecta.rightCallBack(objectb);}
if(objectb.id===mePlayer.id){mePlayer.hit(0,objecta);}}
if(objecta.y>objectb.y+objectb.height){if(typeof objecta.topCallBack=='function'){objecta.topCallBack(objectb);}
if(objectb.id===mePlayer.id){mePlayer.hit(0,objecta);}
this.cls(3,objecta);}}}};this.obstacleCollision=function(Player,stage,nextposx,nextposy){for(var i in stage.blocking){var rect=stage.blocking[i];if(Player!=null&&Player.id!==rect.id){this.collide(Player,nextposx,nextposy,rect);}}};this.stageCollision=function(nextposx,nextposy,object){if(nextposy-object.height<((window.innerHeight-stage.height)<0?(window.innerHeight-stage.height):-60)){this.cls(3,object);if(typeof object.topCallBack=='function'){object.topCallBack(null);}}
if(nextposx+object.width>stage.size){this.cls(1,object);if(typeof object.leftCallBack=='function'){object.leftCallBack(null);}}
if(nextposx-object.width<0){this.cls(2,object);if(typeof object.rightCallBack=='function'){object.rightCallBack(null);}}
if(nextposy+object.height>stage.height){if(typeof object.bottomCallBack=='function'){object.bottomCallBack(null);}
this.cls(0,object);}};this.applyGravity=function(object,stage,event,slow){if(slow==null){slow=0;}
if((object.y+50<stage.canvas.height)){object.yvel+=Math.floor(0.05*object.gravityCounter);object.gravityCounter+=object.gravityCounter<150?3-slow:0;}};this.move=function(left,right,up,down,Player,stage,event,jump){if(up){Player.yvel-=1.15;}else{if(Player.yvel<0){Player.yvel++;}}
if(left){Player.xvel-=2;}else{if(Player.xvel<0){Player.xvel++;}}
if(right){Player.xvel+=2;}else{if(Player.xvel>0){Player.xvel--;}}
if(down){Player.yvel+=2;}else{if(Player.yvel>0){Player.yvel--;}}
if(jump&&Player.yvel===0){Player.yvel-=30;}
if(!up&&!jump){this.applyGravity(Player,stage,event);}
if(Player.xvel>this.maxvel||Player.xvel<this.maxvel*-1){(Player.xvel>0)?Player.xvel=this.maxvel:Player.xvel=this.maxvel*-1;}
if(Player.yvel>this.maxvel||Player.yvel<this.maxvel*-1){(Player.yvel>0)?Player.yvel=this.maxvel:Player.yvel=this.maxvel*-1;}
this.obstacleCollision(Player,stage,Player.x+event.delta / 1000*Player.xvel*Player.speed,Player.y+event.delta / 1000*Player.yvel*Player.speed);this.stageCollision(Player.x+event.delta / 1000*Player.xvel*Player.speed,Player.y+event.delta / 1000*Player.yvel*Player.speed,Player);this.moveStage(-1*event.delta / 1000*Player.xvel*Player.speed,stage,(Player.x+event.delta / 1000*Player.xvel*Player.speed)-Player.width,-1*event.delta / 1000*Player.yvel*Player.speed,(Player.y-event.delta / 1000*Player.yvel*Player.speed)-Player.height);Player.x+=(event.delta / 1000*Player.xvel*Player.speed);Player.y+=(event.delta / 1000*Player.yvel*Player.speed);};};var Explosion=function(){var create,canvasO;this.create=function(x,y,id,stage){var width=65,height=65;var sprite=new createjs.SpriteSheet({"frames":{"width":65,"regX":0,"regY":0,"height":65,"count":25},"animations":{"run":[0,24,false,1.2]},"images":[queue.getResult("explosion").src]});this.canvasO=new createjs.Sprite(sprite,"run");this.canvasO.mystage=stage;this.canvasO.playerId=id;this.canvasO.scaleX=0.7;this.canvasO.scaleY=0.7;this.canvasO.x=x;this.canvasO.mouseEnabled=false;this.canvasO.width=width;this.canvasO.height=height;this.canvasO.regX=width / 2;this.canvasO.regY=height / 2;this.canvasO.y=y;this.canvasO.snapToPixel=true;this.canvasO.mystage.addChild(this.canvasO);this.canvasO.on("animationend",function(){this.mystage.removeChild(this);});return this.canvasO;};};var Keyboard=function(){var keys,keydown,keyup;this.keys=[];this.keydown=function(e){if(e.keyCode===13||e.keyCode===89||e.keyCode===65||e.keyCode===68||e.keyCode===83||e.keyCode===87||e.keyCode===39){this.keys[e.keyCode]=true;}else if(e.keyCode===37||e.keyCode===38||e.keyCode===40||e.keyCode===32){e.stopPropagation();this.keys[e.keyCode]=true;}};this.keyup=function(e){if(this.keys[e.keyCode])
this.keys[e.keyCode]=false;};};var Mouse=function(){var setMouse;this.setMouse=function(stage,callback){createjs.Touch.enable(stage);stage.mouseMoveOutside=false;stage.on("stagemousedown",callback,true);};};function rand(min,max){return(Math.floor(Math.random()*(max*1000-min*1000+1))+min*1000)/ 1000;}
function randColor(min,max){return new RGBA(rand(min.r,max.r),rand(min.g,max.g),rand(min.b,max.b),rand(min.a,max.a));}
function RGBA(r,g,b,a){this.r=r;this.g=g;this.b=b;this.a=a;this.str=function(){return"rgba("+Math.round(this.r)+","+Math.round(this.g)+","+Math.round(this.b)+","+Math.round(this.a)+")";};}
function Particle(){this.lifetime=100;this.radius=5;this.startColor=new RGBA(255,0,0,255);this.endColor=new RGBA(255,0,0,0);this.position={x:0,y:0};this.velocity={x:0,y:0};this.shape=null;this.isDead=function(){return this.lifetime<1;};this.update=function(stage){this.lifetime--;if(this.shape===null){this.shape=new createjs.Shape();this.shape.graphics.beginRadialGradientFill([this.startColor.str(),this.endColor.str()],[0,1],this.radius*2,this.radius*2,0,this.radius*2,this.radius*2,this.radius);this.shape.graphics.drawCircle(this.radius*2,this.radius*2,this.radius);this.shape.cache(-this.radius*2,-this.radius*2,this.radius*4,this.radius*4);createjs.Tween.get(this.shape).wait(this.lifetime*.7).to({alpha:0.5,useTicks:true},this.lifetime);createjs.Tween.get(this.shape).wait(this.lifetime*.5).to({scaleX:0,useTicks:true},this.lifetime);createjs.Tween.get(this.shape).wait(this.lifetime*.5).to({scaleY:0,useTicks:true},this.lifetime);stage.addChild(this.shape);}
this.shape.x=this.position.x;this.shape.y=this.position.y;this.position.x+=this.velocity.x;this.position.y+=this.velocity.y;};this.dispose=function(stage){stage.removeChild(this.shape);};}
function ParticleSystem(){this.particles=[];this.count=100;this.lifetime={min:10,max:50};this.velocityX={min:0,max:0};this.velocityY={min:0,max:0};this.positionOffsetX={min:0,max:0};this.positionOffsetY={min:0,max:0};this.position={x:0,y:0};this.radius={min:5,max:10}
this.startColor={min:new RGBA(200,80,0,255),max:new RGBA(255,160,0,255)};this.endColor={min:new RGBA(220,0,0,0),max:new RGBA(255,0,0,0)};this.update=function(stage){this.particles.forEach(function(p,i,array){if(p.isDead()){p.dispose(stage);stage.removeChild(p);array.splice(i,1);}else{p.update(stage);}});if(this.particles.length<this.count){var p=new Particle();p.lifetime=rand(this.lifetime.min,this.lifetime.max);p.position={x:this.position.x+rand(this.positionOffsetX.min,this.positionOffsetX.max),y:this.position.y+rand(this.positionOffsetY.min,this.positionOffsetY.max)};p.radius=rand(this.radius.min,this.radius.max);p.velocity={x:rand(this.velocityX.min,this.velocityX.max),y:rand(this.velocityY.min,this.velocityY.max)}
p.startColor=randColor(this.startColor.min,this.startColor.max);p.endColor=randColor(this.endColor.min,this.endColor.max);this.particles.push(p);}};}
var respawn=5;var Player=function(name,health,x,y,rotation,xvel,yvel,id,healthLabel,boostLabel,options){var blockRender;if(!options)
options={};var img=new Image(44,47);img.src=queue.getResult("player").src;this.blockRender=new createjs.Container();this.maxHealth=100;this.lasthit=-1;this.points=0;this.health=health;this.type="player";this.name=name;this.PlayerO=new createjs.Shape();this.TextO=new createjs.Text(name,"13px Arial","lightgreen");this.damageTracker=new createjs.Text("","24px Arial","red");this.damageTracker.yvel=0;this.damageTracker.x=15;this.damageTracker.xvel=0;this.damageTracker.y=15;this.damageTracker.gravityCounter=0;this.gravityCounter=0;this.maxBoost=800;this.gravityCounter=1;this.setScale=function(s){this.blockRender.PlayerO.scaleX=s;}
if(healthLabel){this.healthLabel=healthLabel;}
if(boostLabel){this.boostLabel=boostLabel;}
this.boostTimer=500;this.jumpTime=1500;this.mouseEnabled=false;this.lastsend="";this.resetBoostTimer=function(){this.boostTimer=this.maxBoost;};this.boost=function(){if(this.boostTimer>0){this.boostTimer-=4;}};this.addBoost=function(){if(this.boostTimer<this.maxBoost){this.boostTimer+=3;}};this.remove=function(stage,by){delete stage.blocking[this.id];stage.removeChild(this.healthLabel);Matter.World.remove(engine.world,[this.blockPhysics]);objects[this.blockRender.id]=null;delete objects[this.blockRender.id];if(by&&by!=-1){stage.addChild(new Blood(this.blockRender.x,this.blockRender.y,stage));createjs.Tween.get(this.blockRender).to({alpha:0},900).call(function(e){stage.removeChild(e["target"]);});}else{stage.removeChild(this.blockRender);}};this.particleUpdate=function(){this.ps.position={x:(this.blockRender.x+this.blockRender.x)/ 2-17*this.blockRender.PlayerO.scaleX,y:(this.blockRender.y+this.blockRender.height-30)};this.ps.update(stage);};this.addStatus=function(text){if(text.length>5){if($("#status > div").size()>10){$("#status").html("");}
$("#status").append("<div class=\"statusmsg\">"+text+"</div>");}};this.damageTrackerUpdate=function(x){this.damageTracker.alpha=1;this.damageTracker.gravityCounter=0;this.damageTracker.x=15;this.damageTracker.y=15;this.addStatus(x);if(x&&typeof x==="string"&&x.indexOf("you killed")!==-1){storage.addKills();this.point++;this.health+=(100-this.health)/ 4;}
this.damageTracker.text=x;this.damageTracker.yvel=-10;createjs.Tween.get(this.damageTracker).to({alpha:0.0,y:this.damageTracker.y-155},3000);};this.update=function(socketO){if(this.health<this.maxHealth){this.health+=0.01;}
if(this.health<=0){createjs.Ticker.setPaused(true);socketO.send('{"3": {"id": '+this.socketId+',"by": '+this.lasthit+'}}');socketObject.socket.close();if(!$('#dead').is(":visible")&&this.lasthit!==null){if(this.lasthit===this.socketId){$('#dead').append("<h2> you killed yourself</h2>");}else{if(typeof players[this.lasthit]!="undefined"){$('#dead').append("<h2>Killed By "+players[this.lasthit].name+"</h2>");}else{$('#dead').append("<h2>You died</h2>");}}}
$("#dead").append("You respawn in <span id='timespawn'></span> seconds");setInterval(function(){console.log(respawn);respawn-=1;$("#timespawn").html(respawn);if(respawn<=0)
location.reload();},1000);$('#dead').show();storage.addDeaths();$('#dead').dialog({autoOpen:true,modal:true,draggable:true,title:"You are Dead!",close:function(){location.href="./index.html";}});}
this.healthLabel.update(this.health,this.maxHealth);this.boostLabel.update(this.boostTimer,this.maxBoost);this.healthLabel.x=-stage.x+94;this.boostLabel.x=-stage.x+94;stage.playerInfo.x=-stage.x;stage.playerInfo.y=-stage.y;this.healthLabel.y=-stage.y+42;this.boostLabel.y=-stage.y+56;};this.sendUpdate=function(socketO){var data='{"1":"'+this.socketId+","+this.blockPhysics.position.x+","+this.blockPhysics.position.y+","+Math.round(this.health)+","+this.blockRender.PlayerO.scaleX+","+Math.round(this.blockRender.weapon.rotation)+'"}';if(data!==this.lastsend){socketO.send(data)}
this.lastsend=data;};this.initSend=function(socketO){var data=JSON.stringify({0:{i:this.socketId,x:this.blockRender.x,y:this.blockRender.y,r:this.blockRender.rotation,h:this.health,n:this.name}});socketO.send(data);};this.setCoords=function(x,y,dir){this.blockRender.PlayerO.scaleX=dir;Matter.Body.setPosition(this.blockPhysics,{x:x,y:y});if(y<this.blockRender.y){this.particleUpdate();this.blockRender.PlayerO.rotation=-this.blockRender.PlayerO.scaleX*10;}else{for(var i=0;i<this.ps.particles.length;i++){this.ps.particles[i].dispose(stage);}
this.blockRender.PlayerO.rotation=0;}};this.move=function(x,y){Matter.Body.applyForce(this.blockPhysics,this.blockPhysics.position,{x:x,y:y})
stage.moveStage();};this.ps=null;this.addParticle=function(){this.ps=new ParticleSystem();this.ps.lifetime={min:150,max:200};this.ps.position={x:(this.blockRender.x+this.blockRender.x+this.blockRender.width)/ 2,y:(this.blockRender.y+this.blockRender.height)};this.ps.positionOffsetX={min:-1,max:2};this.ps.positionOffsetY={min:-1,max:2};this.ps.velocityY={min:-2,max:2};this.ps.velocityX={min:-2,max:2};this.ps.radius={min:3,max:8};this.ps.count=400;this.ps.startColor={min:new RGBA(230,50,0,255),max:new RGBA(255,230,0,255)};this.ps.endColor={min:new RGBA(255,0,0,0),max:new RGBA(255,0,0,0)};};this.blockRender.xvel=xvel;this.blockRender.width=44;this.blockRender.height=47;this.speedX=0.001;this.speedY=0.0015;this.socketId=id;this.blockRender.yvel=yvel;this.hit=function(objecta){if(objecta.socketId!==this.socketId){this.lasthit=objecta.socketId;var damage=Math.abs(Math.floor(1.5*(10*(this.blockRender.y-this.blockRender.height)/ objecta.position.y)));this.damageTrackerUpdate("-"+damage);this.health-=damage;}};this.blockRender.rotation=rotation;var sprite=new createjs.SpriteSheet({"frames":{"width":50,"regX":0,"regY":0,"height":50,"count":10},"animations":{"stand":0,"run":[0,4,true,0.4],"breath":[5,9,true,0.08]},"images":[queue.getResult("player").src]});this.blockRender.PlayerO=new createjs.Sprite(sprite,"breath");this.blockRender.y=y;this.blockRender.x=x;this.blockRender.PlayerO.regX=this.blockRender.width / 2;this.blockRender.PlayerO.y+=3;this.blockRender.PlayerO.regY=this.blockRender.height / 2;this.blockPhysics=Bodies.rectangle(this.blockRender.x,this.blockRender.y,this.blockRender.width,this.blockRender.height,{mass:1,frictionAir:0.03,friction:0.001,inertia:Infinity,isStatic:(mePlayer&&mePlayer.socketId!==this.socketId)});this.blockRender.regX=0;this.blockRender.snapToPixel=true;this.blockRender.regY=0;this.TextO.x=-5;this.TextO.y=-35;this.TextO.textBaseline="alphabetic";if(mePlayer&&mePlayer.socketId!==this.socketId)
this.blockRender.addChild(this.blockRender.PlayerO,this.healthLabel,this.TextO,this.damageTracker);else
this.blockRender.addChild(this.blockRender.PlayerO,this.TextO,this.damageTracker);this.blockRender.y=y;this.blockPhysics.label="player";this.blockPhysics.blockRender=blockRender;this.blockPhysics.socketId=id;this.blockRender.x=x;this.addParticle();stage.addChild(this.blockRender);World.add(world,this.blockPhysics);objects[this.blockRender.id]=(this);return this;};var PlayerInfo=function(){var create,canvasO;this.create=function(stage){var img=new Image(250,114);img.src=queue.getResult("playerInfo").src;this.canvasO=new createjs.Shape();this.canvasO.x=0;this.canvasO.y=0;this.canvasO.tickEnabled=false;this.canvasO.graphics.beginBitmapFill(img,'no-repeat').drawRect(stage.x,0,250,114);this.canvasO.cache(-250,-114,250*2,114*2);stage.addChild(this.canvasO);stage.nonBlocking[this.canvasO.id]=this.canvasO;return this.canvasO;};};function Communication(Eventcallback,onopencallback){var socket,send;this.socket=new WebSocket('ws://irc.thecout.com:8080');this.socket.latency=1;this.socket.ping=1;this.socket.pong=1;this.socket.open=onopencallback;this.socket.onerror=function(e){console.log("error occured ",e);}
this.socket.onmessage=function(s){if(s.data==="logoff:exceeded"){alert("There are too many Hamster on the Server, try another!");location.href="index.html";return;}
if(s.data==="hello"){this.open();return;}
if(s.data==="8"){this.pong=Date.now();if((this.pong-this.ping)>2000){alert("You have a too slow Connection, try again later!");location.href="index.html";return;}
this.latency=this.pong-this.ping;return;}
if(s.data==="gtfo"){alert("nope nope get out of here you little skid");location.href="index.html";return;}
Eventcallback(s.data);};this.getLatency=function(){if(mePlayer.speedX>0.001||mePlayer.speedY>0.0015)
location.href="index.html";this.socket.ping=Date.now();socketObject.send("8");}
this.send=function(data){this.socket.send(data);};};var Stage=function(){var stage=new createjs.StageGL("stage");stage.size=800;stage.bullets=[];stage.blocking=[];stage.moving=[];stage.nonBlocking=[];stage.innerWidth=window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;stage.canvas.width=window.innerWidth;stage.canvas.height=window.innerHeight;stage.background=(new Background()).create(stage);stage.playerInfo=(new PlayerInfo()).create(stage);stage.mouseEnabled=true;stage.updateViewport(window.innerWidth,window.innerHeight);$(window).bind('resize',function(e){stage.height=window.innerHeight;stage.innerWidth=window.innerWidth;stage.canvas.width=window.innerWidth;stage.canvas.height=window.innerHeight;adjust=(window.innerHeight-stage.height)>0?0:window.innerHeight-stage.height;stage.y=adjust;healthLabel.y-=adjust;boostLabel.y-=adjust;stage.playerInfo.y-=adjust;stage.y=Math.floor(-mePlayer.blockRender.y+window.innerHeight / 2);});stage.moveStage=function(){if(mePlayer.blockRender.x>(stage.innerWidth*0.5)){var xNew=Math.floor(-mePlayer.blockRender.x+stage.innerWidth*0.5);if(xNew>stage.x||xNew<stage.x&&-stage.x<stage.size){if(Math.floor(xNew)<Math.floor(stage.x)){stage.background.x-=-1;}else{stage.background.x-=1;}
if(Math.abs(stage.background.x)>=Math.abs(stage.background.width)||stage.background.x>0){stage.background.x=0;}
stage.x=xNew;}}
if(mePlayer.blockRender.y+adjust<window.innerHeight / 2){var yNew=Math.floor(-mePlayer.blockRender.y+window.innerHeight / 2);stage.y=yNew;}};return stage;};var StatusLabel=function(){var create,canvasO,updateFlag,newColor;this.create=function(x,y,color,width,height,stage){this.canvasO=new createjs.Shape();this.canvasO.graphics.beginFill(color);this.canvasO.graphics.beginStroke("black");this.canvasO.graphics.setStrokeStyle(2);this.canvasO.graphics.drawRect(0,0,width,height).endFill();this.canvasO.regX=0;this.canvasO.regY=0;this.canvasO.x=x;this.canvasO.mouseEnabled=false;this.canvasO.width=width;this.canvasO.height=height;this.canvasO.color=color;this.canvasO.y=y;this.canvasO.snapToPixel=true;this.canvasO.tickEnabled=false;this.canvasO.cache(-width,-height,width*2,height*2);this.canvasO.update=function(value,maxValue){var scalar=1/maxValue*value;this.scaleX=scalar;if(this.color==="#76B852"||this.color==="#FF0000"||this.color==="#F2FF00"){if(scalar<=0.5&&scalar>0.2){newColor="#F2FF00";}else if(scalar<=0.2){newColor="#FF0000";}else{newColor="#76B852";}
if(this.color!=newColor){this.color=newColor;this.graphics.beginFill(this.color).drawRect(0,0,width,height);this.updateCache();}}};stage.addChild(this.canvasO);stage.nonBlocking[this.canvasO.id]=this.canvasO;return this.canvasO;};};var Weapon=function(container){var img=new Image(250,114);img.src=queue.getResult("grenadelauncher").src;this.canvasO=new createjs.Shape();this.canvasO.x=0;this.canvasO.y=-10;this.canvasO.scaleX=2;this.canvasO.scaleY=2;this.canvasO.regX=8;this.canvasO.regX=5;this.canvasO.cooldown=600;this.canvasO.bulletWidth=4;this.canvasO.bulletHeight=4;this.canvasO.tickEnabled=false;this.canvasO.graphics.beginBitmapFill(img,'no-repeat').drawRect(0,0,16,10);this.canvasO.cache(-16,-10,16*2,10*2);container.weapon=this.canvasO;container.addChild(this.canvasO);return this.canvasO;};console.log("     _           _              __   _                         _");console.log("    | |         | |            / _| | |                       | |");console.log(" ___| | __ _ ___| |__     ___ | |_  | |__   __ _ _ __ ___  ___| |_ ___ _ __");console.log("/ __| |/ _` / __| '_ \\   / _ \\|  _| | '_ \\ / _` | '_ ` _ \\/ __| __/ _ \\ '__|");console.log("| (__| | (_| \\__ \\ | | | | (_) | |   | | | | (_| | | | | | \\__ \\ ||  __/ |");console.log("\\___|_|\\__,_|___/_| |_|  \\___/|_|   |_| |_|\\__,_|_| |_| |_|___/\\__\\___|_|");var Engine=Matter.Engine,Render=Matter.Render,Runner=Matter.Runner,Events=Matter.Events,render=null,MouseConstraint=Matter.MouseConstraint,MouseMatter=Matter.Mouse,World=Matter.World,Bodies=Matter.Bodies,runner=null;var engine=Engine.create({enableSleeping:false}),world=engine.world;var joystick,stage=null,timeCircle,socketObject,keyboard=new Keyboard(),collision,mePlayer=null,mouse,healthLabel,boostLabel;var up=false,left=false,right=false,down=false,jump=false;var players=[null,null,null,null,null,null];var queue=new createjs.LoadQueue(false);var canshoot=true;var objects=[];var isMobile=false;var adjust;var lastTick=null;var posrange=[[100,100],[2000,100]];function keyboardCheck(event){var x=0,y=0;if(keyboard.keys[89]){$("#chatbox").show();$("#chatbox").focus();}
if((keyboard.keys[87]||keyboard.keys[38]||(isMobile&&joystick.up()))&&mePlayer.boostTimer>0){up=true;y=-mePlayer.speedY;mePlayer.blockRender.PlayerO.rotation=-mePlayer.blockRender.PlayerO.scaleX*10;mePlayer.boost();}else{up=false;mePlayer.addBoost();}
if(keyboard.keys[65]||keyboard.keys[37]||(isMobile&&joystick.left())){x=-mePlayer.speedX;mePlayer.blockRender.PlayerO.scaleX=-1;mePlayer.setScale(-1);if(mePlayer.blockRender.PlayerO._animation.name!=="run"){mePlayer.blockRender.PlayerO.gotoAndPlay("run");}
left=true;}else{left=false;}
if(keyboard.keys[68]||keyboard.keys[39]||(isMobile&&joystick.right())){x=mePlayer.speedX;if(mePlayer.blockRender.PlayerO._animation.name!=="run"){mePlayer.blockRender.PlayerO.gotoAndPlay("run");}
mePlayer.setScale(1);right=true;}else{right=false;}
if(keyboard.keys[83]||keyboard.keys[40]||(isMobile&&joystick.down())){y=mePlayer.speedY;mePlayer.blockRender.PlayerO.rotation=mePlayer.blockRender.PlayerO.scaleX*10;down=true;}else{down=false;}
if(!up&&!down){mePlayer.blockRender.PlayerO.rotation=0;if(mePlayer.ps!==null&&mePlayer.ps.particles.length>0){for(var i=0;i<mePlayer.ps.particles.length;i++)
mePlayer.ps.particles[i].dispose(stage);}}else if(up){if(mePlayer.ps!==null){mePlayer.particleUpdate();}}
if(keyboard.keys[32]&&!jump){jump=true;y=-mePlayer.speedY*20;window.setTimeout(function(){jump=false;},mePlayer.jumpTime);}
if(!right&&!left){if(mePlayer.blockRender.PlayerO._animation.name!=="breath"){mePlayer.blockRender.PlayerO.gotoAndPlay("breath");}}
mePlayer.sendUpdate(socketObject);mePlayer.move(x,y);}
var pingi=0;function refreshCanvas(){for(var i=0;i<objects.length;i++){if(objects[i]){objects[i].blockRender.x=objects[i].blockPhysics.position.x;objects[i].blockRender.y=objects[i].blockPhysics.position.y;}}}
var event={};var fps=60;var now;var then=Date.now();var interval=1000 / fps;var delta;function tick(){now=Date.now();delta=now-then;if(delta>interval){event.delta=socketObject.socket.latency;Runner.tick(runner,engine,event.delta);keyboardCheck(event);refreshCanvas();if(pingi==0){socketObject.getLatency();pingi=200;}
else
pingi--;mePlayer.update(socketObject);stage.update(event);mePlayer.sendUpdate(socketObject);lastTick=event.timestamp;then=now-(delta%interval);}
requestAnimationFrame(tick);}
function OnOpen(){if(!mePlayer)
socketObject.send("7:"+server);}
function compare(a,b){if(a==null||b==null)
return 0;else if(a.points<b.points)
return 1;else if(a.points>b.points)
return-1;return 0;}
function refreshTopList(){$("#statistic").html("");var temp=[];players.forEach(function each(e){if(e)
temp.push({"name":e.name,"points":e.points});});temp.push({"name":mePlayer.name,"points":mePlayer.points});temp.sort(compare);for(var i=0;i<Math.min(5,temp.length);i++){$("#statistic").append((i+1)+". <b>"+temp[i].name+"</b><br>");}
return;}
function Eventcallback(data){data=JSON.parse(data);if(data['id']){var pos=posrange[Math.floor(Math.random()*posrange.length)];if(pos[0]>window.innerWidth / 2){stage.x=Math.floor(-pos[0]+stage.innerWidth*0.5);}
stage.y=Math.floor(window.innerHeight*0.5);runner=Runner.create();runner.isFixed=true;mePlayer=new Player(username,100,pos[0],pos[1],0,0,0,data['id'],healthLabel,boostLabel);new Weapon(mePlayer.blockRender);$("#overlay").hide();tick();stage.addEventListener("stagemousemove",mouseMove);mePlayer.initSend(socketObject);}else if(data['0']){if(players[data['0']['i']]){players[data['0']['i']].remove(stage,null);players[data['0']['i']]=null;}else{mePlayer.damageTrackerUpdate(data['0']['n']+" joined the game");}
var hl=new StatusLabel().create(-5,-30,"#76B852",50,5,stage);var joinedPlayer=new Player(data[0]['n'],data['0']['h'],data['0']['x'],data['0']['y'],data['0']['r'],0,0,data['0']['i'],hl);joinedPlayer.points=data['0']['p'];players[data['0']['i']]=joinedPlayer;new Weapon(joinedPlayer.blockRender);refreshTopList();}else if(data['1']){var params=data['1'].split(",");var id=parseInt(params[0]);var x=parseFloat(params[1]);var y=parseFloat(params[2]);var h=parseInt(params[3]);var d=parseInt(params[4]);var a=parseInt(params[5]);if(players[id]){players[id].setCoords(x,y,d);if(Math.ceil(players[id].health-h)>1){players[id].damageTrackerUpdate(Math.ceil(players[id].health-h));}
players[id].health=h;players[id].healthLabel.update(players[id].health,mePlayer.maxHealth);players[id].blockRender.weapon.rotation=a;players[id].blockRender.weapon.scaleY=Math.abs(a)>90?-2:2;}else{socketObject.send(JSON.stringify({2:data['1']['id']}));}}else if(data['2']){mePlayer.initSend(socketObject);}else if(data['3']){if(data['3']['by']===mePlayer.socketId&&players[data['3']['id']]!==undefined&&players[data['3']['id']]){mePlayer.damageTrackerUpdate("you killed "+players[data['3']['id']].name);mePlayer.points++;}else if(players[data['3']['by']]!==undefined&&players[data['3']['id']]!==undefined&&players[data['3']['id']]!==null&&players[data['3']['by']]!==null&&data['3']['by']!="-1"){mePlayer.addStatus(players[data['3']['by']].name+" killed "+players[data['3']['id']].name);players[data['3']['by']].points++;}else if(players[data['3']['id']]!==undefined&&players[data['3']['id']]&&data['3']['by']=="-1"){mePlayer.addStatus(players[data['3']['id']].name+" had disconnect");}
if(players[data['3']['id']]!=null){players[data['3']['id']].remove(stage,data['3']['by']);players[data['3']['id']]=null;delete players[data['3']['id']];}
refreshTopList();}else if(data['5']){stage.size=data['5']['0']["width"];stage.height=(data['5']['0']["height"]);stage.canvas.height=(stage.height);var amount=data['5'].length;for(var i=1;i<amount;++i){var o=data['5'][i];var b=new Block(parseFloat(o['x']),parseFloat(o['y']),"#C2826D",parseFloat(o['w']),parseFloat(o['h']),stage,true,{isStatic:true});if(o['r'])
Matter.Body.rotate(b.blockPhysics,o['r']);}
adjust=(window.innerHeight-stage.height)>0?0:window.innerHeight-stage.height;stage.y=adjust;healthLabel.y-=adjust;boostLabel.y-=adjust;stage.playerInfo.y-=adjust;stage.height=window.innerHeight;stage.innerWidth=window.innerWidth;stage.canvas.width=window.innerWidth;stage.canvas.height=window.innerHeight;}else if(data['6']){var b=new Bullet(data['6']['x'],data['6']['y'],"darkgrey",data['6']['id'],data['6']['tox'],data['6']['toy']);b.move();}else if(data['10']){mePlayer.addStatus("<b>"+escapeHtml(data["10"])+"</b>");}}
function mouseEvent(evt){if(mePlayer.blockRender.weapon&&canshoot){if(isMobile)
mouseMove();if(evt.stageX-stage.x<mePlayer.blockRender.x){mePlayer.setScale(-1);}else if(evt.stageX-stage.x>mePlayer.blockRender.x){mePlayer.setScale(1);}
var angle=mePlayer.blockRender.weapon.rotation /(180 / Math.PI);var multx=(mePlayer.blockPhysics.speed)>1?(mePlayer.blockPhysics.speed)/ 2:1;var multy=(mePlayer.blockPhysics.speed)>1?(mePlayer.blockPhysics.speed)/ 3:1;var x=mePlayer.blockRender.x+(multx)*27*Math.cos(angle);var y=mePlayer.blockRender.y+(multy)*29*Math.sin(angle);socketObject.send(JSON.stringify({6:{id:mePlayer.socketId,x:x,y:y,tox:(evt.stageX-1*stage.x),toy:(evt.stageY-1*stage.y)}}));var rand=Math.floor(Math.random()*4);Matter.Body.applyForce(mePlayer.blockPhysics,mePlayer.blockPhysics.position,{x:-mePlayer.blockRender.PlayerO.scaleX*0.001*rand,y:0});canshoot=false;setTimeout(function(){canshoot=true;},mePlayer.blockRender.weapon.cooldown);}}
Matter.Events.on(engine,'collisionStart',function(e){e.pairs.forEach(function(f){if((f.bodyA.label==="bullet")){if(f.bodyB.label==="player"){if(f.bodyB.socketId===mePlayer.socketId)
mePlayer.hit(f.bodyA);f.bodyA.blockRender.explode();stage.addChild(new Blood(f.bodyB.position.x,f.bodyB.position.y,stage));}}else if((f.bodyB.label==="bullet")){if(f.bodyA.label==="player"){if(f.bodyA.socketId===mePlayer.socketId)
mePlayer.hit(f.bodyB);f.bodyB.blockRender.explode();stage.addChild(new Blood(f.bodyA.position.x,f.bodyA.position.y,stage));}}});});var mouseMove=function(){if(!mePlayer.blockRender.weapon)
return;var rads=Math.atan2(stage.mouseY-1*stage.y-mePlayer.blockRender.y-mePlayer.blockRender.weapon.y,stage.mouseX-1*stage.x-mePlayer.blockRender.x+mePlayer.blockRender.weapon.x);var angle=rads*(180 / Math.PI);mePlayer.blockRender.PlayerO.scaleX=(stage.mouseX-1*stage.x)>mePlayer.blockRender.x?1:-1;mePlayer.blockRender.weapon.scaleY=Math.abs(angle)>90?-2:2;mePlayer.blockRender.weapon.rotation=angle;};var entityMap={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'};function escapeHtml(string){return String(string).replace(/[&<>"'`=\/]/g,function(s){return entityMap[s];});}
$(document).ready(function(){if(window.StatusBar)window.StatusBar.hide();queue.loadManifest([{id:"bg",src:"client/assets/img/bg_1_1.png"},{id:"explosion",src:"client/assets/img/explosion.png"},{id:"player",src:"client/assets/img/playeranimation2.png"},{id:"grenadelauncher",src:"client/assets/img/grenadelauncher.png"},{id:"playerInfo",src:"client/assets/img/playerInfo.png"},{id:"brick",src:"client/assets/img/bricks.jpg"},{id:"blood",src:"client/assets/img/blood.png"}]);queue.on("complete",handleComplete,this);function handleComplete(){stage=new Stage();socketObject=new Communication(Eventcallback,OnOpen);$("#chatbox").hide();healthLabel=new StatusLabel().create(94,42,"#76B852",137,13,stage);boostLabel=new StatusLabel().create(94,56,"#ffd699",137,13,stage);render=Render.create({element:document.body,engine:engine,options:{width:2500,height:600,showAngleIndicator:true}});collision=new Collision();if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))isMobile=true;if(isMobile){joystick=new VirtualJoystick({mouseSupport:true,limitStickTravel:true,stickRadius:50,stationaryBase:true,baseX:60,baseY:280,container:document.getElementById("joystick"),});}else{$(window).keydown(function(e){keyboard.keydown(e);});$(window).keyup(function(e){keyboard.keyup(e);});}
mouse=new Mouse();mouse.setMouse(stage,mouseEvent);$("#chatbox").keypress(function(event){if(event.which==13){socketObject.socket.send(JSON.stringify({"10":username+"> "+$("#chatbox").val()}));mePlayer.addStatus("<b>"+username+"> "+escapeHtml($("#chatbox").val())+"<b>");$("#chatbox").val("");$("#chatbox").hide();return false;}});createjs.Ticker.setFPS(65);}});})();