import { Schema, type, MapSchema, CollectionSchema } from "@colyseus/schema";
import { Position } from "./Position";
import { Poly, IPoly } from "./Poly";
import { Bound } from "./Bounds";

export class BotEnemy extends Schema {
    @type('string') id !: string;
    @type('string') name !: string;
    @type('number') speed : number = 0;
    @type('number') health : number = 0;
    @type(Position) position = new Position();
    @type(Poly) movement = new Poly();

    private minPoint = 10;
    private maxPoint = 15;
    private totalDataRand = 1000;
    private Boundary = new Bound();

    public createBotEnemy(objects: any) {
        this.id = objects.id;
        this.name = objects.name;
        this.speed = objects.speed;
        this.health = 100;
        this.position.lat = objects.position.lat;
        this.position.long = objects.position.long;
        this.movement = objects.movement;
    }

    public setBot() {
        let data: Array<any> = []; 
        // let properties: string;

        for (let i = 0; i < this.totalDataRand; i++) {
            // type random
            let numPoints = Math.floor(Math.random() * (this.maxPoint - this.minPoint + 1)) + this.minPoint;
            let poly: Array<any>;

            const geoJSON = this.Boundary.getRandomPositionByPolygon(this.Boundary.JakartaBounds);
            const coordinates = geoJSON.geometry.coordinates[0];
            const latitudes = coordinates.map(coord => coord[1]);
            const longitudes = coordinates.map(coord => coord[0]);

            let newLat, newLng: number;
            newLat = this.Boundary.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes));
            newLng = this.Boundary.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes));

            poly = this.Boundary.createRandomPolyline({
                lat: newLat,
                lng: newLng,
            }, numPoints, 1_000);
            
            console.log(poly)

            

            let id = Math.floor(Math.random() * 1000);
            let row: BotEnemy = new BotEnemy();
            row.id = id.toString();
            row.name = "wakwau";
            row.health = 100;
            row.speed = 100;
            row.position.lat = 0;
            row.position.long = 0;
            // row.movement = Object.assign(new Poly(), {
            //     type: 'polyline',
            //     poly: poly,
            // });
            row.movement.type = "Polyline"
            poly.forEach((coord: number[]) => {
                const position: IPoly = new IPoly();
                position.lat = coord[0];
                position.long = coord[1];
                row.movement.poly.push(position);
            });
            console.log(row.movement)
            data.push(row);
        }
        return data;
    }
}