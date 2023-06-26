import { Room, Client } from "@colyseus/core";
import { TreasureHunterState, World } from "./states/TreasureHunterState";
import { Player } from "./schema/Player";
import { Circle } from "./schema/Circle";
import { ObjectMap } from "./schema/ObjectMap";
import { Message } from "./schema/Message";

export class TreasureHunterRoom extends Room<TreasureHunterState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new TreasureHunterState());

    const world = new World();
    world.create('2020-12-12', 'https://www.youtube.com/watch?v=5qap5aO4i9A', Object.assign(new Circle(), {
      lat: 0,
      long: 0,
      radius: 0,
    }));
    
    this.state.world = world;
    
    // Generate random object map
    const objects = new ObjectMap();
    const allobjects = objects.setRandomObjectMap();

    allobjects.forEach((object) => {
      this.state.ObjectMap.set(object.id, object);
    });

    this.onMessage("send_message", (client, data) => {
      const message = new Message();
      message.createMessage(data.message_id, data);
      this.state.Message.set(data.message_id, message);
    });

    this.onMessage("move", (client, data) => {
      const player = this.state.Player.get(data.player_id);
      player.position.lat = data.position.lat;
      player.position.long = data.position.long;
    });

    this.onMessage("plot_object", (client, data) => {
      //
    });
  }

  onJoin (client: Client, options: any) {
    
    const player = new Player();
    player.createPlayer(options.id, options);
    this.state.world.countPlayer += 1;

    this.state.Player.set(options.id.toString(), player);

    console.log(client.sessionId, "joined!");

    this.broadcast('onJoin', {
      id: client.sessionId,
      message: 'halo',
    });
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

}
