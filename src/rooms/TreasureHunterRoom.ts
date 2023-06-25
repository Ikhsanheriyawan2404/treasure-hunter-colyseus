import { Room, Client } from "@colyseus/core";
import { TreasureHunterState, World } from "./states/TreasureHunterState";
import { Player } from "./schema/Player";
import { Circle } from "./schema/Circle";
import { Poly, IPoly } from "./schema/Poly";
import { ObjectMap } from "./schema/ObjectMap";

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

    /**
    * Generate data random for object on maps
    * [Items, Enemies, Obstacles]
    */
   let properties: string;
    for (let i = 0; i < 100; i++) {
      let types = ['items', 'explosion', 'wall', 'weather'];
      // type random
      let randomType = types[Math.floor(Math.random() * types.length)];

      if (randomType === 'items') {
        properties = JSON.stringify(Object.assign(new Circle(), {
          lat: Math.floor(Math.random() * 100),
          long: Math.floor(Math.random() * 100),
          radius: Math.floor(Math.random() * 100),
          speed: Math.floor(Math.random() * 100),
          health: Math.floor(Math.random() * 100),
          armor: 0,
        }))
      } else if (randomType === 'explosion') {
        properties = JSON.stringify(Object.assign(new Circle(), {
          lat: Math.floor(Math.random() * 100),
          long: Math.floor(Math.random() * 100),
          radius: Math.floor(Math.random() * 100),
        }))
      } else if (randomType === 'wall') {
        // random polygon
        let minPoints = 1; // Jumlah titik minimum
        let maxPoints = 5; // Jumlah titik maksimum

        let numPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;

        let poly: Array<IPoly> = []; // Array untuk menyimpan titik-titik poligon

        for (let i = 0; i < numPoints; i++) {
          let point = {
            lat: Math.floor(Math.random() * 100),
            lng: Math.floor(Math.random() * 100),
          };

          poly.push([point.lat, point.lng]);
        }

        properties = JSON.stringify(Object.assign(new Poly(), {
          type: 'polyline',
          poly: poly,
        }));
      } else if (randomType === 'weather') {
        // random polygon
        let minPoints = 1; // Jumlah titik minimum
        let maxPoints = 5; // Jumlah titik maksimum

        let numPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;

        let poly: Array<IPoly> = []; // Array untuk menyimpan titik-titik poligon

        for (let i = 0; i < numPoints; i++) {
          let point = {
            lat: Math.floor(Math.random() * 100),
            lng: Math.floor(Math.random() * 100),
          };

          poly.push([point.lat, point.lng]);
        }

        properties = JSON.stringify(Object.assign(new Poly(), {
          type: 'polygon',
          poly: poly,
        }));
      }

      let id = Math.floor(Math.random() * 100).toString();
      this.state.ObjectMap.set(id, Object.assign(new ObjectMap(), {
        // create random id
        id: id,
        type: randomType,
        is_active: true,
        properties: properties,
      }));
    }

    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
    });

    this.onMessage("move", (client, data) => {
    });
  }

  onJoin (client: Client, options: any) {
    
    const player = new Player();
    player.createPlayer(
      options.id,
      options.name,
      options.email,
      options.armor,
      options.speed,
      options.health,
      options.position
    );
    this.state.world.countEntity += 1;

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
