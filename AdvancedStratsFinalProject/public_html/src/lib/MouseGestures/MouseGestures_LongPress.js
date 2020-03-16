"use strict";

MouseGestures.LongPress = (function () {
    var myCountDownTimer = 0;
    var longPressDuration = 100;
    var longPressAchieved = false;
    var myKey = gEngine.Input.mouseButton.Left;

    var _timerShouldStart = function () {
        return gEngine.Input.isButtonClicked(myKey) && myCountDownTimer === 0;
    };

    var _checkIfButtonHeld = function () {
        if (myCountDownTimer > 0 && gEngine.Input.isButtonPressed(myKey)) {
            myCountDownTimer--;
            if (myCountDownTimer === 0) {
                longPressAchieved = true;
            }
        }
    };

    var checkForLongPress = function (aCallback) {
        if (_timerShouldStart()) {
            myCountDownTimer = longPressDuration;
        }
        _checkIfButtonHeld();

        if (myCountDownTimer === 0 && gEngine.Input.isButtonPressed(myKey) && longPressAchieved) {
            if (aCallback) {
                aCallback();
            }
            longPressAchieved = false;
        }
    };

    var setLongPressDuration = function (aDuration) {
        longPressDuration = aDuration;
    };

    var setKeybind = function(aKey) {
        myKey = aKey;
    };

    return {
        checkForLongPress: checkForLongPress,
        setLongPressDuration: setLongPressDuration,
        setKeybind: setKeybind
    };
})();
