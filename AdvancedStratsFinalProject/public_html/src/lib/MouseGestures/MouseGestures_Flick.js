"use strict";

MouseGestures.Flick = (function () {
    var distance = null;
    var direction = null;
    var time = 0;
    var startingPosition = null;
    var isFlicked = false;
    var myFlickKey = gEngine.Input.mouseButton.Left;


    var _checkForInitialClick = function () {
        if (gEngine.Input.isButtonClicked(myFlickKey)) {
            distance = 0;
            direction = [0, 0];
            time = 0;
            startingPosition = [myCamera.mouseWCX(), myCamera.mouseWCY()];
            isFlicked = false;
        }
    };

    var _checkIfMouseHeld = function () {
        if (gEngine.Input.isButtonPressed(myFlickKey)) {
            time += gEngine.GameLoop.getUpdateIntervalInSeconds();
        }
    };

    var _checkForMouseRelease = function () {
        if (gEngine.Input.isButtonReleased(myFlickKey)) {
            var endingPosition = [myCamera.mouseWCX(), myCamera.mouseWCY()];
            distance = _getDistance(endingPosition);
            direction = _getDirection(endingPosition);
            isFlicked = true;
        }
    };

    var _getDistance = function (endingPosition) {
        return Math.abs(Math.sqrt(
            Math.pow(endingPosition[0] - startingPosition[0], 2) +
            Math.pow(endingPosition[1] - startingPosition[1], 2)));
    };

    var _getDirection = function (endingPosition) {
        return [(endingPosition[0] - startingPosition[0]) / distance,
            (endingPosition[1] - startingPosition[1]) / distance];
    };

    var checkForFlick = function () {
        _checkForInitialClick();
        _checkIfMouseHeld();
        _checkForMouseRelease();
    };

    var getDirection = function() {
        return direction;
    };

    var getSpeed = function () {
        if (time !== 0) {
            return distance / time;
        }
    };

    var hasBeenFlicked = function () {
        return isFlicked;
    };

    var setKeybind = function(aKey) {
        myFlickKey = aKey;
    };

    return {
        checkForFlick: checkForFlick,
        getFlickDirection: getDirection,
        getFlickSpeed: getSpeed,
        hasBeenFlicked: hasBeenFlicked,
        setKeybind: setKeybind
    };
})();