"use strict";
var util;
(function (util) {
    class Point {
        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        distanceTo(valueA, valueB) {
            if (valueA instanceof Point) {
                return Math.sqrt((valueA.x - this.x) ** 2 + (valueA.y - this.y) ** 2);
            }
            else {
                return Math.sqrt((valueA - this.x) ** 2 + (valueB - this.y) ** 2);
            }
        }
        radianTo(valueA, valueB) {
            if (valueA instanceof Point) {
                return Math.atan2(valueA.y - this.y, valueA.x - this.x);
            }
            else {
                return Math.atan2(valueB, valueA);
            }
        }
        offsetWith(valueA, valueB, valueC) {
            if (valueA instanceof Vector) {
                if (valueB) {
                    return new Point(this.x + valueA.vx * valueB, this.y + valueA.vy * valueB);
                }
                else {
                    return new Point(this.x + valueA.vx, this.y + valueA.vy);
                }
            }
            else {
                if (valueC) {
                    return new Point(this.x + valueA * valueC, this.y + valueB * valueC);
                }
                else {
                    return new Point(this.x + valueA, this.y + valueB);
                }
            }
        }
        offset(valueA, valueB, valueC) {
            if (valueA instanceof Vector) {
                if (valueB) {
                    this.x += valueA.vx * valueB;
                    this.y += valueA.vy * valueB;
                }
                else {
                    this.x += valueA.vx;
                    this.y += valueA.vy;
                }
            }
            else {
                if (valueC) {
                    this.x += valueA * valueC;
                    this.y += valueB * valueC;
                }
                else {
                    this.x += valueA;
                    this.y += valueB;
                }
            }
        }
    }
    util.Point = Point;
    class Vector {
        static createVectorWithRadian(v, radian) {
            return new Vector(v * Math.cos(radian), v * Math.sin(radian));
        }
        get v() {
            return Math.sqrt(this.vx ** 2 + this.vy ** 2);
        }
        get radian() {
            return Math.atan2(this.vy, this.vx);
        }
        constructor(valueA, valueB) {
            if (valueA instanceof Point) {
                this.vx = valueB.x - valueA.x;
                this.vy = valueB.y - valueA.y;
            }
            else {
                if (valueA) {
                    this.vx = valueA;
                    this.vy = valueB;
                }
                else {
                    this.vx = 0;
                    this.vy = 0;
                }
            }
        }
        changeRadian(radian) {
            let v = this.v;
            this.vx = v * Math.cos(radian);
            this.vy = v * Math.sin(radian);
        }
        changeRadianWith(radian) {
            let v = this.v;
            return new Vector(v * Math.cos(radian), v * Math.sin(radian));
        }
        offsetRadian(offsetRadian) {
            this.changeRadian(this.radian + offsetRadian);
        }
        offsetRadianWith(offsetRadian) {
            return this.changeRadianWith(this.radian + offsetRadian);
        }
        scale(scale) {
            this.vx *= scale;
            this.vy *= scale;
        }
        scaleWith(scale) {
            return new Vector(this.vx * scale, this.vy * scale);
        }
        dotProduct(vector) {
            return this.vx * vector.vx + this.vy * vector.vy;
        }
        add(vector) {
            this.vx += vector.vx;
            this.vy += vector.vy;
        }
        addWith(vector) {
            return new Vector(this.vx + vector.vx, this.vy + vector.vy);
        }
        subtract(vector) {
            this.vx -= vector.vx;
            this.vy -= vector.vy;
        }
        subtractWith(vector) {
            return new Vector(this.vx - vector.vx, this.vy - vector.vy);
        }
    }
    util.Vector = Vector;
    class Size {
        constructor(width, height) {
            if (typeof width === undefined) {
                this.width = 0;
                this.height = 0;
            }
            else {
                this.width = width;
                this.height = height;
            }
        }
    }
    util.Size = Size;
    class Rectangle {
        get point() {
            return new Point(this.x, this.y);
        }
        set point(value) {
            this.x = value.x;
            this.y = value.y;
        }
        get size() {
            return new Size(this.width, this.height);
        }
        set size(value) {
            this.width = value.width;
            this.height = value.height;
        }
        constructor(valueA, valueB, valueC, valueD) {
            if (typeof valueA === undefined) {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
            }
            else if (typeof valueC === undefined) {
                if (valueA instanceof Point) {
                    this.x = valueA.x;
                    this.y = valueA.y;
                    this.width = valueB.width;
                    this.height = valueB.height;
                }
                else {
                    this.x = 0;
                    this.y = 0;
                    this.width = valueA;
                    this.height = valueB;
                }
            }
            else {
                this.x = valueA;
                this.y = valueB;
                this.width = valueC;
                this.height = valueD;
            }
        }
    }
    util.Rectangle = Rectangle;
    class Resources {
        static getResource(url) {
            return '';
        }
        constructor() { }
    }
    util.Resources = Resources;
})(util || (util = {}));
