"use strict";

const draggableStates = {
    NEUTRAL: "neutral",
    CLICK: "click",
    DRAG: "drag",
    RELEASE: "release"
};

function DragGesture (aCamera) {
    this.lastPos = [];
    this.mCamera = aCamera;
    this.dragState = draggableStates.NEUTRAL;
}

DragGesture.prototype.configureDraggableState = function () {
    if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.NEUTRAL) {
        this.dragState = draggableStates.CLICK;
        this.lastPos = [this.mCamera.mouseWCX(), this.mCamera.mouseWCY()];
        //aDragFunction();
    }
    else if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.CLICK)
    {
        this.dragState = draggableStates.DRAG;
    } else if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left) && this.dragState === draggableStates.DRAG) {
        this.dragState = draggableStates.RELEASE;
        //aReleaseFunction();
        // this.lastPos = null;
    } else if (this.dragState === draggableStates.RELEASE) {
        this.dragState = draggableStates.NEUTRAL;
    }
};