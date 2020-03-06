/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function DyePack() {
    this.dyePackSprite = null;
    this.kSpriteSheet = "assets/SpriteSheet.png";
    this.oscillate = false;
    this.speed = 0;
    this.lifespan = 0;
    this.pos = null;
    
    gEngine.Textures.loadTexture(this.kSpriteSheet);
}


const unitsPerSecond = 120;
const framesPerSecond = 60;

DyePack.prototype.initialize = function (heroPositionX, heroPositionY) { 
    this.lifespan = 5;
    this.speed = unitsPerSecond / framesPerSecond;
    this.setupSpriteTransform(heroPositionX, heroPositionY);
};

DyePack.prototype.draw = function () {
    this.dyePackSprite.draw(MyGame.mMainCamera);
};

DyePack.prototype.update = function () {
    this.checkLifespan();
    this.inputCheckShake();
    this.inputDecelerate();
};

DyePack.prototype.setShake = function () {
    var shakeX = 4;
    var shakeY = 0.2;
    var frequency = 20;
    var duration = 300;
    this.oscillate = true;
    this.shake = new ShakePosition(shakeX, shakeY, frequency, duration);
};

DyePack.prototype.checkShake = function () {
    if (this.shake.shakeDone())
    {
        this.oscillate = false;
    }
    else
    {
        var shakeSize = this.shake.getShakeResults();
        this.dyePackSprite.getXform().setPosition(this.pos[0] + shakeSize[0], this.pos[1] + shakeSize[1]);
    }
};

DyePack.prototype.setupSpriteTransform = function (heroPositionX, heroPositionY) {
    this.dyePackSprite = new SpriteRenderable(this.kSpriteSheet);
    var texWidth = this.dyePackSprite.mTexWidth;
    var texHeight = this.dyePackSprite.mTexHeight;
    this.dyePackSprite.getXform().setSize(2, 3.25);
    this.dyePackSprite.getXform().setRotationInDegree(90);
    this.dyePackSprite.getXform().setPosition(heroPositionX, heroPositionY);
    this.pos = [heroPositionX, heroPositionY];
    this.dyePackSprite.setElementUVCoordinate(500 / texWidth, 597 / texWidth, 22 / texHeight, 162 / texHeight);
};

DyePack.prototype.checkLifespan = function () {
    var xForm = this.dyePackSprite.getXform();
    if (this.lifespan <= 0)
    {
        this.dyePackSprite = null;
        return;
    }
    this.lifespan -= 1 / framesPerSecond;
    xForm.incXPosBy(this.speed); //Make sure this line doesnt execute if dye pack is shaking.
    if ((xForm.getXPos() >= (MyGame.mMainCamera.getWCWidth() / 2 + 
            MyGame.mMainCamera.getWCCenter()[0])) || this.speed <= 0)
    {
        this.dyePackSprite = null;
        return;
    }
};

DyePack.prototype.inputCheckShake = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) //Replace this with when dye pack hits patrol.
    {
        this.setShake();
    }
    if (this.oscillate === true)
    {
        this.checkShake();
    }
};

DyePack.prototype.inputDecelerate = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        this.speed -= 0.1;
    }
};
