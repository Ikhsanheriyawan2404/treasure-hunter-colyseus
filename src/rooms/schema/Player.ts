import { Schema, type, MapSchema, CollectionSchema } from "@colyseus/schema";
import { Position } from "./Position";

export class Player extends Schema {
    @type('number') id !: number;
    @type('string') name !: string;
    @type(Position) position = new Position();
    // @type({ collection: Position }) position = new CollectionSchema<Position>();

    constructor(id: number, name: string, position: Position) {
        super();
        this.id = id;
        this.name = name;
        this.position.lat = position.lat;
        this.position.long = position.long;
    }
}