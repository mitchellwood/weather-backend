import { Controller, Get } from '@nestjs/common';
import * as d3vor from 'd3-geo-voronoi';
import * as d3geo from 'd3-geo';

var clip = require('geojson-clip-polygon');

// FOR TESTING
const fs = require('fs');
const mysql = require('mysql2/promise');
const jsonData = JSON.parse(fs.readFileSync('./src/assets/points.geojson', 'utf-8'));
const clipperData = JSON.parse(fs.readFileSync('./src/assets/australia_detailed.json', 'utf-8'));


@Controller('weather')
export class WeatherController {
    @Get('voronoi')
    async getVoronoi() {
        const con = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'weather'
        });
        const [data, fields] = await con.query(`
            SELECT DISTINCT * 
            FROM observations 
            WHERE obs_timestamp > '2020-01-25 00:00:00' AND obs_timestamp < '2020-01-26 00:00:00'
        `);
        console.log(data);

        return jsonData.features.map(feature => {
            const station_id = feature.properties.station_id;
            const row = data.find(row => row.station_id === station_id)
            console.log(row)
            return {
                ...feature,
                properties: {
                    ...feature.properties,
                    ...row
                }
            }
        });
    }

    @Get('points')
    getPoints() {
        return jsonData;
    }

    @Get('newvoronoi')
    getNewVoronoi() {
        const newData = {
            ...jsonData,
            features: jsonData.features.map(x => x.geometry)
        }
        // console.log(jsonData)
        const vor =  d3vor.geoVoronoi()(jsonData.features.map(x => x.geometry));
        console.log(vor.polygons())
        return vor.polygons().features.map(x => d3geo.geoPath().projection(d3geo.geoMercator())(x))
        // console.log(geojson)
        // return geojson;
    }
}
