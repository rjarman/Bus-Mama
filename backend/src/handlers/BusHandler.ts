import { Request, Response } from 'express';
import { Handler } from '../templates/Interfaces';
import { Database } from '../libs/Database';
import { BusModel } from '../libs/Schema';

export class Bus implements Handler {
  database: any;
  databaseConnector(databaseConnector: Database): void {
    this.database = databaseConnector;
  }

  private __requestHandler(req: Request) {
    let requestData: any = {
      GET: {
        method: this.__getBusData(req),
        code: 200,
      },
      POST: {
        method: this.__updateBusData(req),
        code: 201,
      },
    };
    return requestData[req.method];
  }

  private __getBusData(req: Request) {
    if (req.query.busId)
      return this.database.read(BusModel, { busId: req.query.busId });
    return this.database.read(BusModel);
  }

  /**
   * @TODO change req.body format for updateOne's third parameter
   */
  private __updateBusData(req: Request) {
    return this.database.updateOne(
      BusModel,
      { busId: req.body.busId },
      { gpsTime: Date.now() },
      false
    );
  }

  router() {
    return async (req: Request, res: Response) => {
      res.status(this.__requestHandler(req).code).json({
        data: await this.__requestHandler(req).method,
      });
    };
  }
}
