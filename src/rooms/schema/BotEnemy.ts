import { Schema, type, MapSchema, CollectionSchema } from "@colyseus/schema";
import { Position } from "./Position";
import { Poly } from "./Poly";
import { Bound } from "./Bounds";

export class BotEnemy extends Schema {
    @type('number') id !: number;
    @type('string') name !: string;
    @type('number') speed : number = 0;
    @type('number') health : number = 0;
    @type(Position) position = new Position();
    @type(Poly) movement = new Poly();

    private minPoint: number;
    private maxPoint: number;
    private totalDataRand = 100;
    private Boundary = new Bound();

    public createBotEnemy(objects: any) {
        this.id = objects.id;
        this.name = 'wakwau';
        this.speed = objects.speed;
        this.health = 100;
        this.position.lat = objects.position.lat;
        this.position.long = objects.position.long;
        this.movement = objects.movement;
    }

    setBot() {
        let data: Array<any> = []; 
        // let properties: string;
        this.minPoint = 0;
        this.maxPoint = 15;

        for (let i = 0; i < this.totalDataRand; i++) {
            // type random
            let numPoints = Math.floor(Math.random() * (this.maxPoint - this.minPoint + 1)) + this.minPoint;
            let poly: Array<any>;

            const geoJSON = this.Boundary.getRandomPositionByPolygon(this.Boundary.JakartaBounds);
            const coordinates = geoJSON.geometry.coordinates[0];
            const latitudes = coordinates.map(coord => coord[1]);
            const longitudes = coordinates.map(coord => coord[0]);

            let newLat, newLng;
            newLat = this.Boundary.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes));
            newLng = this.Boundary.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes));

            poly = this.Boundary.createRandomPolyline({
                lat: this.Boundary.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes)),
                lng: this.Boundary.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes)),
            }, numPoints, 1_000);

            let id = i + 1;
            let row: BotEnemy = new BotEnemy();
            row.id = id;
            row.health = 100;
            row.speed = 100;
            row.position.lat = newLat;
            row.position.long = newLng;
            row.movement = Object.assign(new Poly(), {
                type: 'polyline',
                poly: poly,
            });

            data.push(row);
        }
        return data;
    }
}