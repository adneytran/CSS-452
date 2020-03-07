/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

const size = [9, 12];

function Hero(aSpriteTexture) {
    this.heroSprite = new SpriteRenderable(aSpriteTexture);
    this.heroSprite.getXform().setPosition(30, 30);
    this.heroSprite.getXform().setSize(size[0], size[1]);
    this.heroSprite.setElementPixelPositions(5, 125, 0, 180);
    this.oscillate = false;
    this.interpolateX = new Interpolate(this.heroSprite.getXform().getXPos(), 120, 0.05);
    this.interpolateY = new Interpolate(this.heroSprite.getXform().getYPos(), 120, 0.05);
    this.shake = null;
    GameObject.call(this, this.heroSprite);
}

gEngine.Core.inheritPrototype(Hero, GameObject);

Hero.prototype.update = function () {
    this.inputOscillate();
    this.interpolateToMousePosition();
    this.inputDyePackSpawn();
};

Hero.prototype.setShake = function () {
    if (this.oscillate) {
        return;
    }
    var shakeX = 4.5;
    var shakeY = 6;
    var frequency = 4;
    var duration = 60;
    this.oscillate = true;
    this.shake = new ShakePosition(shakeX, shakeY, frequency, duration);
};

Hero.prototype.checkShake = function () {
    if (this.shake.shakeDone())
    {
        this.heroSprite.getXform().setSize(9, 12);
        this.oscillate = false;
    }
    else
    { 
        var shakeSize = this.shake.getShakeResults();
        this.heroSprite.getXform().setSize(size[0] + shakeSize[0], size[1] + shakeSize[1]);
    }
};

Hero.prototype.inputOscillate = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q))
    {
        this.setShake();
    }
    if (this.oscillate === true)
    {
        this.checkShake();
    }
};

Hero.prototype.interpolateToMousePosition = function () {
    if (MyGame.mMainCamera.isMouseInViewport())
    {
        var x = MyGame.mMainCamera.mouseWCX();
        var y = MyGame.mMainCamera.mouseWCY();

        this.interpolateX.setFinalValue(x);
        this.interpolateX.updateInterpolation();
        this.getXform().setXPos(this.interpolateX.getValue());
        this.interpolateY.setFinalValue(y);
        this.interpolateY.updateInterpolation();
        this.heroSprite.getXform().setYPos(this.interpolateY.getValue());
    }
};

Hero.prototype.inputDyePackSpawn = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        var heroPosition = this.heroSprite.getXform().getPosition();
        var newDyePack = new DyePack(MyGame.kSpriteSheet, heroPosition);
        MyGame.dyePackSet.addToSet(newDyePack);
    }
};
