import { Schema, type } from "@colyseus/schema";
import { Position } from "./Position";
import { Bound } from "./Bounds";
import axios from "axios";

export class Player extends Schema {
    @type('string') id !: string;
    @type('number') idReal !: number;
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
        let iteration = 1;

        let newLat, newLng;
        newLat = this.getRandomInRange(Math.min(...latitudes), Math.max(...latitudes));
        newLng = this.getRandomInRange(Math.min(...longitudes), Math.max(...longitudes));
        let result = this.checkLayerType(newLat, newLng);
        // while (result != 'land') {

        //     result = this.checkLayerType(newLat, newLng);
        //     console.log(`Iteration ${iteration}: ${result}`);
        //     iteration++;
        // }

        // if (result === 'land') {
            this.id = id;
            this.idReal = 0;
            this.name = options.name;
            this.email = options.email;
            this.health = 100;
            this.speed = 100;
            this.points = 0;
            // ancol
            this.position.lat = -6.119809404589656;
            this.position.long = 106.84858694620581;
        // }

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

    checkLayerType(lat: number, lng: number): any {
        // Buat URL Overpass API dengan kueri untuk memeriksa jenis lapisan di titik tersebut
        var url = `https://overpass-api.de/api/interpreter?data=[out:json];(node(around:1,${lat},${lng});way(around:1,${lat},${lng});relation(around:1,${lat},${lng}););out;`;

        // Panggil API dengan menggunakan Axios
        let result;
        axios.get(url).then(function(response) {
            let data = response.data;
            // Cek jenis lapisan yang ditemukan
            if (data.elements.length > 0) {
                var firstElement = data.elements[0];
                var layerType = firstElement.type; // Jenis lapisan (node, way, relation)

                // Lakukan sesuatu berdasarkan jenis lapisan yang ditemukan
                if (layerType === 'node' || layerType === 'way') {
                    result = 'land';
                } else if (layerType === 'relation') {
                    result = 'water';
                } else {
                    result = 'unknown';
                }
            } else {
                console.log('Tidak ada data yang ditemukan di titik tersebut');
                result = 'not found';
            }
        })
        .catch(function(error) {
            console.log('Error:', error);
        });

        return result;
    }

    plotObject() {
        //
    }

    attack() {
        //
    }

}
