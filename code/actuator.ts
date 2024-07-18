namespace actuator {
    export interface Actuator {
        actuate(page: game.Page): void;
        listen<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => unknown): void;
        remove<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => unknown): void;
    }
    export class HTMLActuator implements Actuator {
        public static get canvasSelectors(): string {
            return '.main-canvas';
        }
        public static get canvasBoxSelectors(): string {
            return '.canvas-box';
        }
        private _canvas: HTMLCanvasElement;
        private _context: CanvasRenderingContext2D;
        public get canvas(): HTMLCanvasElement {
            return this._canvas;
        }
        public constructor() {
            let canvas = document.querySelector(HTMLActuator.canvasSelectors);
            if (canvas instanceof HTMLCanvasElement) {
                this._canvas = canvas;
            } else {
                throw new error.ElementNotFound(HTMLActuator.canvasSelectors);
            }
            let context = this._canvas.getContext('2d');
            if (context) {
                this._context = context;
            } else {
                throw new error.ArgumentError("getContext('2d')");
            }
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
            let self = this;
            this.listen('resize', function() {
                self._canvas.width = this.innerWidth;
                self._canvas.height = this.innerHeight;
            })
        }
        public listen<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => unknown): void {
            window.addEventListener(type, listener);
        }
        public remove<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => unknown): void {
            window.removeEventListener(type, listener);
        }
        public actuate(page: game.Page): void {
            page.paint(this._context, new util.Size(this._canvas.width, this._canvas.height));
        }
    }
}