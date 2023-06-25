import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player, Circle } from "./Entity";
export class MyRoomState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

  @type({ map: Player })
  Player = new MapSchema<Player>();

  @type({ map: Circle })
  Circle = new MapSchema<Circle>();

  createPlayer(id: number, name: string, position: number) {
    this.Player.set(id.toString(), new Player(id, name, position));
  }  

}
