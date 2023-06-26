import { Schema, type, MapSchema, CollectionSchema } from "@colyseus/schema";
import { Position } from "./Position";
import { Poly } from "./Poly";

export class BotEnemy extends Schema {
    @type('number') id !: number;
    @type('string') name !: string;
    @type('number') speed : number = 0;
    @type('number') health : number = 0;
    @type(Position) position = new Position();
    @type(Poly) movement = new Poly();

    public minPoint: number;
    public maxPoint: number;
}