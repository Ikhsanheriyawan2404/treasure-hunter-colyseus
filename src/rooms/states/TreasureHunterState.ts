import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "../schema/Player";
import { Circle } from "../schema/Circle";
import { Position } from "../schema/Position";

export class TreasureHunterState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

  @type({ map: Player })
  Player = new MapSchema<Player>();

  @type({ map: Circle })
  Circle = new MapSchema<Circle>();

  createPlayer(id: number, name: string, position: Position) {
    this.Player.set(id.toString(), new Player(id, name, position));
  }

  getPlayer(id: number) {
    return this.Player.get(id.toString());
  }
}
