import { Schema, type, MapSchema } from "@colyseus/schema";

export class Player extends Schema {
    @type('number') id !: number;
    @type('string') name !: string;
    @type('number') position !: number;
}

export class Circle extends Schema {
    @type('number') lat !: number;
    @type('number') long !: number;
    @type('number') radius !: number;
}

export class ObjectMap extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Circle }) circles = new MapSchema<Circle>();
}