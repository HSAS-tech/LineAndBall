namespace util {
    export class Point {
        public x: number;
        public y: number;
        public constructor();
        public constructor(x: number, y: number);
        public constructor(x?: number, y?: number) {
            this.x = x || 0;
            this.y = y || 0;
        }
        public distanceTo(point: Point): number;
        public distanceTo(x: number, y: number): number;
        public distanceTo(valueA: Point | number, valueB?: number): number {
            if (valueA instanceof Point) {
                return Math.sqrt((valueA.x - this.x) ** 2 + (valueA.y - this.y) ** 2);
            } else {
                return Math.sqrt((valueA - this.x) ** 2 + (valueB as number - this.y) ** 2);
            }
        }
        public radianTo(point: Point): number;
        public radianTo(x: number, y: number): number
        public radianTo(valueA: Point | number, valueB?: number): number {
            if (valueA instanceof Point) {
                return Math.atan2(valueA.y - this.y, valueA.x - this.x);
            } else {
                return Math.atan2(valueB as number, valueA);
            }
        }
        public offsetWith(offset: Vector): Point;
        public offsetWith(offset: Vector, scale: number): Point;
        public offsetWith(offsetX: number, offsetY: number): Point;
        public offsetWith(offsetX: number, offsetY: number, scale: number): Point;
        public offsetWith(valueA: number | Vector, valueB?: number, valueC?: number): Point {
            if (valueA instanceof Vector) {
                if (valueB) {
                    return new Point(this.x + valueA.vx * valueB, this.y + valueA.vy * valueB);
                } else {
                    return new Point(this.x + valueA.vx, this.y + valueA.vy);
                }
            } else {
                if (valueC) {
                    return new Point(this.x + valueA * valueC, this.y + (valueB as number) * valueC);
                } else {
                    return new Point(this.x + valueA, this.y + (valueB as number));
                }
            }
        }
        public offset(offset: Vector): void;
        public offset(offset: Vector, scale: number): void;
        public offset(offsetX: number, offsetY: number): void;
        public offset(offsetX: number, offsetY: number, scale: number): void;
        public offset(valueA: number | Vector, valueB?: number, valueC?: number): void {
            if (valueA instanceof Vector) {
                if (valueB) {
                    this.x += valueA.vx * valueB;
                    this.y += valueA.vy * valueB;
                } else {
                    this.x += valueA.vx;
                    this.y += valueA.vy;
                }
            } else {
                if (valueC) {
                    this.x += valueA * valueC;
                    this.y += (valueB as number) * valueC;
                } else {
                    this.x += valueA;
                    this.y += valueB as number;
                }
            }
        }
    }
    export class Vector {
        public static createVectorWithRadian(v: number, radian: number): Vector {
            return new Vector(v * Math.cos(radian), v * Math.sin(radian));
        }
        public vx: number;
        public vy: number;
        public get v(): number {
            return Math.sqrt(this.vx ** 2 + this.vy ** 2);
        }
        public get radian(): number {
            return Math.atan2(this.vy, this.vx);
        }
        public constructor();
        public constructor(vx: number, vy: number);
        public constructor(pointA: Point, pointB: Point);
        public constructor(valueA?: number | Point, valueB?: number | Point) {
            if (valueA instanceof Point) {
                this.vx = (valueB as Point).x - valueA.x;
                this.vy = (valueB as Point).y - valueA.y;
            } else {
                if (valueA) {
                    this.vx = valueA;
                    this.vy = valueB as number;
                } else {
                    this.vx = 0;
                    this.vy = 0;
                }
            }
        }
        public changeRadian(radian: number): void {
            let v = this.v;
            this.vx = v * Math.cos(radian);
            this.vy = v * Math.sin(radian);
        }
        public changeRadianWith(radian: number): Vector {
            let v = this.v;
            return new Vector(v * Math.cos(radian), v * Math.sin(radian));
        }
        public offsetRadian(offsetRadian: number): void {
            this.changeRadian(this.radian + offsetRadian);
        }
        public offsetRadianWith(offsetRadian: number): Vector {
            return this.changeRadianWith(this.radian + offsetRadian);
        }
        public scale(scale: number): void {
            this.vx *= scale;
            this.vy *= scale;
        }
        public scaleWith(scale: number): Vector {
            return new Vector(this.vx * scale, this.vy * scale);
        }
        public dotProduct(vector: Vector): number {
            return this.vx * vector.vx + this.vy * vector.vy;
        }
        public add(vector: Vector): void {
            this.vx += vector.vx;
            this.vy += vector.vy;
        }
        public addWith(vector: Vector): Vector {
            return new Vector(this.vx + vector.vx, this.vy + vector.vy);
        }
        public subtract(vector: Vector): void {
            this.vx -= vector.vx;
            this.vy -= vector.vy;
        }
        public subtractWith(vector: Vector): Vector {
            return new Vector(this.vx - vector.vx, this.vy - vector.vy);
        }
    }
    export class Size {
        public width: number;
        public height: number;
        public constructor();
        public constructor(width: number, height: number);
        public constructor(width?: number, height?: number) {
            if (typeof width === undefined) {
                this.width = 0;
                this.height = 0;
            } else {
                this.width = width as number;
                this.height = height as number;
            }
        }
    }
    export class Rectangle {
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public get point(): Point {
            return new Point(this.x, this.y);
        }
        public set point(value: Point) {
            this.x = value.x;
            this.y = value.y;
        }
        public get size(): Size {
            return new Size(this.width, this.height);
        }
        public set size(value: Size) {
            this.width = value.width;
            this.height = value.height;
        }
        public constructor();
        public constructor(width: number, height: number);
        public constructor(point: Point, size: Size);
        public constructor(x: number, y: number, width: number, height: number)
        public constructor(valueA?: number | Point, valueB?: number | Size, valueC?: number, valueD?: number) {
            if (typeof valueA === undefined) {
                this.x = 0;
                this.y = 0;
                this.width = 0;
                this.height = 0;
            } else if (typeof valueC === undefined) {
                if (valueA instanceof Point) {
                    this.x = valueA.x;
                    this.y = valueA.y;
                    this.width = (valueB as Size).width;
                    this.height = (valueB as Size).height;
                } else {
                    this.x = 0;
                    this.y = 0
                    this.width = valueA as number;
                    this.height = valueB as number;
                }
            } else {
                this.x = valueA as number;
                this.y = valueB as number;
                this.width = valueC as number;
                this.height = valueD as number;
            }
        }
    }
    export class Resources {
        public static getResource(url: string): string {
            return '';
        }
        private constructor() {}
    }
}