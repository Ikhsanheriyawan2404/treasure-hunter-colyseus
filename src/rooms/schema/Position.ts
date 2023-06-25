import { Schema, type } from "@colyseus/schema";

interface Point {
    x: number;
    y: number;
}

export class Position extends Schema {
    @type('number') lat !: number;
    @type('number') long !: number;

    set(newPosition: Point) {
        this.lat = newPosition.x;
        this.long = newPosition.y;
    }

    equals(position: Point) {
      return this.lat === position.x && this.long === position.y;
    }
}