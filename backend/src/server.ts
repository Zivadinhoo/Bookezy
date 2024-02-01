import 'dotenv/config';
import env from './util/validateEnv';
import mongoose from 'mongoose';
import express from 'express';
import 'colors';
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Inn Explorer');
});

const port = env.PORT;

mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log('Mongoose Connected'.magenta);
    app.listen(port, () => {
      console.log(('Server running on port:' + port).cyan);
    });
  })
  .catch(console.error);
