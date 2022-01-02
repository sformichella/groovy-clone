const express = require('express');
const app = express();
app.use(express.json());

const port = process.env.port;

app.post('/api/interactions', (req, res) => {
  console.log('Interactions endpoint');
});

app.listen(port, () => {
  console.log(`Started on ${port}.`);
});
