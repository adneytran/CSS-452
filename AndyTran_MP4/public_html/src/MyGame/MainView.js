"use strict";

function MainView() {
    this.mSpriteSource = null;
    this.mInteractiveBound = null;
    this.toggleFrames = false;
}

MainView.mAnimationFrames = null;

gEngine.Core.inheritPrototype(MainView, Scene);

MainView.gCamera = new Camera(
    vec2.fromValues(0, 0),   // position of the camera
    10,                       // width of camera
    [0, 0, 800, 800]          // viewport (orgX, orgY, width, height)
);

MainView.gCamera.setBackgroundColor([0.85, 0.85, 0.85, 1]);


MainView.prototype.initialize = function () {

    this.mSpriteSource = new SpriteSource();
    this.mSpriteSource.initialize();
    this.mInteractiveBound = new InteractiveBound();
    this.mInteractiveBound.initialize();
};

MainView.prototype.draw = function () {
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    MainView.gCamera.setupViewProjection();
    this.mSpriteSource.draw();
    this.mInteractiveBound.draw();
    if (MainView.mAnimationFrames) {
        for (var i = 0; i < MainView.mAnimationFrames.length; i++) {
            MainView.mAnimationFrames[i].draw();
        }
    }
};

MainView.prototype.update = function () {
    this.mInteractiveBound.update();
    this.mSpriteSource.update();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.toggleFrames = !this.toggleFrames;
    }
    if (this.toggleFrames) {
        this.drawFrames()
    }
    else {
        MainView.mAnimationFrames = null;
    }
};

MainView.prototype.drawFrames = function () {
    MainView.mAnimationFrames = [];
    var masterBoundXform = this.mInteractiveBound.myBound.getXform();
    var xDistance = SpriteSource.rightBoundPosition - masterBoundXform.getXPos() + masterBoundXform.getWidth() / 2;
    var boundWidth = masterBoundXform.getWidth();
    var numberOfAnimationFrames = Math.floor(xDistance / boundWidth) - 1;
    if (numberOfAnimationFrames === 0) {
        MainView.mAnimationFrames = null;
        return;
    }
    for (var i = 0; i < numberOfAnimationFrames; i++) {
        var interactiveBoundCopy = new InteractiveBound();
        interactiveBoundCopy.initialize();
        interactiveBoundCopy.disableMarkers();
        interactiveBoundCopy.myBound.getXform().setSize(masterBoundXform.getWidth(), masterBoundXform.getHeight());
        interactiveBoundCopy.myBound.getXform().setPosition(masterBoundXform.getXPos() + (boundWidth * (i + 1)), masterBoundXform.getYPos());
        MainView.mAnimationFrames[i] = interactiveBoundCopy;
    }
};
