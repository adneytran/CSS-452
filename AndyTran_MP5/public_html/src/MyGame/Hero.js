/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function Hero() {
    this.heroSprite = null;
    this.dyePack = null;
    this.size = [];
    this.kSpriteSheet = "assets/SpriteSheet.png";
    this.oscillate = false;
    this.interpolateX = null;
    this.interpolateY = null;
    this.shake = null;
    gEngine.Textures.loadTexture(this.kSpriteSheet);
}

Hero.prototype.initialize = function () {
    this.size = [9, 12];
    
    this.heroSprite = new SpriteRenderable(this.kSpriteSheet);
    
    var texWidth = this.heroSprite.mTexWidth;
    var texHeight = this.heroSprite.mTexHeight;
    
    this.heroSprite.getXform().setSize(this.size[0], this.size[1]);
    this.heroSprite.getXform().setPosition(30, 30);
    
    this.heroSprite.setElementUVCoordinate(5 / texWidth, 125 / texWidth, 0 / texHeight, 180 / texHeight);
    
    this.interpolateX = new Interpolate(this.heroSprite.getXform().getXPos(), 120, 0.05);
    this.interpolateY = new Interpolate(this.heroSprite.getXform().getYPos(), 120, 0.05);
};

Hero.prototype.draw = function () {
    this.heroSprite.draw(MyGame.mMainCamera);
    if (this.dyePack !== null && this.dyePack.dyePackSprite !== null)
    {
        this.dyePack.draw();
    }
};

Hero.prototype.update = function () {
    this.inputOscillate();
    this.checkInterpolate();
    this.checkDyePackSpawn();
};

/*Hero.prototype.getNormalizedDirection = function () {
    var heroX = this.heroSprite.getXform().getXPos();
    var heroY = this.heroSprite.getXform().getYPos();
    var mouseX = MyGame.mMainCamera.mouseWCX();
    var mouseY = MyGame.mMainCamera.mouseWCY();
    var direction = [mouseX - heroX, mouseY - heroY];
    var mag = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
    return [direction[0] / mag, direction[1] / mag];
};*/

Hero.prototype.setShake = function () {
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
        this.heroSprite.getXform().setSize(this.size[0] + shakeSize[0], this.size[1] + shakeSize[1]);
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

Hero.prototype.checkInterpolate = function () {
    if (MyGame.mMainCamera.isMouseInViewport())
    {
        var x = MyGame.mMainCamera.mouseWCX();
        var y = MyGame.mMainCamera.mouseWCY();
        this.interpolateX.setFinalValue(x);
        this.interpolateX.updateInterpolation();
        this.heroSprite.getXform().setXPos(this.interpolateX.getValue());
        this.interpolateY.setFinalValue(y);
        this.interpolateY.updateInterpolation();
        this.heroSprite.getXform().setYPos(this.interpolateY.getValue());
    }
};

Hero.prototype.checkDyePackSpawn = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        this.dyePack = new DyePack();
        this.dyePack.initialize(this.heroSprite.getXform().getXPos(), this.heroSprite.getXform().getYPos());
    }
    if (this.dyePack !== null && this.dyePack.dyePackSprite !== null)
    {
        this.dyePack.update();
    }
};
