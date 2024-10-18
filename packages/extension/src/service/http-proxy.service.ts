// typescript

import * as express from 'express';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';

const app = express();

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://www.example.org/api',
    changeOrigin: true,
  }),
);

app.listen(3000);

// proxy and keep the same base path "/api"
// http://127.0.0.1:3000/api/foo/bar -> http://www.example.org/api/foo/ba