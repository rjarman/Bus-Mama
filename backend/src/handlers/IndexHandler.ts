import { Request, Response, Router } from 'express';
import { Handler } from '../templates/Interfaces';
import { Database } from '../libs/Database';

export class Index implements Handler {
  database: any;
  databaseConnector(databaseConnector: Database): void {
    this.database = databaseConnector;
  }

  router() {
    return (req: Request, res: Response) => {
      res.status(200).json({
        message: "Welcome to Rafsun's Server!",
      });
    };
  }
}
