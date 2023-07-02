import { Schema, type, MapSchema, CollectionSchema } from "@colyseus/schema";
import { Position } from "./Position";

export class Player extends Schema {
    @type('string') id !: string;
    @type('string') name !: string;
    @type('string') email ?: string;
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

    createPlayer(id: string, options: any) {
        this.id = id;
        this.name = options.name;
        this.armor = options.armor;
        this.email = options.email;
        this.speed = options.speed;
        this.health = options.health;
        this.position.lat = options.position.lat;
        this.position.long = options.position.long;
    }

    movePlayer(position: Position) {
        this.position.lat = position.lat;
        this.position.long = position.long;
    }

    plotObject() {
        //
    }

    attack() {
        //
    }

}