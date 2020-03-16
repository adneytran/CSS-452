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
    var myKey = gEngine.Input.mouseButton.Left;


    var checkForDraggableState = function (aClickCallback, aDragCallback, aReleaseCallback) {
        if (gEngine.Input.isButtonClicked(myKey) && dragState === draggableStates.NEUTRAL) {
            dragState = draggableStates.CLICK;
            startingDragPosition = [myCamera.mouseWCX(), myCamera.mouseWCY()];
            if (aClickCallback) {
                aClickCallback()
            }
        }
        if ((gEngine.Input.isButtonPressed(myKey) && dragState === draggableStates.CLICK)
            || dragState === draggableStates.DRAG) {
            dragState = draggableStates.DRAG;
            if (aDragCallback) {
                aDragCallback()
            }
        }
        if (gEngine.Input.isButtonReleased(myKey) && dragState === draggableStates.DRAG) {
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

    var setKeybind = function (aKey) {
        myKey = aKey;
    };

    return {
        checkForDraggableState: checkForDraggableState,
        getStartingDragPosition: getStartingDragPosition,
        getDragState: getDragState,
        getDraggableStates: getDraggableStates,
        setKeybind: setKeybind
    }
}());