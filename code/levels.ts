namespace level {
    export class DefaultLevel extends game.Level {
        protected _gravity: number = 200;
        protected _ball: game.Ball = new game.Ball(this, new util.Point(60, 60));
        protected _lines: game.Line[] = [
            new line.RingLine(new util.Point(100, 100), 100, [10, 10]), 
            new line.RingLine(new util.Point(400, 100), 100, [10, 10]), 
            new line.RingLine(new util.Point(100, 400), 100, [10, 10]), 
            new line.RingLine(new util.Point(400, 400), 100, [10, 10]), 
            new line.StraightLine(new util.Point(0, 600), new util.Point(600, 600), [10, 10]),
        ];
        public get gravity(): number {
            return this._gravity;
        }
        public get ball(): game.Ball {
            return this._ball;
        }
        public get lines(): game.Line[] {
            return this._lines;
        }
        public constructor(g: game.Game) {
            super(g);
            this.backgroundColor = '#eeeeee';
        }
    }
    export class LevelLoader {
        private static _levels: string[] = [];
        public static levelCount(): number {
            return this._levels.length;
        }
        public static loadLevel(level: number, g: game.Game): game.Level {
            if (level in this._levels) {
                return new (class extends DefaultLevel {
                    public get gravity(): number {
                        return this._gravity;
                    }
                    public get ball(): game.Ball {
                        return this._ball;
                    }
                    public get lines(): game.Line[] {
                        return this._lines;
                    }
                    public constructor(levelContext: game.LevelContext, game: game.Game) {
                        super(game);
                        this._gravity = levelContext.gravity;
                        this._ball = levelContext.ball;
                        this._lines = levelContext.lines;
                    }
                }) (JSON.parse(this._levels[level]), g);
            } else {
                throw new error.ArgumentError('level');
            }
        }
        private static _tempLevels: Map<string, string> = new Map();
        public static tempLevels(): string[] {
            let keys: string[] = [];
            for (let key of this._tempLevels.keys()) {
                keys.push(key);
            }
            return keys;
        }
        public static loadTempLevel(level: string, g: game.Game): game.Level {
            if (this._tempLevels.has(level)) {
                return new (class extends game.Level {
                    private _gravity: number;
                    private _ball: game.Ball;
                    private _lines: game.Line[];
                    public get gravity(): number {
                        return this._gravity;
                    }
                    public get ball(): game.Ball {
                        return this._ball;
                    }
                    public get lines(): game.Line[] {
                        return this._lines;
                    }
                    public constructor(levelContext: game.LevelContext, g: game.Game) {
                        super(g);
                        this._gravity = levelContext.gravity;
                        this._ball = levelContext.ball;
                        this._lines = levelContext.lines;
                    }
                }) (JSON.parse(this._tempLevels.get(level) as string), g);
            } else {
                throw new error.ArgumentError('level');
            }
        }
        private constructor() {}
    }
}