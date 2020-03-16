"use strict";

MouseGestures.Drag = (function () {
    const draggableState = {
        NEUTRAL: "neutral",
        CLICK: "click",
        DRAG: "drag",
        RELEASE: "release"
    };

    var startingDragPosition = [];
    var dragState = draggableState.NEUTRAL;
    var myDragKey = gEngine.Input.mouseButton.Left;


    var checkForDrag = function (aClickCallback, aDragCallback, aReleaseCallback) {
        if (gEngine.Input.isButtonClicked(myDragKey) && dragState === draggableState.NEUTRAL) {
            dragState = draggableState.CLICK;
            startingDragPosition = [myCamera.mouseWCX(), myCamera.mouseWCY()];
            if (aClickCallback) {
                aClickCallback()
            }
        }
        if ((gEngine.Input.isButtonPressed(myDragKey) && dragState === draggableState.CLICK)
            || dragState === draggableState.DRAG) {
            dragState = draggableState.DRAG;
            if (aDragCallback) {
                aDragCallback()
            }
        }
        if (gEngine.Input.isButtonReleased(myDragKey) && dragState === draggableState.DRAG) {
            dragState = draggableState.RELEASE;
            if (aReleaseCallback) {
                aReleaseCallback()
            }
        }
        if (dragState === draggableState.RELEASE) {
            dragState = draggableState.NEUTRAL;
        }
    };

    var getStartingDragPosition = function () {
        return startingDragPosition;
    };

    var getDragState = function () {
        return dragState;
    };

    var getDraggableStates = function () {
        return draggableState;
    };

    var setKeybind = function (aKey) {
        myDragKey = aKey;
    };

    return {
        checkForDrag: checkForDrag,
        getStartingDragPosition: getStartingDragPosition,
        getDragState: getDragState,
        getDraggableStates: getDraggableStates,
        setKeybind: setKeybind
    }
}());