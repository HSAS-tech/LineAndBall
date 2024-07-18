namespace line {
    export class RingLine extends game.Line {
        protected _position: util.Point;
        public get position(): util.Point {
            return this._position;
        }
        protected _radius: number;
        public get radius(): number {
            return this._radius;
        }
        protected _lineDash: number[] | null;
        public get lineDash(): number[] | null {
            return this._lineDash;
        }
        protected _foreground: string = '#000000';
        public get foreground(): string {
            return this._foreground;
        }
        public constructor(position: util.Point, radius: number);
        public constructor(position: util.Point, radius: number, lineDash: number[]);
        public constructor(position: util.Point, radius: number, lineDash?: number[]) {
            super();
            this._position = position;
            this._radius = radius;
            this._lineDash = lineDash || null;
        }
        public override isContactBall(level: game.Level, ball: game.Ball): boolean {
            let distance = this._position.distanceTo(ball.position);
            return distance - ball.radius < this._radius && this._radius < distance + ball.radius;
        }
        public override enterBall(level: game.Level, ball: game.Ball): void {
            ball.position = this._position.offsetWith(util.Vector.createVectorWithRadian(this._radius, this._position.radianTo(ball.position)));
            let vecPOtangent = new util.Vector(ball.position, this._position);
            vecPOtangent.offsetRadian(Math.PI / 2);
            let r = vecPOtangent.dotProduct(ball.speed);
            if (r > 0) {
                ball.speed.changeRadian(vecPOtangent.radian);
            } else {
                ball.speed.changeRadian(vecPOtangent.radian - Math.PI);
            }
        }
        public override offsetBall(level: game.Level, ball: game.Ball): void {
            ball.position.offset(ball.speed, level.game.intervalUpdateTime / 1000);
            ball.position = this._position.offsetWith(util.Vector.createVectorWithRadian(this._radius, this._position.radianTo(ball.position)));
            let vecPOtangent = new util.Vector(ball.position, this._position);
            vecPOtangent.offsetRadian(Math.PI / 2);
            let r = vecPOtangent.dotProduct(ball.speed);
            if (r > 0) {
                ball.speed.changeRadian(vecPOtangent.radian);
            } else {
                ball.speed.changeRadian(vecPOtangent.radian - Math.PI);
            }
        }
        public override paintComponent(context: CanvasRenderingContext2D, size: util.Size): void {
            context.strokeStyle = this._foreground;
            context.setLineDash(this._lineDash || []);
            context.beginPath();
            context.arc(this._position.x, this._position.y, this._radius, 0, 2 * Math.PI);
            context.stroke();
            context.closePath();
        }
    }
    export class StraightLine extends game.Line {
        protected _positionA: util.Point;
        public get positionA(): util.Point {
            return this._positionA;
        }
        protected _positionB: util.Point;
        public get positionB(): util.Point {
            return this._positionB;
        }
        protected _lineDash: number[] | null;
        public get lineDash(): number[] | null {
            return this._lineDash;
        }
        protected _foreground: string = '#000000';
        public get foreground(): string {
            return this._foreground;
        }
        public constructor(positionA: util.Point, positionB: util.Point);
        public constructor(positionA: util.Point, positionB: util.Point, lineDash: number[]);
        public constructor(positionA: util.Point, positionB: util.Point, lineDash?: number[]) {
            super();
            this._positionA = positionA;
            this._positionB = positionB;
            this._lineDash = lineDash || null;
        }
        public distanceTo(point: util.Point): number {
            let vecAB = new util.Vector(this._positionA, this._positionB);
            let vecAP = new util.Vector(this._positionA, point);
            let r = vecAB.dotProduct(vecAP) / vecAB.v ** 2;
            if (r <= 0) {
                return this._positionA.distanceTo(point);
            } else if (r >= 1) {
                return this._positionB.distanceTo(point);
            } else {
                vecAB.scale(r);
                vecAP.subtract(vecAB);
                return vecAP.v;
            }
        }
        public override isContactBall(level: game.Level, ball: game.Ball): boolean {
            return this.distanceTo(ball.position) < ball.radius;
        }
        public override enterBall(level: game.Level, ball: game.Ball): void {
            let vecAB = new util.Vector(this._positionA, this._positionB);
            let vecAP = new util.Vector(this._positionA, ball.position);
            let r = vecAB.dotProduct(vecAP) / vecAB.v ** 2;
            if (r <= 0) {
                ball.position = this._positionA;
                ball.speed.changeRadian(vecAB.radian);
            } else if (r >= 1) {
                ball.position = this._positionB;
                ball.speed.changeRadian(vecAB.radian - Math.PI);
            } else {
                ball.position = this._positionA.offsetWith(vecAB, r);
                let u = vecAB.dotProduct(ball.speed);
                if (u > 0) {
                    ball.speed.changeRadian(vecAB.radian);
                } else {
                    ball.speed.changeRadian(vecAB.radian - Math.PI);
                }
            }
        }
        public override offsetBall(level: game.Level, ball: game.Ball): void {
            let vecAB = new util.Vector(this._positionA, this._positionB);
            let vecAP = new util.Vector(this._positionA, ball.position);
            let r = vecAB.dotProduct(vecAP) / vecAB.v ** 2;
            if (r < 0) {
                ball.speed.changeRadian(vecAB.radian);
            } else if (r > 1) {
                ball.speed.changeRadian(vecAB.radian - Math.PI);
            }
            ball.position.offset(ball.speed, level.game.intervalUpdateTime / 1000);
        }
        public override paintComponent(context: CanvasRenderingContext2D, size: util.Size): void {
            context.strokeStyle = this._foreground;
            context.setLineDash(this._lineDash || []);
            context.beginPath();
            context.moveTo(this._positionA.x, this._positionA.y);
            context.lineTo(this._positionB.x, this._positionB.y);
            context.stroke();
            context.closePath();
        }
    }
}