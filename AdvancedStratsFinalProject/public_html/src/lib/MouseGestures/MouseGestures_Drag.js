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

    var myClickCallback = null;
    var myDragCallback = null;
    var myReleaseCallback = null;

    var configureClickCallback = function (aClickCallback) {
        myClickCallback = aClickCallback;
    };

    var configureDragCallback = function (aDragCallback) {
        myDragCallback = aDragCallback;
    };

    var configureReleaseCallback = function (aReleaseCallback) {
        myReleaseCallback = aReleaseCallback;
    };

    var configureAllCallbacks = function (aClickCallback, aDragCallback, aReleaseCallback) {
        myClickCallback = aClickCallback;
        myDragCallback = aDragCallback;
        myReleaseCallback = aReleaseCallback;
    };

    var checkForDraggableState = function () {
        if (gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && dragState === draggableStates.NEUTRAL) {
            dragState = draggableStates.CLICK;
            startingDragPosition = [myCamera.mouseWCX(), myCamera.mouseWCY()];
            myClickCallback();
        }
        if ((gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && dragState === draggableStates.CLICK)
            || dragState === draggableStates.DRAG) {
            dragState = draggableStates.DRAG;
            myDragCallback();
        }
        if (gEngine.Input.isButtonReleased(gEngine.Input.mouseButton.Left) && dragState === draggableStates.DRAG) {
            dragState = draggableStates.RELEASE;
            myReleaseCallback();
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
        configureClickCallback: configureClickCallback,
        configureDragCallback: configureDragCallback,
        configureReleaseCallback: configureReleaseCallback,
        configureAllCallbacks: configureAllCallbacks,
        checkForDraggableState: checkForDraggableState,
        getStartingDragPosition: getStartingDragPosition,
        getDragState: getDragState,
        getDraggableStates: getDraggableStates
    }
}());