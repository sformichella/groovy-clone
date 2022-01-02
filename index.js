const express = require('express');
const app = express();
// app.use(express.json());

import { verifyKeyMiddleware } from 'discord-interactions-js'

const {
  verifyKeyMiddleware: verify
} = require('discord-interactions-js')

const port = process.env.port;
const publicKey = process.env.discordPublicKey

app.post('/api/interactions', verify(publicKey), (req, res) => {
  if(req.json.type === 1) res.send({ type: 1 })
  console.log('Interactions endpoint');
});

app.listen(port, () => {
  console.log(`Started on ${port}.`);
});
