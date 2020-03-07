/*jslint node: true, vars: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  FontRenderable, SpriteRenderable, LineRenderable,
  GameObject */

const unitsPerSecond = 120;
const framesPerSecond = 60;

function DyePack(aSpriteTexture, aStartingPosition) {
    this.dyePackSprite = new SpriteRenderable(aSpriteTexture);
    this.oscillate = false;
    this.speed = unitsPerSecond / framesPerSecond;
    this.lifespan = 5;
    this.position = null;
    this.shouldBeDestroyed = false;
    this.oscillatePos = [];
    this.setupSpriteTransform(aStartingPosition);
    GameObject.call(this, this.dyePackSprite);
}

gEngine.Core.inheritPrototype(DyePack, GameObject);

DyePack.prototype.draw = function () {
    this.dyePackSprite.draw(MyGame.mMainCamera);
};

DyePack.prototype.update = function () {
    this.checkLifespan();
    this.inputDecelerate();
    this.checkCollision();
};

DyePack.prototype.setupSpriteTransform = function (aStartingPosition) {
    this.dyePackSprite.getXform().setSize(2, 3.25);
    this.dyePackSprite.getXform().setRotationInDegree(90);
    this.dyePackSprite.getXform().setPosition(aStartingPosition[0], aStartingPosition[1]);
    this.position = [aStartingPosition[0], aStartingPosition[1]];
    this.dyePackSprite.setElementPixelPositions(500, 597, 22, 162);
};

DyePack.prototype.checkLifespan = function () {
    var xForm = this.dyePackSprite.getXform();
    if (this.lifespan <= 0)
    {
        this.shouldBeDestroyed = true;
        return;
    }
    this.lifespan -= 1 / framesPerSecond;
    if (this.oscillate === false)
    {
        xForm.incXPosBy(this.speed);
    }
    this.checkBounds.call(this, xForm);
};

DyePack.prototype.checkBounds = function(xForm) {
    if ((xForm.getXPos() >= (MyGame.mMainCamera.getWCWidth() / 2 +
        MyGame.mMainCamera.getWCCenter()[0])) || this.speed <= 0) {
        this.shouldBeDestroyed = true;
    }
};

DyePack.prototype.setShake = function () {
    var shakeX = 4;
    var shakeY = 0.2;
    var frequency = 20;
    var duration = 300;
    this.oscillate = true;
    this.oscillatePos = [this.dyePackSprite.getXform().getXPos(), 
        this.dyePackSprite.getXform().getYPos()];
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
        this.dyePackSprite.getXform().setPosition(this.oscillatePos[0] + 
                shakeSize[0], this.oscillatePos[1] + shakeSize[1]);
    }
};

DyePack.prototype.inputDecelerate = function () {
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D))
    {
        this.speed -= 0.1;
    }
};

DyePack.prototype.checkCollision = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S))
    {
        this.setShake();
    }
    if (this.oscillate === false)
    {
        for (var i = 0; i < MyGame.patrolSet.size(); i++)
        {
            var wcTouchPos = [];
            this.checkPixelTouch(MyGame.patrolSet.getObjectAt(i).head, wcTouchPos);
            this.checkPixelTouch(MyGame.patrolSet.getObjectAt(i).topWing, wcTouchPos);
            this.checkPixelTouch(MyGame.patrolSet.getObjectAt(i).bottomWing, wcTouchPos);
            if (this.oscillate === true)
            {
                break;
            }
        } 
    }
    if (this.oscillate === true)
    {
        this.checkShake();
    }
};

DyePack.prototype.shouldDestroyObject = function() {
    return this.shouldBeDestroyed;
};

DyePack.prototype.checkPixelTouch = function (patrolPart, wcTouchPos)
{
    if (this.pixelTouches(patrolPart, wcTouchPos))
    {
        this.setShake();
        patrolPart.hit();
    }
};