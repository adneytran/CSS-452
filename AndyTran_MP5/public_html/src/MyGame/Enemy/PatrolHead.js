/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function PatrolHead(aSpriteTexture, aStartingPosition) {
    this.headSprite = new SpriteRenderable(aSpriteTexture);
    this.headSprite.getXform().setPosition(aStartingPosition[0], aStartingPosition[1]);
    this.setupSprite();
    GameObject.call(this, this.headSprite);
}

gEngine.Core.inheritPrototype(PatrolHead, GameObject);

PatrolHead.prototype.setupSprite = function () {

    this.headSprite.getXform().setSize(7.5, 7.5);
    var texWidth = this.headSprite.mTexWidth;
    var texHeight = this.headSprite.mTexHeight;
    this.headSprite.setElementUVCoordinate(130 / texWidth, 310 / texWidth, 0 / texHeight, 180 / texHeight);
    var patrolColor = [1, 1, 1, 0];
    this.headSprite.setColor(patrolColor);
};


