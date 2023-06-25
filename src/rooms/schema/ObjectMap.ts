import { Schema, type } from "@colyseus/schema";

export class ObjectMap extends Schema {

    @type('string') id !: string;
    @type('string') type !: string;
    @type('boolean') is_active !: boolean;
    @type('string') properties !: string;

}