import express from "express";
import os from 'os'
import cluster from "cluster";
import log4js from 'log4js';
import * as dotenv from 'dotenv' // ver https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import session from "express-session";
import passport from "passport";

dotenv.config()

log4js.configure({
    appenders: {
      miLoggerConsole: { type: 'console' },
      miLoggerFile: { type: 'file', filename: 'info.log' }
    },
    categories: {
      default: { appenders: ['miLoggerConsole'], level: 'all' },
      archivo: { appenders: ['miLoggerFile'], level: 'error' },
      archivo: { appenders: ['miLoggerFile'], level: 'fatal' }    
    }
  });

  
const logger = log4js.getLogger()
logger.level = 'all'
  
const loggerArchivo = log4js.getLogger('archivo')

import "../database/connectdb.js"
import usersRouter from "./routes/users.routes.js";
import productsRouter from "./routes/products.routes.js";
import cartRtouter from "./routes/shoppingCart.routes.js"
import sessionRouter from "./routes/session.routes.js"

const MODOINICIOSERVER = process.env.MODOINICIOSERVER || FORK

if (MODOINICIOSERVER == 'CLUSTER') 
{
    if (cluster.isPrimary) {
        logger.info(`PID PRIMARIO ${process.pid}`)
        const numCPUs = os.cpus().length;
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
        }

        cluster.on('exit', (worker, code, signal) => {
            logger.info(`Worker ${worker.process.pid} died`)             
            cluster.fork()
        })
    } else {
        try {
            const app = express()

            app.use(express.json())
            app.use(express.static("public"))
            app.use(session)

            app.use(usersRouter)
            app.use(productsRouter)        
            app.use(cartRtouter)  
            app.use(sessionRouter)


            app.listen(8080, () => {
                logger.info(`Conectado al puerto  8080 worker ${process.pid}`);
              });

        
        }  catch (error){
            loggerArchivo.fatal('Algo falló ' + error)
        }     
   
    }
}
else
{
    try {
        const app = express()
        app.use(express.json())
        app.use(express.static("public"))


        app.use(session({
            secret: 'palabrasecreta',
            resave: false,
            saveUninitialized: false,
            name : 'nombre-secreto-x'
        }) )

        app.use(usersRouter)
        app.use(productsRouter)        
        app.use(cartRtouter)
        app.use(sessionRouter)        
        
        app.listen(8080, () => {
            logger.info(`Conectado al puerto  8080`);
          });
 
    }  catch (error){
        loggerArchivo.fatal('Algo falló al crear el servidor : ' + error)
    }  
}    
