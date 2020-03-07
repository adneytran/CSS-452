/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

function ZoomCam(aCamera) {
    this.camera = null;
    this.ren = null;
    this.activeDuration = 0;
    this.initialize(aCamera);
}

ZoomCam.prototype.initialize = function(aCamera) {
    this.ren = new Renderable();
    this.camera = aCamera;
    this.camera.setBackgroundColor([0.7, 0.7, 0.7, 1]);
    this.ren.getXform().setPosition(30, 30);
    this.ren.setColor([0.1, 0.3, 0.1, 1]);
};

ZoomCam.prototype.draw = function () {
    this.ren.draw(this.camera);
    this.camera.setWCCenter(0, 0);
};

ZoomCam.prototype.update = function(anObject, aDuration) {
    this.camera.update();
    this.camera.panTo(anObject.getXform().getXPos(), anObject.getXform().getYPos());
};

ZoomCam.prototype.trackObjectForDuration = function(anObject, aDuration) {
    this.camera.setWCCenter(0, 0);
};
