import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "../schema/Player";
import { Circle } from "../schema/Circle";
import { ObjectMap } from "../schema/ObjectMap";

export class World extends Schema {
  @type("number") countEntity: number = 0;
  @type("string") time : string = '';
  @type("string") media : string = '';
  @type(Circle) treasure = new Circle();

  create (time: string, media: string, circle: Circle) {
    this.time = time;
    this.media = media;
    this.treasure.lat = circle.lat;
    this.treasure.long = circle.long;
    this.treasure.radius = circle.radius;
  }
}
export class TreasureHunterState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

  @type(World) world = new World;

  @type({ map: Player })
  Player = new MapSchema<Player>();

  @type({ map: ObjectMap })
  ObjectMap = new MapSchema<ObjectMap>();
  
}
