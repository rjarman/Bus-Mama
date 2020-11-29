/**
 * @category Server interfaces
 */

import { RequestHandler } from 'express';
import { Database } from '../libs/Database';

interface Type<T> extends Function {
  new (...args: any[]): T;
}
export interface HandlerModule {
  path: string;
  handler: Type<any>;
}
export interface ServerArg {
  middleware: RequestHandler[];
  assetsPath: string[];
  handlerModule: HandlerModule[];
}
export interface Handler {
  database: any;
  databaseConnector(databaseConnector: Database): void;
  router(): RequestHandler;
}

/**
 * @category Profile interfaces
 */

interface Message {
  send: {
    date?: number;
    message: string;
  };
  reply: {
    date?: number;
    message: string;
  };
  tag?: string;
}
export interface Profile {
  email: string;
  name: string;
  image: string;
  password: object;
  message: Message;
}

/**
 * @category Bus interfaces
 */

interface Location {
  coordinates?: [number];
}

interface Departure {
  from?: string;
  to?: string;
  startTime?: string;
  endTime?: string;
}

export interface BusInterface {
  busId: string;
  location: Location;
  gpsTime: number;
  departure: Departure;
  image: string;
  description: string;
}
