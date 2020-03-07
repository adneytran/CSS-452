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
    this.heroZoomCamera = null;
    this.dyePackZoomCamera1 = null;
    this.dyePackZoomCamera2 = null;
    this.dyePackZoomCamera3 = null;

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
    [0, 0, 800, 600],           // viewport (orgX, orgY, width, height)
);

MyGame.mMainCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);

MyGame.prototype.initialize = function () {
    this.hero = new Hero(MyGame.kSpriteSheet);
    var firstPatrol = new Patrol(MyGame.kSpriteSheet);
    MyGame.patrolSet.addToSet(firstPatrol);
    this.spawnTimer = Math.random() * (3 - 2) + 2;

    this.mMsg = new FontRenderable("Status Message");
    this.mMsg.setColor([0, 0, 0, 1]);
    this.mMsg.getXform().setPosition(30 - 99, 30 - 72);
    this.mMsg.setTextHeight(3);

    this.heroZoomCamera = new Camera(
        vec2.fromValues(30, 30), // position of the camera
        20,                       // width of camera
        [0, 600, 200, 200],       // viewport (orgX, orgY, width, height)
        2);
    this.heroZoomCamera.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.heroZoomCamera.configInterpolation(0.7, 10);

    this.dyePackZoomCamera1 = new Camera(
        vec2.fromValues(30, 30), // position of the camera
        20,                       // width of camera
        [200, 600, 200, 200],       // viewport (orgX, orgY, width, height)
        2);

    this.dyePackZoomCamera2 = new Camera(
        vec2.fromValues(30, 30), // position of the camera
        20,                       // width of camera
        [400, 600, 200, 200],       // viewport (orgX, orgY, width, height)
        2);

    this.dyePackZoomCamera3 = new Camera(
        vec2.fromValues(30, 30), // position of the camera
        20,                       // width of camera
        [600, 600, 200, 200],       // viewport (orgX, orgY, width, height)
        2);
};

MyGame.prototype.drawCamera = function (aCamera) {
    aCamera.setupViewProjection();
    this.hero.draw(aCamera);
    MyGame.dyePackSet.draw(aCamera);
    MyGame.patrolSet.draw(aCamera);
    this.drawPatrolBoundingBoxes(aCamera);
};

MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    this.drawCamera(MyGame.mMainCamera);
    this.mMsg.draw(MyGame.mMainCamera);
    if (this.hero.oscillate) {
        this.drawCamera(this.heroZoomCamera);
    }

};


MyGame.prototype.update = function () {
    MyGame.mMainCamera.update();
    this.heroZoomCamera.update();

    this.hero.update();
    MyGame.dyePackSet.update();
    MyGame.patrolSet.update();

    this.heroZoomCamera.panTo(this.hero.getXform().getXPos(), this.hero.getXform().getYPos());

    checkIfDyePacksAreDestroyed();
    checkIfPatrolsAreDestroyed();
    this.dyePackEntersPatrolBound();
    this.checkAutoSpawnInput();
    this.checkPatrolSpawnInput();
    this.inputShouldShowBoundingBoxes();
    this.checkForAutoSpawn();
    this.heroEntersPatrolBoundingBox();
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
    if (this.autoSpawn === true) {
        if (this.spawnTimer <= 0) {
            var newPatrol = new Patrol(MyGame.kSpriteSheet);
            MyGame.patrolSet.addToSet(newPatrol);
            this.spawnTimer = Math.random() * (3 - 2) + 2;
        } else {
            this.spawnTimer -= 1 / 60;
        }
    }
};

MyGame.prototype.drawPatrolBoundingBoxes = function (aCamera) {
    if (this.shouldShowBB) {
        for (var i = 0; i < MyGame.patrolSet.size(); i++) {
            var patrol = MyGame.patrolSet.getObjectAt(i);
            patrol.boundingBox.drawBoundingBox(aCamera);
            patrol.head.headBoundingBox.drawBoundingBox(aCamera);
            patrol.bottomWing.wingBoundingBox.drawBoundingBox(aCamera);
            patrol.topWing.wingBoundingBox.drawBoundingBox(aCamera);
        }
    }
};

MyGame.prototype.inputShouldShowBoundingBoxes = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        this.shouldShowBB = !this.shouldShowBB;
    }
};

MyGame.prototype.heroEntersPatrolBoundingBox = function () {
    var heroBox = this.hero.getBBox();

    for (var i = 0; i < MyGame.patrolSet.size(); i++) {
        var headBox = MyGame.patrolSet.getObjectAt(i).head.headBoundingBox;
        if (heroBox.intersectsBound(headBox)) {
            this.hero.setShake();
        }
    }

};

MyGame.prototype.dyePackEntersPatrolBound = function () {
    for (var i = 0; i < MyGame.dyePackSet.size(); i++) {
        for (var j = 0; j < MyGame.patrolSet.size(); j++) {
            var dyePackBox = MyGame.dyePackSet.getObjectAt(i).getBBox();
            var patrolBox = MyGame.patrolSet.getObjectAt(j).boundingBox;
            if (dyePackBox.intersectsBound(patrolBox)) {
                MyGame.dyePackSet.getObjectAt(i).decelerate();
            }
        }
    }
}

MyGame.prototype.checkPatrolSpawnInput = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        var newPatrol = new Patrol(MyGame.kSpriteSheet);
        MyGame.patrolSet.addToSet(newPatrol);
    }
};

MyGame.prototype.checkAutoSpawnInput = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        console.log(this.autoSpawn);
        if (this.autoSpawn === true) {
            this.autoSpawn = false;
        } else {
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