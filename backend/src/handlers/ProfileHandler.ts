import { Request, Response, Router } from 'express';
import { Handler } from '../templates/Interfaces';
import { Database } from '../libs/Database';
import { UserModel } from '../libs/Schema';
import { Crypto } from '../libs/Crypto';

export class Profile implements Handler {
  database: any;

  private isRequested: boolean;

  constructor() {
    this.isRequested = false;
  }

  databaseConnector(databaseConnector: Database): void {
    this.database = databaseConnector;
  }

  private __requestHandler(req: Request) {
    let requestData: any = {
      GET: {
        method: this.__getUserData(req),
        code: 200,
      },
      POST: {
        method: this.__postDataHandler(req),
        code: 201,
      },
      OPTIONS: {
        method: this.__postDataHandler(req),
        code: 201,
      },
    };
    if (req.method === 'OPTIONS') this.isRequested = false;
    return requestData[req.method];
  }

  private __getUserData(req: Request) {
    if (Object.keys(req.query).length)
      return this.database.read(UserModel, { email: req.query.email });
    return this.database.read(UserModel);
  }

  /**
   * @TODO change req.body format
   */
  private __postDataHandler(req: Request) {
    if (!this.isRequested) {
      if (req.body.reqType === 'addMessage') {
        this.isRequested = true;
        return this.database.updateOne(
          UserModel,
          { email: req.body.serverData.email },
          { $push: { messages: req.body.serverData.messages } }
        );
      }
      if (req.body.reqType === 'deleteMessage') {
        this.__deleteUserConversations(req);
      }
    }
  }

  /**
   * @TODO change deleteMessageList format
   */
  private __deleteUserConversations(req: Request) {
    if (req.body.deleteMessageList)
      return this.database.updateOne(
        UserModel,
        { email: req.body.email },
        { $pull: { messages: { _id: { $in: [req.body.deleteMessageList] } } } },
        false
      );
    return this.database.updateOne(
      UserModel,
      { email: req.body.email },
      { $unset: { messages: [] } },
      false
    );
  }

  router() {
    return async (req: Request, res: Response) => {
      try {
        if (
          req.header('Content-Type')?.split(' ')[0] === 'multipart/form-data;'
        ) {
          this.isRequested = true;
          this.register(req, res);
        } else if (req.body.reqType === 'login') {
          this.isRequested = true;
          console.log(req.body.loginData);
          this.database
            .readPassword(UserModel, { email: req.body.loginData.email })
            .then((data: any) => {
              data.forEach((datum: any) => {
                if (
                  new Crypto().decryption(datum.password.buffer) ===
                  req.body.loginData.password
                ) {
                  res.status(200).json({
                    status: 'ok',
                  });
                }
              });
            });
        } else {
          res.status(this.__requestHandler(req).code).json({
            data: await this.__requestHandler(req).method,
          });
        }
      } catch (e) {
        console.log(e);
      }
    };
  }

  private register(req: Request, res: Response) {
    let count: number;
    let userInfo = {
      userName: '',
      email: '',
      password: '',
      imagePath: '',
    };

    let form = require('formidable');
    form = new form.IncomingForm();
    form.parse(req);
    form.on('fileBegin', (name: any, file: { path: string; name: any }) => {
      count = 0;
      file.path = `${__dirname}/../../public/assets/profiles/${file.name}`;
    });
    form.on('field', (fieldName: string, fieldValue: string, file: any) => {
      if (fieldName === 'userName') {
        userInfo.userName = JSON.parse(fieldValue);
      } else if (fieldName === 'email') {
        userInfo.email = JSON.parse(fieldValue);
      } else if (fieldName === 'password') {
        userInfo.password = JSON.parse(fieldValue);
      } else if (fieldName === 'imagePath') {
        userInfo.imagePath = JSON.parse(fieldValue);
      }
      if (
        userInfo.userName !== '' &&
        userInfo.email !== '' &&
        userInfo.password !== '' &&
        userInfo.imagePath !== '' &&
        count === 0
      ) {
        const data = {
          email: userInfo.email,
          name: userInfo.userName,
          password: new Crypto().encryption(userInfo.password),
          image: 'http://localhost:3000/assets/profiles/' + userInfo.imagePath,
        };
        this.database.updateOne(UserModel, { email: data.email }, data);
        res.status(201).json({
          status: 'ok',
        });
        count++;
      }
    });
    form.on('error', (err: any) => {
      console.log(err);
    });
    form.on('end', () => {
      count = 0;
      console.log('finished');
    });
  }
}
