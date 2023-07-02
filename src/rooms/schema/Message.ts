import { Schema, type } from '@colyseus/schema';
  
export class Message extends Schema {
    @type('string') message_id !: string;
    @type('string') type !: string;
    @type('string') player_id !: string;
    @type('string') player_name !: string;
    @type('string') message !: string;
    @type('string') time !: string;

    createMessage(message_id: string, options: any) {
        this.message_id = message_id
        this.type = options.type;
        this.player_id = options.player_id;
        this.player_name = options.player_name;
        this.message = options.message;
        this.time = options.time;
    }
}