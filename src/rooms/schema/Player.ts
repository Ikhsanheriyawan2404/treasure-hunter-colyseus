import { Schema, type } from "@colyseus/schema";
import { Position } from "./Position";
import { Bound } from "./Bounds";

export class Player extends Schema {
    @type('string') id !: string;
    @type('string') name !: string;
    @type('string') email ?: string;
    @type('number') armor : number = 0;
    @type('number') speed : number = 0;
    @type('number') health : number = 0;
    @type('number') points : number = 0;
    @type(Position) position = new Position();

    // constructor(
    //     id: number,
    //     name: string,
    //     email: string,
    //     armor: number,
    //     speed: number,
    //     health: number,
    //     position: Position,
    // ) {
    //     super();
    //     this.id = id;
    //     this.name = name;
    //     this.armor = armor;
    //     this.email = email;
    //     this.speed = speed;
    //     this.health = health;
    //     this.position.lat = position.lat;
    //     this.position.long = position.long;
    // }

    createPlayer(id: string, options: any) {
        const geoJSON = this.getRandomPositionByPolygon(new Bound().JakartaBounds);
        const coordinates = geoJSON.geometry.coordinates[0];
        const latitudes = coordinates.map(coord => coord[1]);
        const longitudes = coordinates.map(coord => coord[0]);

        this.id = id;
        this.name = options.name;
        this.email = options.email;
        this.position.lat = this.position.lat;
        this.position.long = this.position.long;
    }

    movePlayer(position: Position) {
        this.position.lat = position.lat;
        this.position.long = position.long;
    }

    getRandomPositionByPolygon(polyData: string) {
        const lines = polyData.trim().split('\n');
        const name = lines[0].trim();
        const coordinates = lines.slice(2, lines.length - 2).map(line => {
            const [lng, lat] = line.trim().split(/\s+/).map(Number);
            return [lng, lat];
        });

        const geojson = {
            type: 'Feature',
            properties: {
                name: name
            },
            geometry: {
                type: 'Polygon',
                coordinates: [coordinates]
            }
        };
        return geojson;
    }

    // Fungsi untuk mendapatkan random number di antara dua nilai
    getRandomInRange(min: number, max: number) {

        return Math.random() * (max - min) + min;
    }

    plotObject() {
        //
    }

    attack() {
        //
    }

}