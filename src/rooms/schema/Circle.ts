import { Schema, type } from '@colyseus/schema';
  
export class Circle extends Schema {
    @type('number') lat !: number;
    @type('number') long !: number;
    @type('number') radius !: number;
}