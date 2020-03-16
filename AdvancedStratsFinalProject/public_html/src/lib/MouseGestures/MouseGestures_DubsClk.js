"use strict";

MouseGestures.DoubleClick = (function () {
    var myCountDownTimer = 0;
    var doubleClickTimer = 20;

    var _countDownTimer = function () {
        if (myCountDownTimer > 0) {
            myCountDownTimer--;
        }
    };

    var _timerShouldStart = function () {
        return gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && myCountDownTimer === 0;
    };

    var _clickedBeforeTimerRunsOut = function () {
        return gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && myCountDownTimer > 0;
    };

    var checkForDoubleClick = function (aCallback) {
        if (_clickedBeforeTimerRunsOut()) {
            if (aCallback) {
            aCallback();
            }
        }
        if (_timerShouldStart()) {
            myCountDownTimer = doubleClickTimer;
        }
        _countDownTimer();
    };

    var setDoubleClickTimer = function (aTime) {
        doubleClickTimer = aTime;
    };

    return {
        checkForDoubleClick: checkForDoubleClick,
        setDoubleClickTimer: setDoubleClickTimer
    }
})();