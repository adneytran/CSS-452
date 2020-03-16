"use strict";

var MouseGestures = (function () {
    const draggableStates = {
        NEUTRAL: "neutral",
        CLICK: "click",
        DRAG: "drag",
        RELEASE: "release"
    };

    var startingDragPosition = [];
    var mCamera = null;
    var dragState = draggableStates.NEUTRAL;

    var setCamera = function(aCamera) {
        mCamera = aCamera;
    };

    var configureDraggableState = function (aContext, aClickCallback) {
        if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && dragState === draggableStates.NEUTRAL) {
            dragState = draggableStates.CLICK;
            startingDragPosition = [mCamera.mouseWCX(), mCamera.mouseWCY()];
            aClickCallback();
        } else if (gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && dragState === draggableStates.CLICK) {
            dragState = draggableStates.DRAG;
        } else if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left) && dragState === draggableStates.DRAG) {
            dragState = draggableStates.RELEASE;
        } else if (dragState === draggableStates.RELEASE) {
            dragState = draggableStates.NEUTRAL;
        }
    };

    var getStartingDragPosition = function() {
        return startingDragPosition;
    };

    var getDragState = function() {
        return dragState;
    };

    var getDraggableStates = function() {
        return draggableStates;
    };

    return {
        setCamera: setCamera,
        configureDraggableState: configureDraggableState,
        getStartingDragPosition: getStartingDragPosition,
        getDragState: getDragState,
        getDraggableStates: getDraggableStates
    }
}());