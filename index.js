import express from 'express'
const app = express();
// app.use(express.json());

import { verifyKeyMiddleware } from 'discord-interactions'

const port = process.env.PORT;
const publicKey = process.env.discordPublicKey

app.get('/api/interactions', (req, res) => {
  res.send('gaming goonery music bot')
})

app.post('/api/interactions', verifyKeyMiddleware(publicKey), (req, res) => {
  if(req.json.type === 1) res.send({ type: 1 })
  console.log('Interactions endpoint');
  console.log('INTERACTIONS REQUEST', req);
});

app.listen(port, () => {
  console.log(`Started on ${port}.`);
});
