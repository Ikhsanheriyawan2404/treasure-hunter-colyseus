import { Schema, type, MapSchema, CollectionSchema } from "@colyseus/schema";
import { Position } from "./Position";

export class Player extends Schema {
    @type('number') id !: number;
    @type('string') name !: string;
    @type('string') email !: string;
    @type('number') armor : number = 0;
    @type('number') speed : number = 0;
    @type('number') health : number = 0;
    @type('number') points : number = 0;
    @type(Position) position = new Position();

    // constructor(
    //     id: number,
    //     name: string,
    //     email: string,
    //     armor: number,
    //     speed: number,
    //     health: number,
    //     position: Position,
    // ) {
    //     super();
    //     this.id = id;
    //     this.name = name;
    //     this.armor = armor;
    //     this.email = email;
    //     this.speed = speed;
    //     this.health = health;
    //     this.position.lat = position.lat;
    //     this.position.long = position.long;
    // }

    createPlayer(id: number, name: string, email: string, armor: number, speed: number, health: number, position: Position) {
        this.id = id;
        this.name = name;
        this.armor = armor;
        this.email = email;
        this.speed = speed;
        this.health = health;
        this.position.lat = position.lat;
        this.position.long = position.long;
    }
}