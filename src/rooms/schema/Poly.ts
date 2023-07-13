import { Schema, type, ArraySchema } from "@colyseus/schema";

export class IPoly extends Schema {
    @type("number") lat: number;
    @type("number") long: number;
}

export class Poly extends Schema {
    @type("string") type: string;
    @type([ IPoly ]) poly = new ArraySchema<IPoly>();
}