import { Room, Client } from "@colyseus/core";
import { TreasureHunterState, World } from "./states/TreasureHunterState";
import { Circle } from "./schema/Circle";
import { ObjectMap } from "./schema/ObjectMap";
import { Message } from "./schema/Message";
import { BotEnemy } from "./schema/BotEnemy";

export class TreasureHunterRoom extends Room<TreasureHunterState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new TreasureHunterState());

    // Generate informasi world
    const world = new World();
    world.create('2020-12-12', 'https://www.youtube.com/watch?v=5qap5aO4i9A', Object.assign(new Circle(), {
      lat: 0,
      long: 0,
      radius: 0,
    }));
    // tambahkan pada state
    this.state.world = world;

    // Generate random object di map
    const objects = new ObjectMap();
    const allObject: Array<any> = objects.setRandomObjectMap();
    // put semua data object di state
    allObject.forEach((object) => {
      this.state.ObjectMap.set(object.id, object);
      this.state.world.countItem += 1;
    });

    // Generate enemy bot
    const Bot = new BotEnemy();
    const enemies: Array<any> = Bot.setBot();
    // put semua data object di state
    enemies.forEach((item) => {
      this.state.BotEnemy.set(item.id, item);
    });

    //==========================================================================
    // All event handler to update state
    //==========================================================================

    this.onMessage("send_message", (client, data) => {
      const message = new Message();
      console.log(`${data.player_name} kriim pesan berupa : ${data.message}`)
      message.createMessage(data.message_id, data);
      this.state.Message.set(message.message_id, message);

      this.broadcast('send_message', data);
    });

    this.onMessage("move", (client, data) => {
      const player = this.state.Player.get(data.player_id);
      player.position.lat = data.position.lat;
      player.position.long = data.position.long;

      this.broadcast('move', data);
    });

    this.onMessage("increasePoint", (client, data) => {
      const player = this.state.Player.get(data.player_id);
      player.points += data.points;

      this.broadcast('increasePoint', data);
    });

    this.onMessage("increaseHealth", (client, data) => {
      const player = this.state.Player.get(data.player_id);
      player.health += data.health;

      this.broadcast('increaseHealth', data);
    });

    this.onMessage("setSpeed", (client, data) => {
      const player = this.state.Player.get(data.player_id);
      player.speed = data.speed;

      this.broadcast('setSpeed', data);
    });

    this.onMessage("plot_object", (client, data) => {
      //
    });
  }

  onJoin (client: Client, options: any) {
    // Generate player baru
    const player = this.state.createPlayer(client.sessionId, options);
    this.state.world.countPlayer += 1;

    console.log(client.sessionId, "joined!");
    // console.log(this.state.getPlayer(client.sessionId));
    this.broadcast('onJoin', {
      id: client.sessionId,
      player: player,
      message: 'Halo selamat datang di Game Treasure Hunter!',
    });
  }

  onLeave (client: Client, consented: boolean) {
    let player = this.state.removePlayer(client.sessionId);
    this.broadcast('onLeave', client.sessionId);
    console.log(client.sessionId, "left!");
    console.log(player)
  }

  onDispose() {
    this.broadcast('onDispose');
    console.log("room", this.roomId, "disposing...");
  }

}
