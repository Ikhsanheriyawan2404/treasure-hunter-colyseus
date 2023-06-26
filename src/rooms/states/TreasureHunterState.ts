import { Schema, MapSchema, type } from "@colyseus/schema";
import { Player } from "../schema/Player";
import { Circle } from "../schema/Circle";
import { ObjectMap } from "../schema/ObjectMap";
import { LogActivity } from "../schema/LogActivity";
import { Message } from "../schema/Message";
import { BotEnemy } from "../schema/BotEnemy";
import { Poly } from "../schema/Poly";

export class World extends Schema {
  @type("number") countPlayer: number = 0;
  @type("number") countObstacle: number = 0;
  @type("number") countItem: number = 0;
  @type("number") countEnemyBot: number = 0;
  @type("string") time : string = '';
  @type("string") media : string = '';
  @type(Poly) maps = new Poly();
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

  @type({ map: LogActivity })
  LogActivity = new MapSchema<LogActivity>();

  @type({ map: Message })
  Message = new MapSchema<Message>();

  @type({ map: BotEnemy })
  BotEnemy = new MapSchema<BotEnemy>();
}
