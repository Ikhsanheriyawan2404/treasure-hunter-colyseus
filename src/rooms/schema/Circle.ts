import { Schema, type } from '@colyseus/schema';
  
export class Circle extends Schema {
    @type('number') lat !: number;
    @type('number') long !: number;
    @type('number') radius !: number;

    constructor(lat: number, long: number, radius: number) {
        super()
        this.lat = lat;
        this.long = long;
        this.radius = radius;
    }
}