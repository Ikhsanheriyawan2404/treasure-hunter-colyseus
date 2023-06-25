import { Room, Client } from "@colyseus/core";
import { MyRoomState } from "./schema/MyRoomState";
import { Player, Circle } from "./schema/Entity";

export class MyRoom extends Room<MyRoomState> {
  maxClients = 4;

  onCreate (options: any) {
    this.setState(new MyRoomState());
    console.log(options);

    // this.state.Player.set(options.id, new Player(options.id, options.name, options.position));
    this.state.createPlayer(options.id, options.name, options.position);

     // Generate data random untuk circles
    for (let i = 0; i < 10; i++) {
      const circle = new Circle();
      circle.lat = 111111;
      circle.long = 111111;
      circle.radius = 111111;

      this.state.Circle.set(i.toString(), circle); // ini kode salah karena akan replace state circle bukan malah push
    }

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

    this.onMessage("move", (client, data) => {
      const player = this.state.Player.get(data.id)
      player.position = data.position;
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
