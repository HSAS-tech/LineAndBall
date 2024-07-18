"use strict";
var line;
(function (line) {
    class RingLine extends game.Line {
        get position() {
            return this._position;
        }
        get radius() {
            return this._radius;
        }
        get lineDash() {
            return this._lineDash;
        }
        get foreground() {
            return this._foreground;
        }
        constructor(position, radius, lineDash) {
            super();
            this._foreground = '#000000';
            this._position = position;
            this._radius = radius;
            this._lineDash = lineDash || null;
        }
        isContactBall(level, ball) {
            let distance = this._position.distanceTo(ball.position);
            return distance - ball.radius < this._radius && this._radius < distance + ball.radius;
        }
        enterBall(level, ball) {
            ball.position = this._position.offsetWith(util.Vector.createVectorWithRadian(this._radius, this._position.radianTo(ball.position)));
            let vecPOtangent = new util.Vector(ball.position, this._position);
            vecPOtangent.offsetRadian(Math.PI / 2);
            let r = vecPOtangent.dotProduct(ball.speed);
            if (r > 0) {
                ball.speed.changeRadian(vecPOtangent.radian);
            }
            else {
                ball.speed.changeRadian(vecPOtangent.radian - Math.PI);
            }
        }
        offsetBall(level, ball) {
            ball.position.offset(ball.speed, level.game.intervalUpdateTime / 1000);
            ball.position = this._position.offsetWith(util.Vector.createVectorWithRadian(this._radius, this._position.radianTo(ball.position)));
            let vecPOtangent = new util.Vector(ball.position, this._position);
            vecPOtangent.offsetRadian(Math.PI / 2);
            let r = vecPOtangent.dotProduct(ball.speed);
            if (r > 0) {
                ball.speed.changeRadian(vecPOtangent.radian);
            }
            else {
                ball.speed.changeRadian(vecPOtangent.radian - Math.PI);
            }
        }
        paintComponent(context, size) {
            context.strokeStyle = this._foreground;
            context.setLineDash(this._lineDash || []);
            context.beginPath();
            context.arc(this._position.x, this._position.y, this._radius, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }
    }
    line.RingLine = RingLine;
    class StraightLine extends game.Line {
        get positionA() {
            return this._positionA;
        }
        get positionB() {
            return this._positionB;
        }
        get lineDash() {
            return this._lineDash;
        }
        get foreground() {
            return this._foreground;
        }
        constructor(positionA, positionB, lineDash) {
            super();
            this._foreground = '#000000';
            this._positionA = positionA;
            this._positionB = positionB;
            this._lineDash = lineDash || null;
        }
        distanceTo(point) {
            let vecAB = new util.Vector(this._positionA, this._positionB);
            let vecAP = new util.Vector(this._positionA, point);
            let r = vecAB.dotProduct(vecAP) / vecAB.v ** 2;
            if (r <= 0) {
                return this._positionA.distanceTo(point);
            }
            else if (r >= 1) {
                return this._positionB.distanceTo(point);
            }
            else {
                vecAB.scale(r);
                vecAP.subtract(vecAB);
                return vecAP.v;
            }
        }
        isContactBall(level, ball) {
            return this.distanceTo(ball.position) < ball.radius;
        }
        enterBall(level, ball) {
            let vecAB = new util.Vector(this._positionA, this._positionB);
            let vecAP = new util.Vector(this._positionA, ball.position);
            let r = vecAB.dotProduct(vecAP) / vecAB.v ** 2;
            if (r <= 0) {
                ball.position = this._positionA;
                ball.speed.changeRadian(vecAB.radian);
            }
            else if (r >= 1) {
                ball.position = this._positionB;
                ball.speed.changeRadian(vecAB.radian - Math.PI);
            }
            else {
                ball.position = this._positionA.offsetWith(vecAB, r);
                let u = vecAB.dotProduct(ball.speed);
                if (u > 0) {
                    ball.speed.changeRadian(vecAB.radian);
                }
                else {
                    ball.speed.changeRadian(vecAB.radian - Math.PI);
                }
            }
        }
        offsetBall(level, ball) {
            let vecAB = new util.Vector(this._positionA, this._positionB);
            let vecAP = new util.Vector(this._positionA, ball.position);
            let r = vecAB.dotProduct(vecAP) / vecAB.v ** 2;
            if (r < 0) {
                ball.speed.changeRadian(vecAB.radian);
            }
            else if (r > 1) {
                ball.speed.changeRadian(vecAB.radian - Math.PI);
            }
            ball.position.offset(ball.speed, level.game.intervalUpdateTime / 1000);
        }
        paintComponent(context, size) {
            context.strokeStyle = this._foreground;
            context.setLineDash([10, 10]);
            context.beginPath();
            context.moveTo(this._positionA.x, this._positionA.y);
            context.lineTo(this._positionB.x, this._positionB.y);
            context.stroke();
            context.closePath();
        }
    }
    line.StraightLine = StraightLine;
})(line || (line = {}));
