import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type('number') id !: number;
    @type('string') name !: string;
    @type('number') position !: number;

    constructor(id: number, name: string, position: number) {
        super();
        this.id = id;
        this.name = name;
        this.position = position;
    }

    createPlayer(id: number, name: string, position: number) {
        this.id = id;
        this.name = name;
        this.position = position;
    }
}

  
export class Circle extends Schema {
    @type('number') lat !: number;
    @type('number') long !: number;
    @type('number') radius !: number;
}