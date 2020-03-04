/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

function Hero() {
    this.heroSprite = null;
    this.delta = null;
    this.dyePack = null;
    this.kSpriteSheet = "assets/SpriteSheet.png";
    this.oscillate = false;
    this.frameCounter = 0;
    this.speed = 0.05;
    
    gEngine.Textures.loadTexture(this.kSpriteSheet);
}

Hero.prototype.initialize = function () {
    this.heroSprite = new SpriteRenderable(this.kSpriteSheet);
    this.frameCounter = 60;
    var texWidth = this.heroSprite.mTexWidth;
    var texHeight = this.heroSprite.mTexHeight;
    this.heroSprite.getXform().setSize(9, 12);
    this.heroSprite.getXform().setPosition(30, 30);
    this.heroSprite.setElementUVCoordinate(5 / texWidth, 125 / texWidth, 0 / texHeight, 180 / texHeight);
};

Hero.prototype.draw = function () {
    this.heroSprite.draw(MyGame.mMainCamera);
    if (this.dyePack !== null)
    {
        this.dyePack.draw();
    }
};

Hero.prototype.update = function () {
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
        var direction = this.getNormalizedDirection();
        this.heroSprite.getXform().incXPosBy(direction[0] * this.speed);
        this.heroSprite.getXform().incYPosBy(direction[1] * this.speed);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space))
    {
        console.log("Space");
        this.dyePack = new DyePack();
        this.dyePack.initialize(this.heroSprite.getXform().getXPos(), this.heroSprite.getXform().getYPos());
    }
};

Hero.prototype.getNormalizedDirection = function () {
    var heroX = this.heroSprite.getXform().getXPos();
    var heroY = this.heroSprite.getXform().getYPos();
    var mouseX = MyGame.mMainCamera.mouseWCX();
    var mouseY = MyGame.mMainCamera.mouseWCY();
    var direction = [mouseX - heroX, mouseY - heroY];
    var mag = Math.sqrt(Math.pow(direction[0], 2) + Math.pow(direction[1], 2));
    return [direction[0] / mag, direction[1] / mag];
};

