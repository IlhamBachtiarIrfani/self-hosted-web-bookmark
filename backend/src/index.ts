import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/index';
import multer from 'multer';

const app = express();
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array())

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send("Service is already!")
});

app.use('/', router);


const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
