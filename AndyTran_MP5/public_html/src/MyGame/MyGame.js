/*
 * File: MyGame.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function MyGame() {
    this.hero = null;
    this.shouldShowBB = false;

    this.mMsg = null;
    
    this.autoSpawn = true;
    this.spawnTimer = 0;
    
    this.mMsg = null;
}

MyGame.kSpriteSheet = "assets/SpriteSheet.png";

gEngine.Core.inheritPrototype(MyGame, Scene);

MyGame.prototype.loadScene = function () {
    console.log("LoadScene reached");
    gEngine.Textures.loadTexture(MyGame.kSpriteSheet);
};

MyGame.prototype.unloadScene = function () {
    gEngine.Textures.unloadTexture(MyGame.kSpriteSheet);
};

MyGame.dyePackSet = new GameObjectSet();
MyGame.patrolSet = new GameObjectSet();

MyGame.mMainCamera = new Camera(
    vec2.fromValues(30, 30), // position of the camera
    200,                       // width of camera
    [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
);


MyGame.prototype.initialize = function () {
    MyGame.mMainCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.hero = new Hero(MyGame.kSpriteSheet);
    var firstPatrol = new Patrol(MyGame.kSpriteSheet);
    MyGame.patrolSet.addToSet(firstPatrol);
    this.spawnTimer = Math.random() * (3 - 2) + 2;
    
    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(30 - 99, 30 - 72);
    this.mMsg.setTextHeight(3);
};

MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    MyGame.mMainCamera.setupViewProjection();
    this.hero.draw(MyGame.mMainCamera);
    MyGame.dyePackSet.draw(MyGame.mMainCamera);
    MyGame.patrolSet.draw(MyGame.mMainCamera);
    this.drawPatrolBoundingBoxes();
    this.mMsg.draw(MyGame.mMainCamera);
};

MyGame.prototype.update = function () {
    this.hero.update();
    MyGame.dyePackSet.update();
    MyGame.patrolSet.update();
    checkIfDyePacksAreDestroyed();
    checkIfPatrolsAreDestroyed();
    this.checkAutoSpawnInput();
    this.checkForAutoSpawn();
    this.checkPatrolSpawnInput();
    this.inputShouldShowBoundingBoxes();
    this.TEST_heroEntersPatrolBoundingBox();
    this.updateMessage();
};

function checkIfDyePacksAreDestroyed() {
    for (var i = 0; i < MyGame.dyePackSet.size(); i++) {
        if (MyGame.dyePackSet.mSet[i].shouldBeDestroyed) {
            MyGame.dyePackSet.mSet.splice(i, 1);
        }
    }
}

function checkIfPatrolsAreDestroyed() {
    for (var i = 0; i < MyGame.patrolSet.size(); i++) {
        if (MyGame.patrolSet.mSet[i].shouldBeDestroyed) {
            MyGame.patrolSet.mSet.splice(i, 1);
        }
    }
}

MyGame.prototype.checkForAutoSpawn = function () {
    if (this.autoSpawn === true)
    {
        if (this.spawnTimer <= 0)
        {
            var newPatrol = new Patrol(MyGame.kSpriteSheet);
            MyGame.patrolSet.addToSet(newPatrol);
            this.spawnTimer = Math.random() * (3 - 2) + 2;
        }
        else
        {
            this.spawnTimer -= 1 / 60;
        }
    }
};

MyGame.prototype.drawPatrolBoundingBoxes = function () {
    if (this.shouldShowBB) {
        for (var i = 0; i < MyGame.patrolSet.size(); i++) {
            var patrol = MyGame.patrolSet.getObjectAt(i);
            patrol.boundingBox.drawBoundingBox(MyGame.mMainCamera);
            patrol.head.headBoundingBox.drawBoundingBox(MyGame.mMainCamera);
            patrol.bottomWing.wingBoundingBox.drawBoundingBox(MyGame.mMainCamera);
            patrol.topWing.wingBoundingBox.drawBoundingBox(MyGame.mMainCamera);
        }
    }
};

MyGame.prototype.inputShouldShowBoundingBoxes = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        this.shouldShowBB = !this.shouldShowBB;
    }
};

MyGame.prototype.TEST_heroEntersPatrolBoundingBox = function () {
    var heroBox = this.hero.getBBox();
    var h = [];
    /*if (this.hero.pixelTouches(this.patrol.head, h)) {
        console.log("head hit");
    }
    if (this.hero.pixelTouches(this.patrol.bottomWing, h)) {
        console.log("bottom wing hit");
    }
    if (this.hero.pixelTouches(this.patrol.topWing, h)) {
        console.log("top wing hit");
    }
    if (heroBox.intersectsBound(this.patrol.boundingBox)) {
        console.log("hit outer bound");
    }*/
};

MyGame.prototype.checkPatrolSpawnInput = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C))
    {
        var newPatrol = new Patrol(MyGame.kSpriteSheet);
        MyGame.patrolSet.addToSet(newPatrol);
    }
};

MyGame.prototype.checkAutoSpawnInput = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P))
    {
        console.log(this.autoSpawn);
        if (this.autoSpawn === true)
        {
            this.autoSpawn = false;
        }
        else
        {
            this.autoSpawn = true;
            this.spawnTimer = Math.random() * (3 - 2) + 2;
        }
    }
};

MyGame.prototype.updateMessage = function () {
    var msg = "Status: DyePacks(" + MyGame.dyePackSet.size() + ") Patrols(" +
            MyGame.patrolSet.size() + ") AutoSpawn(" + this.autoSpawn + ")";
    this.mMsg.setText(msg);
};