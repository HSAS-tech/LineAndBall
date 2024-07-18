namespace game {
    /**
     * 组件的可绘制接口
     */
    export interface Drawable {
        /**
         * 绘制组件自身所有内容，将其显示在屏幕上
         * @param context 绘制上下文
         * @param size 可绘制的区域大小
         */
        paint(context: CanvasRenderingContext2D, size: util.Size): void;
        /**
         * 绘制组件自身的背景，将其显示在屏幕上
         * @param context 绘制上下文
         * @param size 可绘制的区域大小
         */
        paintBackground(context: CanvasRenderingContext2D, size: util.Size): void;
        /**
         * 绘制组件自身的前景，将其显示在屏幕上
         * @param context 绘制上下文
         * @param size 可绘制的区域大小
         */
        paintComponent(context: CanvasRenderingContext2D, size: util.Size): void;
    }
    export interface GameUpdatable {
        update(game: Game): void;
    }
    export interface LevelUpdatable {
        update(level: Level): void;
    }
    export interface Disposable {
        dispose(): void;
    }
    export interface Particle {
        position: util.Point;
        speed: util.Vector;
    }
    export class Ball implements Drawable, LevelUpdatable, Disposable {
        /**
         * 球的位置坐标
         */
        public position: util.Point;
        /**
         * 球的速度向量
         */
        public speed: util.Vector;
        private _line: Line | null = null;
        /**
         * 球连接到的线
         */
        public get line(): Line | null {
            return this._line;
        }
        private _radius: number = 10;
        public get radius(): number {
            return this._radius;
        }
        public style: string = '#000000';
        private _level: Level;
        private _mouseStatus: boolean = false;
        private _mouseEventListener: (event: MouseEvent) => void;
        public get level(): Level {
            return this._level;
        }
        public constructor(level: Level);
        public constructor(level: Level, position: util.Point);
        public constructor(level: Level, position: util.Point, speed: util.Vector);
        public constructor(level: Level, position?: util.Point, speed?: util.Vector) {
            this._level = level;
            let self = this;
            this._mouseEventListener = function(event: MouseEvent) {
                switch (event.type) {
                    case 'mousedown': {
                        self._mouseStatus = true;
                        break;
                    }
                    case 'mouseup': {
                        self._mouseStatus = false;
                        break;
                    }
                    default: {
                        console.log(event);
                        break;
                    }
                }
            };
            level.game.listen('mousedown', this._mouseEventListener);
            level.game.listen('mouseup', this._mouseEventListener);
            this.position = position || new util.Point();
            this.speed = speed || new util.Vector();
        }
        public update(level: Level): void {
            this._level = level;
            if (this._line) {
                this._line.offsetBall(level, this);
                if (!this._mouseStatus) {
                    this._line = null;
                }
            } else {
                this.speed.vy += level.game.intervalUpdateTime / 1000 * level.gravity;
                this.position.offset(this.speed, level.game.intervalUpdateTime / 1000);
                if (this._mouseStatus) {
                    for (let line of this.level.lines) {
                        if (line.isContactBall(level, this)) {
                            this._line = line;
                            this._line.enterBall(level, this);
                            break;
                        }
                    }
                }
            }
        }
        public paint(context: CanvasRenderingContext2D, size: util.Size): void {
            this.paintComponent(context, size);
        }
        public paintBackground(context: CanvasRenderingContext2D, size: util.Size): void {}
        public paintComponent(context: CanvasRenderingContext2D, size: util.Size): void {
            context.fillStyle = this.style;
            context.beginPath();
            context.arc(this.position.x, this.position.y, this._radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        }
        public dispose(): void {
            this._level.game.remove('mousedown', this._mouseEventListener);
            this._level.game.remove('mouseup', this._mouseEventListener);
        }
    }
    export abstract class Line implements Drawable {
        public constructor() {}
        public abstract isContactBall(level: Level, ball: Ball): boolean;
        public abstract enterBall(level: Level, ball: Ball): void;
        public abstract offsetBall(level: Level, ball: Ball): void;
        public paint(context: CanvasRenderingContext2D, size: util.Size): void {
            this.paintBackground(context, size);
            this.paintComponent(context, size);
        }
        paintBackground(context: CanvasRenderingContext2D, size: util.Size): void {}
        paintComponent(context: CanvasRenderingContext2D, size: util.Size): void {}
    }
    export abstract class Page implements Drawable, GameUpdatable {
        public backgroundColor: string = '#000000';
        private _game: Game;
        public get game(): Game {
            return this._game;
        }
        public constructor(g: Game) {
            this._game = g;
        }
        public update(game: Game): void {
            this._game = game;
        }
        public paint(context: CanvasRenderingContext2D, size: util.Size): void {
            this.paintBackground(context, size);
            this.paintComponent(context, size);
        }
        public paintBackground(context: CanvasRenderingContext2D, size: util.Size): void {
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, size.width, size.height);
        }
        public paintComponent(context: CanvasRenderingContext2D, size: util.Size): void {}
    }
    export class LevelContext {
        private _gravity: number;
        private _ball: Ball;
        private _lines: Line[];
        public get gravity(): number {
            return this._gravity;
        }
        public get ball(): Ball {
            return this._ball;
        }
        public get lines(): Line[] {
            return this._lines;
        }
        public constructor(level: Level) {
            this._gravity = level.gravity;
            this._ball = level.ball;
            this._lines = level.lines;
        }
    }
    export abstract class Level extends Page {
        public abstract get gravity(): number;
        public abstract get ball(): Ball;
        public abstract get lines(): Line[];
        public constructor(game: Game) {
            super(game);
        }
        public override update(game: Game): void {
            super.update(game);
            this.ball.update(this);
        }
        public override paintComponent(context: CanvasRenderingContext2D, size: util.Size): void {
            this.lines.forEach(function(line) {
                line.paint(context, size);
            });
            this.ball.paint(context, size);
        }
    }
    export class Game {
        private _page: Page;
        private _actuator: actuator.Actuator;
        private _lastUpdateTime: number = Date.now();
        public get lastUpdateTime(): number {
            return this._lastUpdateTime
        }
        private _currentUpdateTime: number = Date.now();
        public get currentUpdateTime(): number {
            return this._currentUpdateTime;
        }
        public get intervalUpdateTime(): number {
            return this._currentUpdateTime - this._lastUpdateTime;
        }
        public get page(): Page {
            return this._page;
        }
        public set page(value: Page) {
            this._page = this.page;
        }
        public get actuator(): actuator.Actuator {
            return this._actuator;
        }
        public constructor(actuator: actuator.Actuator) {
            this._actuator = actuator;
            this._page = new level.DefaultLevel(this);
            window.requestAnimationFrame(this.gameFrameRequestCallback());
        }
        public listen<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => unknown) {
            this._actuator.listen(type, listener);
        }
        public remove<K extends keyof WindowEventMap>(type: K, listener: (this: Window, event: WindowEventMap[K]) => unknown) {
            this._actuator.remove(type, listener);
        }
        private gameFrameRequestCallback(): (time: DOMHighResTimeStamp) => void {
            let self = this;
            return function(time: DOMHighResTimeStamp): void {
                self._currentUpdateTime = Date.now();
                self.page.update(self);
                self.actuator.actuate(self._page);
                self._lastUpdateTime = self._currentUpdateTime;
                window.requestAnimationFrame(self.gameFrameRequestCallback());
            }
        }
    }
}