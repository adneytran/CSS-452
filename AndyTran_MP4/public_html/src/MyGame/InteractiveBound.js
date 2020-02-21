"use strict";

var boundPath = "assets/Bound.png";

function InteractiveBound() {
    gEngine.Textures.loadTexture(boundPath);
    this.leftMarker = null;
    this.rightMarker = null;
    this.topMarker = null;
    this.bottomMarker = null;
}

InteractiveBound.prototype.initialize = function () {
    this.leftMarker = new Renderable();
    this.rightMarker = new Renderable();
    this.topMarker = new Renderable();
    this.bottomMarker = new Renderable();
    this.myBound = new TextureRenderable(boundPath);

    this.leftMarker.setColor([0.2, 0.5, 0.7, 1]);
    this.rightMarker.setColor([0.6, 0.1, 0.2, 1]);
    this.topMarker.setColor([0.5, 0.8, 0.9, 1]);
    this.bottomMarker.setColor([0.2, 0.1, 0.1, 1]);

    var markerSize = 0.1;
    this.myBound.getXform().setSize(1, 1);
    this.leftMarker.getXform().setSize(markerSize, markerSize);
    this.rightMarker.getXform().setSize(markerSize, markerSize);
    this.topMarker.getXform().setSize(markerSize, markerSize);
    this.bottomMarker.getXform().setSize(markerSize, markerSize);

    this.leftMarker.getXform().setPosition(-0.5, 0);
    this.rightMarker.getXform().setPosition(0.5, 0);
    this.topMarker.getXform().setPosition(0, 0.5);
    this.bottomMarker.getXform().setPosition(0, -0.5);
};

InteractiveBound.prototype.draw = function () {
    if (this.leftMarker) {
        this.leftMarker.draw(MainView.gCamera.getVPMatrix());
    }
    if (this.rightMarker) {
        this.rightMarker.draw(MainView.gCamera.getVPMatrix());
    }
    if (this.topMarker) {
        this.topMarker.draw(MainView.gCamera.getVPMatrix());
    }
    if (this.bottomMarker) {
        this.bottomMarker.draw(MainView.gCamera.getVPMatrix());
    }
    this.myBound.draw(MainView.gCamera.getVPMatrix());
};

InteractiveBound.prototype.update = function () {
    var speed;
    var leftBoundPosition = SpriteSource.leftBoundPosition;
    var rightBoundPosition = SpriteSource.rightBoundPosition;
    var topBoundPosition = SpriteSource.topBoundPosition;
    var bottomBoundPosition = SpriteSource.bottomBoundPosition;

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Space)) {
        speed = 0.0005;
    } else {
        speed = 0.05;
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.W) && this.topMarker.getXform().getYPos() < topBoundPosition) {
        speed = this.refineSpeed(speed, gEngine.Input.keys.W);
        this.moveBoundAndMarkers(0, speed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.A) && this.leftMarker.getXform().getXPos() > leftBoundPosition) {
        speed = this.refineSpeed(speed, gEngine.Input.keys.A);
        this.moveBoundAndMarkers(-speed, 0);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.S) && this.bottomMarker.getXform().getYPos() > bottomBoundPosition) {
        speed = this.refineSpeed(speed, gEngine.Input.keys.S);
        this.moveBoundAndMarkers(0, -speed);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D) && this.rightMarker.getXform().getXPos() < rightBoundPosition) {
        speed = this.refineSpeed(speed, gEngine.Input.keys.D);
        this.moveBoundAndMarkers(speed, 0);
    }

    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Up) && this.topMarker.getXform().getYPos() < topBoundPosition && this.bottomMarker.getXform().getYPos() > bottomBoundPosition) {
        this.scaleBoundVertically(speed);
        this.echoMarkerScaleVertically(speed / 2);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Down) && this.myBound.getXform().getHeight() > 0) {
        this.scaleBoundVertically(-speed);
        this.echoMarkerScaleVertically(-speed / 2);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Right) && this.leftMarker.getXform().getXPos() > leftBoundPosition && this.rightMarker.getXform().getXPos() < rightBoundPosition) {
        this.scaleBoundHorizontally(speed);
        this.echoMarkerScaleHorizontally(speed / 2);
    }
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.Left) && this.myBound.getXform().getWidth() > 0.1) {
        this.scaleBoundHorizontally(-speed);
        this.echoMarkerScaleHorizontally(-speed / 2);
    }
    this.fixScalingErrors();
};

