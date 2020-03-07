"use strict";

var canReflectLeft = true;
var canReflectRight = true;
var canReflectTop = true;
var canReflectBottom = true;

Patrol.prototype.checkWorldBoundCollision = function () {
    this.checkWorldBoundCollisionTop();
    this.checkWorldBoundCollisionBottom();
    this.checkWorldBoundCollisionLeft();
    this.checkWorldBoundCollisionRight();
};

Patrol.prototype.checkWorldBoundCollisionTop = function () {
    var topBoundPosition = this.boundingBox.maxY();
    if (topBoundPosition >= MyGame.mMainCamera.getWCHeight() / 2 + 30 && canReflectTop) {
        this.normalizedDirection[1] = -this.normalizedDirection[1];
        canReflectLeft = true;
        canReflectRight = true;
        canReflectTop = false;
        canReflectBottom = true;
    }
};

Patrol.prototype.checkWorldBoundCollisionBottom = function () {
    var bottomBoundPosition = this.boundingBox.minY();
    if (bottomBoundPosition <= 30 - MyGame.mMainCamera.getWCHeight() / 2 && canReflectBottom) {
        this.normalizedDirection[1] = -this.normalizedDirection[1];
        canReflectLeft = true;
        canReflectRight = true;
        canReflectTop = true;
        canReflectBottom = false;
    }
};

Patrol.prototype.checkWorldBoundCollisionLeft = function () {
    var leftBoundPosition = this.boundingBox.minX();
    if (leftBoundPosition <= 30 -  MyGame.mMainCamera.getWCWidth() / 2 && canReflectLeft) {
        this.normalizedDirection[0] = -this.normalizedDirection[0];
        canReflectLeft = false;
        canReflectRight = true;
        canReflectTop = true;
        canReflectBottom = true;
    }
};

Patrol.prototype.checkWorldBoundCollisionRight = function () {
    var rightBoundPosition = this.boundingBox.maxX();
    if (rightBoundPosition >= MyGame.mMainCamera.getWCWidth() / 2 + 30 && canReflectRight) {
        this.normalizedDirection[0] = -this.normalizedDirection[0];
        canReflectLeft = true;
        canReflectRight = false;
        canReflectTop = true;
        canReflectBottom = true;
    }
};