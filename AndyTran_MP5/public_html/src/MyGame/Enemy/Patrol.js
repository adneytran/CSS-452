/*jslint node: true, vars: true */

/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function Patrol() {
    this.head = new PatrolHead();
    this.wingOne = new PatrolWing();
    this.wingTwo = new PatrolWing();

    this.normalizedDirection = [];
    this.randomSpeed = 0;
    this.oldHeadPos = [];
}

gEngine.Core.inheritPrototype(Patrol, GameObject);

const WING_TYPE_BOTTOM = "bottomWing";
const WING_TYPE_TOP = "topWing";

Patrol.prototype.initialize = function () {

    var cameraPos = MyGame.mMainCamera.getWCCenter();
    var cameraWidth = MyGame.mMainCamera.getWCWidth();
    var spawnPoint = this.getRandomSpawnPoint(cameraPos, cameraWidth);

    this.head.initialize(spawnPoint);
    this.wingOne.initialize(WING_TYPE_BOTTOM, spawnPoint);
    this.wingTwo.initialize(WING_TYPE_TOP, spawnPoint);

    this.setupRandomDirection(cameraPos, cameraWidth);
    this.randomSpeed = Math.random() * (10 - 5) + 5;
};

Patrol.prototype.draw = function () {
    this.head.headSprite.draw(MyGame.mMainCamera);
    this.wingOne.wingSprite.draw(MyGame.mMainCamera);
    this.wingTwo.wingSprite.draw(MyGame.mMainCamera);
};

Patrol.prototype.update = function () {
    this.wingOne.wingInterpolation(this.oldHeadPos);
    this.wingTwo.wingInterpolation(this.oldHeadPos);
    this.updateHeadPos();
    this.checkTermination();
};

Patrol.prototype.setupRandomDirection = function (cameraPos, cameraWidth) {
    //Get random position for head to move towards
    var randomPosX = Math.random() * ((cameraPos[0] + cameraWidth / 2) - (
        cameraPos[0] - (cameraWidth / 2))) + (cameraPos[0] - (cameraWidth / 2));
    var randomPosY = Math.random() * ((cameraPos[1] + cameraWidth * 3 / 4 / 2)
        - (cameraPos[1] - (cameraWidth * 3 / 4 / 2))) + (cameraPos[1] -
        (cameraWidth * 3 / 4 / 2));

    this.oldHeadPos = [this.head.headSprite.getXform().getPosition()[0],
        this.head.headSprite.getXform().getPosition()[1]];

    //Use random position to get the direction that head should move in
    var direction = [randomPosX - this.oldHeadPos[0], randomPosY - this.oldHeadPos[1]];
    var mag = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
    this.normalizedDirection = [direction[0] / mag, direction[1] / mag];
};

Patrol.prototype.getRandomSpawnPoint = function (cameraPos, cameraWidth) {
    var randomSpawnPosX = Math.random() * ((cameraPos[0] + cameraWidth / 2) - cameraPos[0]) + cameraPos[0];
    var randomSpawnPosY = Math.random() * ((cameraPos[1] + cameraWidth * 3 / 4 / 4) - (cameraPos[1] - cameraWidth * 3 / 4 / 4)) + (cameraPos[1] - cameraWidth * 3 / 4 / 4);
    return [randomSpawnPosX, randomSpawnPosY];
};

Patrol.prototype.updateHeadPos = function () {
    this.head.headSprite.getXform().incXPosBy(this.normalizedDirection[0] * this.randomSpeed / 60);
    this.head.headSprite.getXform().incYPosBy(this.normalizedDirection[1] * this.randomSpeed / 60);
    this.oldHeadPos = this.head.headSprite.getXform().getPosition();
};

Patrol.prototype.checkTermination = function () {
    if ((this.head.headSprite.getXform().getXPos() - this.head.headSprite.getXform().getWidth() / 2)
        >= (MyGame.mMainCamera.getWCCenter() +
            MyGame.mMainCamera.getWCWidth() / 2) || this.wingOne.wingSprite.getColor()[3]
        >= 1.0 || this.wingTwo.wingSprite.getColor()[3] >= 1.0) {
        this.head = null;
        this.wingOne = null;
        this.wingTwo = null;
    }
};



