/*jslint node: true, vars: true */

/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function Patrol(aSpriteTexture) {
    var cameraPos = MyGame.mMainCamera.getWCCenter();
    var cameraWidth = MyGame.mMainCamera.getWCWidth();
    var spawnPoint = this.getRandomSpawnPoint(cameraPos, cameraWidth);
    this.head = new PatrolHead(aSpriteTexture, spawnPoint);
    this.bottomWing = new PatrolWing(aSpriteTexture, spawnPoint, WING_TYPE_BOTTOM);
    this.topWing = new PatrolWing(aSpriteTexture, spawnPoint, WING_TYPE_TOP);
    this.setupRandomDirection(cameraPos, cameraWidth);
    this.boundingBox = this.updateBoundingBox();
    this.normalizedDirection = [];
    this.randomSpeed = Math.random() * (10 - 5) + 5;
    this.oldHeadPos = [];
    //GameObject.call(this, this.head);
    this.initialize();
}

//gEngine.Core.inheritPrototype(Patrol, GameObject);

const WING_TYPE_BOTTOM = "bottomWing";
const WING_TYPE_TOP = "topWing";

Patrol.prototype.initialize = function () {
    var cameraPos = MyGame.mMainCamera.getWCCenter();
    var cameraWidth = MyGame.mMainCamera.getWCWidth();
    this.setupRandomDirection(cameraPos, cameraWidth);
    this.randomSpeed = Math.random() * (10 - 5) + 5;
};

Patrol.prototype.draw = function () {
    this.head.draw(MyGame.mMainCamera);
    this.bottomWing.draw(MyGame.mMainCamera);
    this.topWing.draw(MyGame.mMainCamera);
};

Patrol.prototype.update = function () {
    this.bottomWing.wingInterpolation(this.oldHeadPos);
    this.topWing.wingInterpolation(this.oldHeadPos);
    this.head.update();
    this.bottomWing.update();
    this.topWing.update();
    this.updateHeadPos();
    this.checkTermination();
    this.boundingBox = this.updateBoundingBox();
};

Patrol.prototype.setupRandomDirection = function (cameraPos, cameraWidth) {
    //Get random position for head to move towards
    var randomPosX = Math.random() * ((cameraPos[0] + cameraWidth / 2) - (
        cameraPos[0] - (cameraWidth / 2))) + (cameraPos[0] - (cameraWidth / 2));
    var randomPosY = Math.random() * ((cameraPos[1] + cameraWidth * 3 / 4 / 2)
        - (cameraPos[1] - (cameraWidth * 3 / 4 / 2))) + (cameraPos[1] -
        (cameraWidth * 3 / 4 / 2));

    this.oldHeadPos = [this.head.getXform().getPosition()[0],
        this.head.getXform().getPosition()[1]];

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
            MyGame.mMainCamera.getWCWidth() / 2) || this.bottomWing.wingSprite.getColor()[3]
        >= 1.0 || this.topWing.wingSprite.getColor()[3] >= 1.0) {
        this.head = null;
        this.wingOne = null;
        this.wingTwo = null;
    }
};

Patrol.prototype.updateBoundingBox = function () {
    var bottomWingPosition = this.bottomWing.getXform().getPosition();
    var bottomWingSize = this.bottomWing.getXform().getSize();
    var topWingPosition = this.topWing.getXform().getPosition();
    var topWingSize = this.topWing.getXform().getSize();
    var headPosition = this.head.getXform().getPosition();
    var headSize = this.head.getXform().getSize();

    var bottomWingLRCorner = [bottomWingPosition[0] + bottomWingSize[0] / 2, bottomWingPosition[1] - bottomWingSize[1] / 2];
    var headLLCorner = [headPosition[0] - headSize[0] / 2, headPosition[1] - headSize[1] / 2];
    var topWingURCorner = [topWingPosition[0] + topWingSize[0] / 2, topWingPosition[1] + topWingSize[1] / 2];

    var boxLL = [headLLCorner[0], bottomWingLRCorner[1]];
    var boxLR = bottomWingLRCorner;
    var boxHeight = (topWingURCorner[1] - bottomWingLRCorner[1]) * 1.5;
    var boxWidth = boxLR[0] - boxLL[0];
    var centerBoxPosition = [boxLL[0] + boxWidth / 2, boxLL[1] + boxHeight / 2];
    return new BoundingBox(centerBoxPosition, boxWidth, boxHeight);
};



