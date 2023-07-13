import { Schema, type } from "@colyseus/schema";
import { Circle } from "./Circle";
import { Poly } from "./Poly";
import { Bound } from "./Bounds";

export class ObjectMap extends Schema {

    @type('string') id !: string;
    @type('string') type !: string;
    @type('boolean') is_active !: boolean;
    @type('string') properties !: string;

    private minPoint: number = 1; // Jumlah point/titik di maps
    private maxPoint: number = 5; // Jumlah point/titik di maps
    private totalDataRand: number = 1000; // Jumlah point/titik di maps
    private typeObject = ['item', 'explosion', 'wall', 'weather'];
    private Boundary = new Bound();

    public createObjectMap(id: string, options: any) {
        this.id = id;
        this.type = options.type;
        this.is_active = options.is_active;
        this.properties = options.properties;

    }

    /*
    * Generate data object random di maps
    * type object [Item, Explosion, Wall, Weather]
    * @return Array<[any]> 
    **/
    public setRandomObjectMap() {
        let data: Array<any> = []; 
        let properties: string;
        let minPoint = this.minPoint;
        let maxPoint = this.maxPoint;
        let types = this.typeObject;

        for (let i = 0; i < this.totalDataRand; i++) {
            // type random
            let randomType:string = types[Math.floor(Math.random() * types.length)];
            let numPoints = Math.floor(Math.random() * (maxPoint - minPoint + 1)) + minPoint;
            let poly: Array<any>;

            const geoJSON = this.Boundary.getRandomPositionByPolygon(this.Boundary.JakartaBounds);
            const coordinates = geoJSON.geometry.coordinates[0];
            const latitudes = coordinates.map(coord => coord[1]);
            const longitudes = coordinates.map(coord => coord[0]);

            let newLat, newLng;
            newLat = this.Boundary.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes));
            newLng = this.Boundary.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes));

            switch (randomType) {
                case "item":
                    properties = JSON.stringify(Object.assign(new Circle(), {
                        lat: newLat,
                        long: newLng,
                        radius: Math.floor(Math.random() * 1000),
                        speed: Math.floor(Math.random() * 100),
                        health: Math.floor(Math.random() * 100),
                        armor: 0,
                    }))
                    break;
                case "explosion":
                    properties = JSON.stringify(Object.assign(new Circle(), {
                        lat: newLat,
                        long: newLng,
                        radius: Math.floor(Math.random() * 1000),
                    }))
                    break;
                case "wall":

                    poly = [];

                    poly = this.Boundary.createRandomPolyline({
                        lat: this.Boundary.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes)),
                        lng: this.Boundary.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes)),
                    }, numPoints, 1_000);

                    properties = JSON.stringify(Object.assign(new Poly(), {
                        type: 'polyline',
                        poly: poly,
                    }));
                    break;
                case "weather":
                    poly = [];

                    poly = this.Boundary.createRandomPolygon({
                        lat: this.Boundary.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes)),
                        lng: this.Boundary.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes)),
                    }, numPoints, 1_000);

                    properties = JSON.stringify(Object.assign(new Poly(), {
                        type: 'polygon',
                        poly: poly,
                    }));
                    break;
                default:
                    console.log("Item not found");
                    break;
            }

            let id = Math.floor(Math.random() * 1000);
            let row: ObjectMap = new ObjectMap();
            row.id = id.toString();
            row.type = randomType;
            row.is_active = true;
            row.properties = properties;

            data.push(row);
        }
        return data;
    }
}