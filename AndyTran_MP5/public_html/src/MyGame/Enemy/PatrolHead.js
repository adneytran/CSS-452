/*jslint node: true, vars: true */

/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function PatrolHead(aSpriteTexture, aStartingPosition) {
    this.headSprite = new SpriteRenderable(aSpriteTexture);
    this.headSprite.getXform().setPosition(aStartingPosition[0], aStartingPosition[1]);
    this.setupSprite();
    GameObject.call(this, this.headSprite);
    this.headBoundingBox = this.getBBox();
}

gEngine.Core.inheritPrototype(PatrolHead, GameObject);

PatrolHead.prototype.setupSprite = function () {

    this.headSprite.getXform().setSize(7.5, 7.5);
    this.headSprite.setElementPixelPositions(130, 310, 0, 180);
    var patrolColor = [1, 1, 1, 0];
    this.headSprite.setColor(patrolColor);
};

PatrolHead.prototype.update = function () {
    this.headBoundingBox = this.getBBox();
};

PatrolHead.prototype.hit = function () {
    this.headSprite.getXform().incXPosBy(5);
};
