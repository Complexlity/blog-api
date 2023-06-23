import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import * as middlewares from './middlewares/errorHandler'
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import cookieParser from "cookie-parser";


require('dotenv').config();

const app = express();

const corsConfig = {
  origin: [
    "https://blog-hed03m1mq-complexlity.vercel.app",
    "http://localhost:3000",
    "https://blog-cms-git-cors-complexlity.vercel.app/login"
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsConfig));

app.use(morgan('dev'));
app.use(helmet());
  app.use(cookieParser())
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Thank You For using Complex blog api',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
