import { Schema, type } from '@colyseus/schema';
import { Position } from './Position';
  
export class LogActivity extends Schema {
    @type('string') id !: string;
    @type('string') type !: string;
    @type('number') object_id !: number;
    @type('number') target_id !: number;
    @type(Position) coordinate = new Position();
    @type('string') textContent !: string;
}