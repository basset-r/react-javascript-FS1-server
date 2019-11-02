import dotenv = require('dotenv');
// will add .env value in process.env (load before imports)
dotenv.config();

import * as bodyParser from 'body-parser';
import cors = require('cors');
import * as express from 'express';
import helmet = require('helmet');
import 'reflect-metadata';
import { createConnection } from 'typeorm';
// tslint:disable-next-line: import-name
import RoutesIndex from './routes/index';

const socketServer = require('ws').Server;
const crypto = require('crypto');

// build typeorm config file
const fs = require('fs');
const pgConnectionStringParser = require('pg-connection-string');

const databaseUrl = process.env.DATABASE_URL;

let connectionOptions : any = {};
if (databaseUrl !== undefined) {
  connectionOptions = pgConnectionStringParser.parse(databaseUrl);
}

// build typeorm here, because we don't manage db url in prod
const typeOrmOptions = {
  type: process.env.DB_TYPE || 'postgres',
  name: connectionOptions.name,
  host: connectionOptions.host || process.env.DB_HOST,
  port: connectionOptions.port || process.env.DB_PORT,
  username: connectionOptions.user || process.env.DB_USERNAME,
  password: connectionOptions.password || process.env.DB_PASSWORD,
  database: connectionOptions.database || process.env.DB_NAME,
  synchronize: true,
  logging: process.env.DB_LOGGING,
  entities: [
    process.env.ENTITIES,
  ],
  migrations: [
    process.env.MIGRATIONS,
  ],
  subscribers: [
    process.env.SUBSCRIBERS,
  ],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

const json = JSON.stringify(typeOrmOptions, null, 2);
fs.writeFile(process.env.ORM_CONFIG, json, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('TyperOrm config file created');

  console.log('Starting express...');

  const connectedUsers = [];

  createConnection().then(async (connection) => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    app.use('/', RoutesIndex);

    // start express server
    const server = app.listen(process.env.PORT);

    console.log(`Express server has started on port ${process.env.PORT}.`);

    const wss = new socketServer({ server });

    // init Websocket ws and handle incoming connect requests
    wss.on('connection', (ws) => {
      ws.id = crypto.randomBytes(8).toString('hex');
      ws.on('message', (message : string) => {
        if (message.startsWith('newName: ')) {
          ws.id = message.slice(9);
        } else {
          wss.clients.forEach((client) => {
            client.send(`${ws.id}: ${message}`);
          });
        }
      });
      ws.send(`Connected at: ${ new Date()}`);
    });
  }).catch(error => console.log(error));

});
