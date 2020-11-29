import bodyParser = require('body-parser');
import { Request, Response } from 'express';

export const BodyParser = (() => {
  return bodyParser.json();
})();

export const BodyParserURLEncoded = (() => {
  return bodyParser.urlencoded({ extended: true });
})();

export const Permissions = (req: Request, res: Response, next: Function) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
  next();
};
