"use strict";

var MouseGestures = (function () {
    var myCamera = null;

    var setCamera = function (aCamera) {
        myCamera = aCamera;
    };
    return {setCamera: setCamera};
})();
