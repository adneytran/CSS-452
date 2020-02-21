"use strict";

function SpriteSource() {
    this.llCorner = null;
    this.lrCorner = null;
    this.tlCorner = null;
    this.trCorner = null;

    this.leftWall = null;
    this.rightWall = null;
    this.topWall = null;
    this.bottomWall = null;

    this.mCamera = null;

    this.minionTexture = null;
    this.consolasTexture = null;
    this.currentTexture = null;
}

gEngine.Core.inheritPrototype(SpriteSource, Scene);

SpriteSource.leftBoundPosition = null;
SpriteSource.rightBoundPosition = null;
SpriteSource.topBoundPosition = null;
SpriteSource.bottomBoundPosition = null;

SpriteSource.prototype.initialize = function () {
    this.mCamera = MainView.gCamera;
    setupCorners.call(this);
    setupBounds.call(this);
    setupTextures.call(this);
};

SpriteSource.prototype.draw = function () {

    this.currentTexture.draw(this.mCamera.getVPMatrix());

    this.leftWall.draw(this.mCamera.getVPMatrix());
    this.rightWall.draw(this.mCamera.getVPMatrix());
    this.topWall.draw(this.mCamera.getVPMatrix());

    this.bottomWall.draw(this.mCamera.getVPMatrix());
    this.llCorner.draw(this.mCamera.getVPMatrix());
    this.lrCorner.draw(this.mCamera.getVPMatrix());
    this.tlCorner.draw(this.mCamera.getVPMatrix());

    this.trCorner.draw(this.mCamera.getVPMatrix());
};

SpriteSource.prototype.update = function () {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Z) && this.currentTexture !== this.minionTexture) {
        this.currentTexture = this.minionTexture;
        setBoundsToMinionTexture.call(this);
    }
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.X) && this.currentTexture !== this.consolasTexture) {
        this.currentTexture = this.consolasTexture;
        setBoundsToConsolasTexture.call(this);
    }
};

function setupBounds() {
    this.leftWall = new Renderable();
    this.rightWall = new Renderable();
    this.topWall = new Renderable();
    this.bottomWall = new Renderable();

    var wallThickness = 0.05;
    var wallLengthX = 6;
    var wallLengthY = 3;
    var wallColor = [0, 0, 0, 1];

    this.leftWall.setColor(wallColor);
    this.rightWall.setColor(wallColor);
    this.topWall.setColor(wallColor);
    this.bottomWall.setColor(wallColor);

    this.leftWall.getXform().setPosition(-3, 0);
    this.rightWall.getXform().setPosition(3, 0);
    this.topWall.getXform().setPosition(0, 1.5);
    this.bottomWall.getXform().setPosition(0, -1.5);

    this.leftWall.getXform().setSize(wallThickness, wallLengthY);
    this.rightWall.getXform().setSize(wallThickness, wallLengthY);
    this.topWall.getXform().setSize(wallLengthX, wallThickness);
    this.bottomWall.getXform().setSize(wallLengthX, wallThickness);

    SpriteSource.leftBoundPosition = -3;
    SpriteSource.rightBoundPosition = 3;
    SpriteSource.topBoundPosition = 1.5;
    SpriteSource.bottomBoundPosition = -1.5;
}

function setupCorners() {
    this.llCorner = new Renderable();
    this.lrCorner = new Renderable();
    this.tlCorner = new Renderable();
    this.trCorner = new Renderable();


    this.llCorner.setColor([.1, .2, .3, 1]);
    this.lrCorner.setColor([.3, .2, .1, 1]);
    this.tlCorner.setColor([.5, .8, .5, 1]);
    this.trCorner.setColor([.2, .2, 1, 1]);

    var cornerSize = 0.2;
    this.llCorner.getXform().setSize(cornerSize, cornerSize);
    this.lrCorner.getXform().setSize(cornerSize, cornerSize);
    this.tlCorner.getXform().setSize(cornerSize, cornerSize);
    this.trCorner.getXform().setSize(cornerSize, cornerSize);

    this.llCorner.getXform().setPosition(-3, -1.5);
    this.lrCorner.getXform().setPosition(3, -1.5);
    this.tlCorner.getXform().setPosition(-3, 1.5);
    this.trCorner.getXform().setPosition(3, 1.5);
}

function setupTextures() {
    var minionTexturePath = "assets/minion_sprite.png";
    var consolasTexturePath = "assets/Consolas-72.png"
    gEngine.Textures.loadTexture(minionTexturePath);
    gEngine.Textures.loadTexture(consolasTexturePath);
    this.minionTexture = new TextureRenderable(minionTexturePath);
    this.consolasTexture = new TextureRenderable(consolasTexturePath);
    this.minionTexture.getXform().setSize(6, 3);
    this.consolasTexture.getXform().setSize(6,6);


    this.currentTexture = this.minionTexture;
}

function setBoundsToMinionTexture() {
    this.topWall.getXform().setPosition(0, 1.5);
    this.bottomWall.getXform().setPosition(0, -1.5);
    this.leftWall.getXform().setSize(0.05, 3);
    this.rightWall.getXform().setSize(0.05, 3);

    this.llCorner.getXform().setPosition(-3, -1.5);
    this.lrCorner.getXform().setPosition(3, -1.5);
    this.tlCorner.getXform().setPosition(-3, 1.5);
    this.trCorner.getXform().setPosition(3, 1.5);

    SpriteSource.leftBoundPosition = -3;
    SpriteSource.rightBoundPosition = 3;
    SpriteSource.topBoundPosition = 1.5;
    SpriteSource.bottomBoundPosition = -1.5;
}

function setBoundsToConsolasTexture() {
    this.topWall.getXform().setPosition(0, 3);
    this.bottomWall.getXform().setPosition(0, -3);
    this.leftWall.getXform().setSize(0.05, 6);
    this.rightWall.getXform().setSize(0.05, 6);

    this.llCorner.getXform().setPosition(-3, -3);
    this.lrCorner.getXform().setPosition(3, -3);
    this.tlCorner.getXform().setPosition(-3, 3);
    this.trCorner.getXform().setPosition(3, 3);

    SpriteSource.leftBoundPosition = -3;
    SpriteSource.rightBoundPosition = 3;
    SpriteSource.topBoundPosition = 3;
    SpriteSource.bottomBoundPosition = -3;
}