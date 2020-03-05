/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function Patrol() {
    this.head = null;
    this.wingOne = null;
    this.wingTwo = null;
    this.headSize = null;
    this.wingSize = null;
    this.kSpriteSheet = "assets/SpriteSheet.png";
    this.normalizedDirection = [];
    this.randomSpeed = 0;
    this.oldHeadPos = [];
    this.interpolationWingOneX = null;
    this.interpolationWingOneY = null;
    this.interpolationWingTwoX = null;
    this.interpolationWingTwoY = null;
    gEngine.Textures.loadTexture(this.kSpriteSheet);
}

Patrol.prototype.initialize = function () {
    this.headSize = [7.5, 7.5];
    this.wingSize = [10, 8];
    
    var cameraPos = MyGame.mMainCamera.getWCCenter();
    var cameraWidth = MyGame.mMainCamera.getWCWidth();
    
    var randomSpawnPosX = Math.random() * ((cameraPos[0] + cameraWidth / 2) - cameraPos[0]) + cameraPos[0];
    var randomSpawnPosY = Math.random() * ((cameraPos[1] + cameraWidth * 3 / 4 / 4) - (cameraPos[1] - cameraWidth * 3 / 4 / 4)) + (cameraPos[1] - cameraWidth * 3 / 4 / 4);
    
    this.head = new SpriteRenderable(this.kSpriteSheet);
    this.wingOne = new SpriteAnimateRenderable(this.kSpriteSheet);
    this.wingTwo = new SpriteAnimateRenderable(this.kSpriteSheet);
    
    var texWidth = this.head.mTexWidth;
    var texHeight = this.head.mTexHeight;
    this.head.getXform().setSize(this.headSize[0], this.headSize[1]);
    this.head.getXform().setPosition(randomSpawnPosX, randomSpawnPosY);
    this.head.setElementUVCoordinate(130 / texWidth, 310 / texWidth, 0 / texHeight, 180 / texHeight);
    
    this.wingOne.getXform().setSize(this.wingSize[0], this.wingSize[1]);
    this.wingOne.getXform().setPosition(randomSpawnPosX + 10, randomSpawnPosY + 6);
    this.wingOne.setElementUVCoordinate(0 / texWidth, 204 / texWidth, 184 / texHeight, 348 / texHeight);
    
    this.wingTwo.getXform().setSize(this.wingSize[0], this.wingSize[1]);
    this.wingTwo.getXform().setPosition(randomSpawnPosX + 10, randomSpawnPosY - 6);
    this.wingTwo.setElementUVCoordinate(0 / texWidth, 204 / texWidth, 348 / texHeight, 512 / texHeight);
    
    var patrolColor = [1, 1, 1, 0];
    this.head.setColor(patrolColor);
    this.wingOne.setColor(patrolColor);
    this.wingTwo.setColor(patrolColor);
    
    
    var randomPosX = Math.random() * ((cameraPos[0] + cameraWidth / 2) - (cameraPos[0] - (cameraWidth / 2))) + (cameraPos[0] - (cameraWidth / 2));
    var randomPosY = Math.random() * ((cameraPos[1] + cameraWidth * 3 / 4 / 2) - (cameraPos[1] - (cameraWidth * 3 / 4 / 2))) + (cameraPos[1] - (cameraWidth * 3 / 4 / 2));
    
    
    
    this.oldHeadPos = [this.head.getXform().getPosition()[0], this.head.getXform().getPosition()[1]];
    
    this.randomSpeed = Math.random() * (10 - 5) + 5;
    
    var direction = [randomPosX - this.oldHeadPos[0], randomPosY - this.oldHeadPos[1]];
    var mag = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
    this.normalizedDirection = [direction[0] / mag, direction[1] / mag];
    
    this.interpolationWingOneX = new Interpolate(this.wingOne.getXform().getXPos(), 120, 0.05);
    this.interpolationWingOneY = new Interpolate(this.wingOne.getXform().getYPos(), 120, 0.05);
    this.interpolationWingTwoX = new Interpolate(this.wingTwo.getXform().getXPos(), 120, 0.05);
    this.interpolationWingTwoY = new Interpolate(this.wingTwo.getXform().getYPos(), 120, 0.05);
    
    this.wingOne.setSpriteSequence(348, 0, 204, 164, 5, 1);
    this.wingOne.setAnimationSpeed(60);
    
    this.wingTwo.setSpriteSequence(512, 0, 204, 164, 5, 1);
    this.wingTwo.setAnimationSpeed(60);
};

Patrol.prototype.draw = function () {
    this.head.draw(MyGame.mMainCamera);
    this.wingOne.draw(MyGame.mMainCamera);
    this.wingTwo.draw(MyGame.mMainCamera);
};

Patrol.prototype.update = function () {
    this.head.getXform().incXPosBy(this.normalizedDirection[0] * this.randomSpeed / 60);
    this.head.getXform().incYPosBy(this.normalizedDirection[1] * this.randomSpeed / 60);
    this.oldHeadPos = this.head.getXform().getPosition();
    this.wingInterpolation();
    this.wingOne.updateAnimation();
    this.wingTwo.updateAnimation();
    
    if (this.head.getXform().getXPos() - this.head.getXform().getWidth() / 2)
    {
        this.head = null;
        this.wingOne = null;
        this.wingTwo = null;
        return;
    }
    if (this.wingOne.getColor()[3] >= 1.0 || this.wingTwo.getColor()[3] >= 1.0)
    {
        this.head = null;
        this.wingOne = null;
        this.wingTwo = null;
        return;
    }
};

Patrol.prototype.wingInterpolation = function () {
    
    this.interpolationWingOneX.setFinalValue(this.oldHeadPos[0] + 10);
    this.interpolationWingOneX.updateInterpolation();
    this.wingOne.getXform().setXPos(this.interpolationWingOneX.getValue());
    this.interpolationWingOneY.setFinalValue(this.oldHeadPos[1] + 6);
    this.interpolationWingOneY.updateInterpolation();
    this.wingOne.getXform().setYPos(this.interpolationWingOneY.getValue());
    
    this.interpolationWingTwoX.setFinalValue(this.oldHeadPos[0] + 10);
    this.interpolationWingTwoX.updateInterpolation();
    this.wingTwo.getXform().setXPos(this.interpolationWingTwoX.getValue());
    this.interpolationWingTwoY.setFinalValue(this.oldHeadPos[1] - 6);
    this.interpolationWingTwoY.updateInterpolation();
    this.wingTwo.getXform().setYPos(this.interpolationWingTwoY.getValue());
};