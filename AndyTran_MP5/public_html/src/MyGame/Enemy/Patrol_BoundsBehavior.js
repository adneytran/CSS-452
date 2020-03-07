"use strict";

Patrol.prototype.checkWorldBoundCollision = function () {
    this.checkWorldBoundCollisionTop();
    this.checkWorldBoundCollisionBottom();
    this.checkWorldBoundCollisionLeft();
    this.checkWorldBoundCollisionRight();
};

Patrol.prototype.checkWorldBoundCollisionTop = function () {
    var topBoundPosition = this.boundingBox.maxY();
    if (topBoundPosition >= MyGame.mMainCamera.getWCHeight() / 2 + 30 && this.canReflectTop) {
        this.normalizedDirection[1] = -this.normalizedDirection[1];
        this.canReflectLeft = true;
        this.canReflectRight = true;
        this.canReflectTop = false;
        this.canReflectBottom = true;
    }
};

Patrol.prototype.checkWorldBoundCollisionBottom = function () {
    var bottomBoundPosition = this.boundingBox.minY();
    if (bottomBoundPosition <= 30 - MyGame.mMainCamera.getWCHeight() / 2 && this.canReflectBottom) {
        this.normalizedDirection[1] = -this.normalizedDirection[1];
        this.canReflectLeft = true;
        this.canReflectRight = true;
        this.canReflectTop = true;
        this.canReflectBottom = false;
    }
};

Patrol.prototype.checkWorldBoundCollisionLeft = function () {
    var leftBoundPosition = this.boundingBox.minX();
    if (leftBoundPosition <= 30 -  MyGame.mMainCamera.getWCWidth() / 2 && this.canReflectLeft) {
        this.normalizedDirection[0] = -this.normalizedDirection[0];
        this.canReflectLeft = false;
        this.canReflectRight = true;
        this.canReflectTop = true;
        this.canReflectBottom = true;
    }
};

Patrol.prototype.checkWorldBoundCollisionRight = function () {
    var rightBoundPosition = this.boundingBox.maxX();
    if (rightBoundPosition >= MyGame.mMainCamera.getWCWidth() / 2 + 30 && this.canReflectRight) {
        this.normalizedDirection[0] = -this.normalizedDirection[0];
        this.canReflectLeft = true;
        this.canReflectRight = false;
        this.canReflectTop = true;
        this.canReflectBottom = true;
    }
};