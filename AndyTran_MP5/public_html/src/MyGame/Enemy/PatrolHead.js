/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function PatrolHead() {
    this.headSprite = null;
    this.kSpriteSheet = "assets/SpriteSheet.png";
    gEngine.Textures.loadTexture(this.kSpriteSheet);
}

gEngine.Core.inheritPrototype(PatrolHead, GameObject);

PatrolHead.prototype.initialize = function (aStartingPoint) {
    this.headSprite = new SpriteRenderable(this.kSpriteSheet);
    this.headSprite.getXform().setPosition(aStartingPoint[0], aStartingPoint[1]);
    this.headSprite.getXform().setSize(7.5, 7.5);
    var texWidth = this.headSprite.mTexWidth;
    var texHeight = this.headSprite.mTexHeight;
    this.headSprite.setElementUVCoordinate(130 / texWidth, 310 / texWidth, 0 / texHeight, 180 / texHeight);
    var patrolColor = [1, 1, 1, 0];
    this.headSprite.setColor(patrolColor);
};