InteractiveBound.prototype.moveBoundAndMarkers = function (x, y) {
    this.myBound.getXform().incXPosBy(x);
    this.myBound.getXform().incYPosBy(y);
    this.leftMarker.getXform().incXPosBy(x);
    this.leftMarker.getXform().incYPosBy(y);
    this.rightMarker.getXform().incXPosBy(x);
    this.rightMarker.getXform().incYPosBy(y);
    this.topMarker.getXform().incXPosBy(x);
    this.topMarker.getXform().incYPosBy(y);
    this.bottomMarker.getXform().incXPosBy(x);
    this.bottomMarker.getXform().incYPosBy(y);
    if (MainView.mAnimationFrames) {
        for (var i = 0; i < MainView.mAnimationFrames.length; i++) {
            MainView.mAnimationFrames[i].myBound.getXform().incXPosBy(x);
            MainView.mAnimationFrames[i].myBound.getXform().incYPosBy(y);
        }
    }
};

InteractiveBound.prototype.scaleBoundHorizontally = function (deltaX) {
    this.myBound.getXform().incWidthBy(deltaX);
    if (MainView.mAnimationFrames) {
        for (var i = 0; i < MainView.mAnimationFrames.length; i++) {
            MainView.mAnimationFrames[i].myBound.getXform().incWidthBy(deltaX);
        }
    }
};

InteractiveBound.prototype.scaleBoundVertically = function (deltaY) {
    this.myBound.getXform().incHeightBy(deltaY);
    if (MainView.mAnimationFrames) {
        for (var i = 0; i < MainView.mAnimationFrames.length; i++) {
            MainView.mAnimationFrames[i].myBound.getXform().incHeightBy(deltaY);
        }
    }
};

InteractiveBound.prototype.echoMarkerScaleVertically = function (deltaY) {
    this.topMarker.getXform().incYPosBy(deltaY);
    this.bottomMarker.getXform().incYPosBy(-deltaY);
};

InteractiveBound.prototype.echoMarkerScaleHorizontally = function (deltaX) {
    this.leftMarker.getXform().incXPosBy(-deltaX);
    this.rightMarker.getXform().incXPosBy(deltaX);
};

InteractiveBound.prototype.refineSpeed = function (speed, keycode) {
    var distanceToTravel = 1000;
    if (keycode === gEngine.Input.keys.W) {
        distanceToTravel = Math.abs(SpriteSource.topBoundPosition - this.topMarker.getXform().getYPos());
    }
    if (keycode === gEngine.Input.keys.A) {
        distanceToTravel = Math.abs(SpriteSource.leftBoundPosition - this.leftMarker.getXform().getXPos());
    }
    if (keycode === gEngine.Input.keys.S) {
        distanceToTravel = Math.abs(SpriteSource.bottomBoundPosition - this.bottomMarker.getXform().getYPos());
    }
    if (keycode === gEngine.Input.keys.D) {
        distanceToTravel = Math.abs(SpriteSource.rightBoundPosition - this.rightMarker.getXform().getXPos());
    }
    if (distanceToTravel < speed) {
        return distanceToTravel;
    } else {
        return speed;
    }
};

InteractiveBound.prototype.fixScalingErrors = function () {
    var boundXform = this.myBound.getXform();
    if (boundXform.getHeight() < 0) {
        boundXform.setHeight(0);
        this.topMarker.getXform().setYPos(boundXform.getYPos());
        this.bottomMarker.getXform().setYPos(boundXform.getYPos());
    }
    if (boundXform.getWidth() < 0) {
        boundXform.setWidth(0);
        this.leftMarker.getXform().setXPos(boundXform.getXPos());
        this.rightMarker.getXform().setXPos(boundXform.getXPos());
    }
};

InteractiveBound.prototype.disableMarkers = function (deltaX) {
    this.leftMarker = null;
    this.rightMarker = null;
    this.topMarker = null;
    this.bottomMarker = null;
};
