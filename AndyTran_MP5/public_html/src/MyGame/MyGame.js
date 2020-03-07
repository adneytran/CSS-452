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
    MyGame.patrolSet.addToSet(new Patrol(MyGame.kSpriteSheet));
    MyGame.patrolSet.addToSet(new Patrol(MyGame.kSpriteSheet));
    MyGame.patrolSet.addToSet(new Patrol(MyGame.kSpriteSheet));
    MyGame.patrolSet.addToSet(new Patrol(MyGame.kSpriteSheet));
    MyGame.patrolSet.addToSet(new Patrol(MyGame.kSpriteSheet));
};

MyGame.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    MyGame.mMainCamera.setupViewProjection();
    this.hero.draw(MyGame.mMainCamera);
    MyGame.dyePackSet.draw(MyGame.mMainCamera);
    MyGame.patrolSet.draw(MyGame.mMainCamera);
    this.drawPatrolBoundingBoxes();
};

MyGame.prototype.update = function () {
    this.hero.update();
    MyGame.dyePackSet.update();
    MyGame.patrolSet.update();
    checkIfDyePacksAreDestroyed();
    this.inputShouldShowBoundingBoxes();
    this.TEST_heroEntersPatrolBoundingBox();
};

function checkIfDyePacksAreDestroyed() {
    for (var i = 0; i < MyGame.dyePackSet.size(); i++) {
        if (MyGame.dyePackSet.mSet[i].shouldBeDestroyed) {
            MyGame.dyePackSet.mSet.splice(i, 1);
        }
    }
}

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
    // var heroBox = this.hero.getBBox();
    // var h = [];
    // if (this.hero.pixelTouches(this.patrol.head, h)) {
    //     console.log("head hit");
    // }
    // if (this.hero.pixelTouches(this.patrol.bottomWing, h)) {
    //     console.log("bottom wing hit");
    // }
    // if (this.hero.pixelTouches(this.patrol.topWing, h)) {
    //     console.log("top wing hit");
    // }
    // if (heroBox.intersectsBound(this.patrol.boundingBox)) {
    //     console.log("hit outer bound");
    // }
};