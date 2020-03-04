/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function DyePack() {
    this.dyePackSprite = null;
    this.delta = null;
    this.kSpriteSheet = "assets/SpriteSheet.png";
    this.oscillate = false;
    this.frameCounter = 0;
    this.speed = 0.05;
    
    gEngine.Textures.loadTexture(this.kSpriteSheet);
}

DyePack.prototype.initialize = function (heroPositionX, heroPositionY) {
    this.dyePackSprite = new SpriteRenderable(this.kSpriteSheet);
    this.frameCounter = 60;
    var texWidth = this.dyePackSprite.mTexWidth;
    var texHeight = this.dyePackSprite.mTexHeight;
    this.dyePackSprite.getXform().setSize(2, 3.25);
    this.dyePackSprite.getXform().setRotationInDegree(90);
    this.dyePackSprite.getXform().setPosition(heroPositionX, heroPositionY);
    this.dyePackSprite.setElementUVCoordinate(500 / texWidth, 597 / texWidth, 22 / texHeight, 162 / texHeight);
};

DyePack.prototype.draw = function () {
    this.dyePackSprite.draw(MyGame.mMainCamera);
};

DyePack.prototype.update = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q) || this.oscillate === true)
    {
        if (this.frameCounter > 0)
        {
            this.oscillate = true;
            this.frameCounter--;
        }
        else
        {
            this.oscillate = false;
            this.frameCounter = 60;
        }
    }
    if (MyGame.mMainCamera.isMouseInViewport())
    {
        var x = MyGame.mMainCamera.mouseWCX();
        var y = MyGame.mMainCamera.mouseWCY();
        //this.textureRenderable.getXform().setPosition(x, y);
        var direction = this.getNormalizedDirection();
        this.dyePackSprite.getXform().incXPosBy(direction[0] * this.speed);
        this.dyePackSprite.getXform().incYPosBy(direction[1] * this.speed);
    }
};