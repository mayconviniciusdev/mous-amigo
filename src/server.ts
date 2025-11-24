import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import http from 'http';
import fs from 'fs'

import { requestIntercepter } from './utils/requestIntercepter.js';
import siteRoutes from './routes/site.js'
import adminRoutes from './routes/admin.js'

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(requestIntercepter);
app.use('/admin', adminRoutes);
app.use('/', siteRoutes);

const runServer = (port: number, server: http.Server) => {
  server.listen(port, () => {
    console.log(`🚀 Running at PORT ${port}`)
  })
} 

const regularServer = http.createServer(app);
  let httpPort: number;
  let httpsPort: number;

  if (process.env.NODE_ENV !== 'production') {
    httpPort = 80;
    httpsPort = 443;
  } 
  
  else {
    httpPort = parseInt(process.env.PORT || "9000");
    httpsPort = httpPort;

    let secServer: https.Server | null = null;
    try {
      const options = {
        key: fs.readFileSync(process.env.SSL_KEY as string),
        cert: fs.readFileSync(process.env.SSL_CERT as string),
      };
      secServer = https.createServer(options, app);
    } 
    catch (err) {console.log("⚠ SSL não configurado, iniciando apenas HTTP");}
    runServer(httpPort, regularServer);

    if (secServer) {runServer(httpsPort, secServer);}}