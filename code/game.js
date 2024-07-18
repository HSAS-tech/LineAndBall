"use strict";
var game;
(function (game_1) {
    class Ball {
        /**
         * 球连接到的线
         */
        get line() {
            return this._line;
        }
        get radius() {
            return this._radius;
        }
        get level() {
            return this._level;
        }
        constructor(level, position, speed) {
            this._line = null;
            this._radius = 10;
            this.style = '#000000';
            this._mouseStatus = false;
            this._level = level;
            let self = this;
            this._mouseEventListener = function (event) {
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
        update(level) {
            this._level = level;
            if (this._line) {
                this._line.offsetBall(level, this);
                if (!this._mouseStatus) {
                    this._line = null;
                }
            }
            else {
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
        paint(context, size) {
            this.paintComponent(context, size);
        }
        paintBackground(context, size) { }
        paintComponent(context, size) {
            context.fillStyle = this.style;
            context.beginPath();
            context.arc(this.position.x, this.position.y, this._radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        }
        dispose() {
            this._level.game.remove('mousedown', this._mouseEventListener);
            this._level.game.remove('mouseup', this._mouseEventListener);
        }
    }
    game_1.Ball = Ball;
    class Line {
        constructor() { }
        paint(context, size) {
            this.paintBackground(context, size);
            this.paintComponent(context, size);
        }
        paintBackground(context, size) { }
        paintComponent(context, size) { }
    }
    game_1.Line = Line;
    class Page {
        get game() {
            return this._game;
        }
        constructor(g) {
            this.backgroundColor = '#000000';
            this._game = g;
        }
        update(game) {
            this._game = game;
        }
        paint(context, size) {
            this.paintBackground(context, size);
            this.paintComponent(context, size);
        }
        paintBackground(context, size) {
            context.fillStyle = this.backgroundColor;
            context.fillRect(0, 0, size.width, size.height);
        }
        paintComponent(context, size) { }
    }
    game_1.Page = Page;
    class LevelContext {
        get gravity() {
            return this._gravity;
        }
        get ball() {
            return this._ball;
        }
        get lines() {
            return this._lines;
        }
        constructor(level) {
            this._gravity = level.gravity;
            this._ball = level.ball;
            this._lines = level.lines;
        }
    }
    game_1.LevelContext = LevelContext;
    class Level extends Page {
        constructor(game) {
            super(game);
        }
        update(game) {
            super.update(game);
            this.ball.update(this);
        }
        paintComponent(context, size) {
            this.lines.forEach(function (line) {
                line.paint(context, size);
            });
            this.ball.paint(context, size);
        }
    }
    game_1.Level = Level;
    class Game {
        get lastUpdateTime() {
            return this._lastUpdateTime;
        }
        get currentUpdateTime() {
            return this._currentUpdateTime;
        }
        get intervalUpdateTime() {
            return this._currentUpdateTime - this._lastUpdateTime;
        }
        get page() {
            return this._page;
        }
        set page(value) {
            this._page = this.page;
        }
        get actuator() {
            return this._actuator;
        }
        constructor(actuator) {
            this._lastUpdateTime = Date.now();
            this._currentUpdateTime = Date.now();
            this._actuator = actuator;
            this._page = new level.DefaultLevel(this);
            window.requestAnimationFrame(this.gameFrameRequestCallback());
        }
        listen(type, listener) {
            this._actuator.listen(type, listener);
        }
        remove(type, listener) {
            this._actuator.remove(type, listener);
        }
        gameFrameRequestCallback() {
            let self = this;
            return function (time) {
                self._currentUpdateTime = Date.now();
                self.page.update(self);
                self.actuator.actuate(self._page);
                self._lastUpdateTime = self._currentUpdateTime;
                window.requestAnimationFrame(self.gameFrameRequestCallback());
            };
        }
    }
    game_1.Game = Game;
})(game || (game = {}));
