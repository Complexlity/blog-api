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




app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser())
app.use(express.json());
const corsConfig = {
  origin: [
    "https://blog-hed03m1mq-complexlity.vercel.app",
    "http://localhost:3000",
    "https://blog-cms-git-cors-complexlity.vercel.app",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsConfig));
app.use((req, res, next) => {
      res.set({
        "content-security-policy":
          "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        "cross-origin-embedder-policy": "require-corp",
        "cross-origin-opener-policy": "same-origin",
        "cross-origin-resource-policy": "same-origin",
        "x-dns-prefetch-control": "off",
        "x-frame-options": "SAMEORIGIN",
        "strict-transport-security": "max-age=15552000; includeSubDomains",
        "x-download-options": "noopen",
        "x-content-type-options": "nosniff",
        "origin-agent-cluster": "?1",
        "x-permitted-cross-domain-policies": "none",
        "referrer-policy": "no-referrer",
        "x-xss-protection": "0",
        "access-control-allow-origin":
          "https://blog-cms-git-cors-complexlity.vercel.app",
        vary: "Origin",
        "access-control-allow-credentials": "true",
        "Content-Type": "application/json; charset=utf-8",
      });
  next()
})
app.use('/api/v1', api);


app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'Thank You For using Complex blog api',
  });
});


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
