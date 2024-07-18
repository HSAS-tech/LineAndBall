"use strict";
var actuator;
(function (actuator) {
    class HTMLActuator {
        static get canvasSelectors() {
            return '.main-canvas';
        }
        static get canvasBoxSelectors() {
            return '.canvas-box';
        }
        get canvas() {
            return this._canvas;
        }
        constructor() {
            let canvas = document.querySelector(HTMLActuator.canvasSelectors);
            if (canvas instanceof HTMLCanvasElement) {
                this._canvas = canvas;
            }
            else {
                throw new error.ElementNotFound(HTMLActuator.canvasSelectors);
            }
            let context = this._canvas.getContext('2d');
            if (context) {
                this._context = context;
            }
            else {
                throw new error.ArgumentError("getContext('2d')");
            }
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            let self = this;
            this.listen('resize', function () {
                self._canvas.width = this.innerWidth;
                self._canvas.height = this.innerHeight;
            });
        }
        listen(type, listener) {
            window.addEventListener(type, listener);
        }
        remove(type, listener) {
            window.removeEventListener(type, listener);
        }
        actuate(page) {
            page.paint(this._context, new util.Size(this._canvas.width, this._canvas.height));
        }
    }
    actuator.HTMLActuator = HTMLActuator;
})(actuator || (actuator = {}));
