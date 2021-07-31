import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import helmet from 'helmet';

import routes from './routes';
import { MongoURI } from './config/default.json';

const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());

mongoose.connect(MongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

app.use('/', routes);

app.listen(process.env.PORT || 5000);
