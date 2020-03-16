"use strict";

MouseGestures.DoubleClick = (function () {
    var myCountDownTimer = 0;
    const DOUBLE_CLICK_TIMER = 20;

    var _countDownTimer = function () {
        if (myCountDownTimer > 0) {
            myCountDownTimer--;
        }
    };

    var _timerHasNotBegun = function () {
        return gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && myCountDownTimer === 0;
    };

    var _clickedBeforeTimerRunsOut = function () {
        return gEngine.Input.isButtonClicked(gEngine.Input.mouseButton.Left) && myCountDownTimer > 0;
    };

    var checkForDoubleClick = function (aCallback) {
        if (_clickedBeforeTimerRunsOut()) {
            aCallback();
        }
        if (_timerHasNotBegun()) {
            myCountDownTimer = DOUBLE_CLICK_TIMER;
        }
        _countDownTimer();
    };

    return {
        checkForDoubleClick: checkForDoubleClick
    }
})();