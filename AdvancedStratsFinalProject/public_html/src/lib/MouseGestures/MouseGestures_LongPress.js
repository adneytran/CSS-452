"use strict";

MouseGestures.LongPress = (function () {
    var myCountDownTimer = 0;
    var longPressDuration = 100;
    var longPressAchieved = false;

    var setLongPressDuration = function (aDuration) {
        longPressDuration = aDuration;
    };

    var _timerShouldStart = function () {
        return gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && myCountDownTimer === 0;
    };

    var _checkIfButtonHeld = function () {
        if (myCountDownTimer > 0 && gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left)) {
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

        if (myCountDownTimer === 0 && gEngine.Input.isButtonPressed(gEngine.Input.mouseButton.Left) && longPressAchieved) {
            if (aCallback) {
                aCallback();
            }
            longPressAchieved = false;
        }
    };
    return {
        setLongPressDuration: setLongPressDuration,
        checkForLongPress: checkForLongPress
    };
})();
