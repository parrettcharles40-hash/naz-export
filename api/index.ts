import express from 'express';
import cors from 'cors';
import { apiRouter } from './apiRouter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount apiRouter both with and without /api prefix to support different Vercel rewrite strategies
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default function handler(req: any, res: any) {
  return app(req, res);
}

export { app, apiRouter };
