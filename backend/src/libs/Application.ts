import express = require('express');

import { ServerArg, HandlerModule } from '../templates/Interfaces';
import { SERVER } from '../config';
import { Database } from './Database';
import { Router } from 'express';
import { Socket } from './Socket';

export class App {
  /**
   * This class handles all the handlers, middleware, public folders and server creation!
   */

  private __port = SERVER.port;
  private __address = SERVER.address;

  private __database: Database;

  private __app: express.Application;
  private __middleware: express.RequestHandler[];
  private __handlers: HandlerModule[];
  private __assetsPath: string[];

  constructor(serverArg: ServerArg) {
    this.__app = express();
    this.__middleware = serverArg.middleware;
    this.__assetsPath = serverArg.assetsPath;
    this.__handlers = serverArg.handlerModule;

    this.__database = new Database();

    this.__loadMiddleware();
    this.__loadAssets();
    this.__loadHandlers();
  }

  private __loadMiddleware(): void {
    this.__middleware.forEach((middleware) => {
      this.__app.use(middleware);
    });
  }

  private __loadHandlers(): void {
    this.__handlers.forEach((handler) => {
      let handlerObject = new handler.handler();
      handlerObject.databaseConnector(this.__database)
      let redirectLink: Router = Router();
      redirectLink.all(handler.path, handlerObject.router());
      this.__app.use('/', redirectLink);
    });
  }

  private __loadAssets(): void {
    this.__assetsPath.forEach((path) => {
      this.__app.use(express.static(__dirname + path));
    });
  }

  listen(): void {
    const listener = this.__app.listen(this.__port, this.__address, () => {
      console.log('Server started...');
      console.log(`Server Credentials:
            Address: ${this.__address}
            Port: ${this.__port}`);
    });
    new Socket(listener);
  }
}
