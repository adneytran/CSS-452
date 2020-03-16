"use strict";

MouseGestures.Drag = (function () {
    const draggableStates = {
        NEUTRAL: "neutral",
        CLICK: "click",
        DRAG: "drag",
        RELEASE: "release"
    };

    var startingDragPosition = [];
    var dragState = draggableStates.NEUTRAL;

    var checkForDraggableState = function (aClickCallback, aDragCallback, aReleaseCallback) {
        if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && dragState === draggableStates.NEUTRAL) {
            dragState = draggableStates.CLICK;
            startingDragPosition = [myCamera.mouseWCX(), myCamera.mouseWCY()];
            if (aClickCallback) {
                aClickCallback()
            }
        }
        if ((gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && dragState === draggableStates.CLICK)
            || dragState === draggableStates.DRAG) {
            dragState = draggableStates.DRAG;
            if (aDragCallback) {
                aDragCallback()
            }
        }
        if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left) && dragState === draggableStates.DRAG) {
            dragState = draggableStates.RELEASE;
            if (aReleaseCallback) {
                aReleaseCallback()
            }
        }
        if (dragState === draggableStates.RELEASE) {
            dragState = draggableStates.NEUTRAL;
        }
    };

    var getStartingDragPosition = function () {
        return startingDragPosition;
    };

    var getDragState = function () {
        return dragState;
    };

    var getDraggableStates = function () {
        return draggableStates;
    };

    return {
        checkForDraggableState: checkForDraggableState,
        getStartingDragPosition: getStartingDragPosition,
        getDragState: getDragState,
        getDraggableStates: getDraggableStates
    }
}());