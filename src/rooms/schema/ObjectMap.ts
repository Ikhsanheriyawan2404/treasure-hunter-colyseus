import { Schema, type } from "@colyseus/schema";
import { Circle } from "./Circle";
import { Poly } from "./Poly";


export class ObjectMap extends Schema {

    @type('string') id !: string;
    @type('string') type !: string;
    @type('boolean') is_active !: boolean;
    @type('string') properties !: string;

    private minPoint = 1; // Jumlah point/titik di maps
    private maxPoint = 5; // Jumlah point/titik di maps
    private totalDataRand = 100; // Jumlah point/titik di maps
    private typeObject = ['item', 'explosion', 'wall', 'weather'];

    public createObjectMap(id: string, options: any) {
        this.id = id;
        this.type = options.type;
        this.is_active = options.is_active;
        this.properties = options.properties;
    }

    /*
    * Generate data random for object on maps
    * [Items, Enemies, Obstacles]
    * return Array<[]> 
    **/
    public setRandomObjectMap() {
        /**
        * Generate data random for object on maps
        * [Items, Enemies, Obstacles]
        */
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

            switch (randomType) {
                case "item":
                    properties = JSON.stringify(Object.assign(new Circle(), {
                        lat: Math.floor(Math.random() * 100),
                        long: Math.floor(Math.random() * 100),
                        radius: Math.floor(Math.random() * 100),
                        speed: Math.floor(Math.random() * 100),
                        health: Math.floor(Math.random() * 100),
                        armor: 0,
                    }))
                    break;
                case "explosion":
                    properties = JSON.stringify(Object.assign(new Circle(), {
                        lat: Math.floor(Math.random() * 100),
                        long: Math.floor(Math.random() * 100),
                        radius: Math.floor(Math.random() * 100),
                    }))
                    break;
                case "wall":

                    poly = [];
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
                    break;
                case "weather":
                    poly= [];
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
                    break;
                default:
                    console.log("Item not found");
                    break;
            }

            let id = Math.floor(Math.random() * 100);
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