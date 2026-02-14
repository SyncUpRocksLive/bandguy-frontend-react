import express, { Express, Request, Response, json } from 'express';
import { readFile } from 'fs';
import { useChannels, channels } from './controller-channels'
import { useMessages, message_queue } from './controller-message'
import { useSets } from './controller-sets';
import { useLogin } from './controller-login';
var cookieParser = require('cookie-parser')

const app: Express = express();

app.use(json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ channels: channels, message_queue: message_queue });
});

useChannels(app);
useMessages(app);
useSets(app);
useLogin(app);

app.listen(9001, () => console.log('Example app is listening on port 9001.'));


