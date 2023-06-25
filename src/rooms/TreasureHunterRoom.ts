import { Room, Client } from "@colyseus/core";
import { TreasureHunterState } from "./states/TreasureHunterState";
import { Player } from "./schema/Player";
import { Circle } from "./schema/Circle";
import { Position } from "./schema/Position";

export class TreasureHunterRoom extends Room<TreasureHunterState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new TreasureHunterState());
    console.log(options);

    // this.state.Player.set(options.id, new Player(options.id, options.name, options.position));

    this.state.createPlayer(options.id, options.name, options.position);

     // Generate data random untuk circles
    for (let i = 0; i < 10; i++) {
      

      this.state.Circle.set(i.toString(), new Circle(
        111111,
        111111,
        111111)
      ) // ini kode salah karena akan replace state circle bukan malah push
    }

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

    this.onMessage("move", (client, data) => {
      const player = this.state.getPlayer(data.id)
      console.log(player);
      player.position.lat = data.position.lat;
      player.position.long = data.position.long;
    });
  }

  onJoin (client: Client, options: any) {
    // this.state.Player.set(options.id, new Player(options.id, options.name, options.position));
    this.state.createPlayer(options.id, options.name, options.position);
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
