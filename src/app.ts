import 'dotenv/config';
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Inn Explorer');
});

export default app;
