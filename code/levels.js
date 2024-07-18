"use strict";
var level;
(function (level_1) {
    class DefaultLevel extends game.Level {
        get gravity() {
            return this._gravity;
        }
        get ball() {
            return this._ball;
        }
        get lines() {
            return this._lines;
        }
        constructor(g) {
            super(g);
            this._gravity = 200;
            this._ball = new game.Ball(this, new util.Point(60, 60));
            this._lines = [
                new line.RingLine(new util.Point(100, 100), 100, [10, 10]),
                new line.RingLine(new util.Point(400, 100), 100, [10, 10]),
                new line.RingLine(new util.Point(100, 400), 100, [10, 10]),
                new line.RingLine(new util.Point(400, 400), 100, [10, 10]),
                new line.StraightLine(new util.Point(0, 600), new util.Point(600, 600), [10, 10]),
            ];
            this.backgroundColor = '#eeeeee';
        }
    }
    level_1.DefaultLevel = DefaultLevel;
    class LevelLoader {
        static levelCount() {
            return this._levels.length;
        }
        static loadLevel(level, g) {
            if (level in this._levels) {
                return new (class extends DefaultLevel {
                    get gravity() {
                        return this._gravity;
                    }
                    get ball() {
                        return this._ball;
                    }
                    get lines() {
                        return this._lines;
                    }
                    constructor(levelContext, game) {
                        super(game);
                        this._gravity = levelContext.gravity;
                        this._ball = levelContext.ball;
                        this._lines = levelContext.lines;
                    }
                })(JSON.parse(this._levels[level]), g);
            }
            else {
                throw new error.ArgumentError('level');
            }
        }
        static tempLevels() {
            let keys = [];
            for (let key of this._tempLevels.keys()) {
                keys.push(key);
            }
            return keys;
        }
        static loadTempLevel(level, g) {
            if (this._tempLevels.has(level)) {
                return new (class extends game.Level {
                    get gravity() {
                        return this._gravity;
                    }
                    get ball() {
                        return this._ball;
                    }
                    get lines() {
                        return this._lines;
                    }
                    constructor(levelContext, g) {
                        super(g);
                        this._gravity = levelContext.gravity;
                        this._ball = levelContext.ball;
                        this._lines = levelContext.lines;
                    }
                })(JSON.parse(this._tempLevels.get(level)), g);
            }
            else {
                throw new error.ArgumentError('level');
            }
        }
        constructor() { }
    }
    LevelLoader._levels = [];
    LevelLoader._tempLevels = new Map();
    level_1.LevelLoader = LevelLoader;
})(level || (level = {}));
