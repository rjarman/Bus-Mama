import mongoose = require('mongoose');
import { DATABASE } from '../config';

export class Database {
  /**
   * This class handles all the database connections!
   */

  private __databaseURL = DATABASE.url;
  private __database: mongoose.Connection;

  constructor() {
    mongoose.connect(this.__databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.__database = mongoose.connection;
    this.__dbError();
  }

  private __dbError(): void {
    this.__database.on('open', () => {
      console.log('Successfully connected to MongoDB!');
    });
    this.__database.on(
      'error',
      console.error.bind(console, 'MongoDB connection error:')
    );
  }

  private __errorHandler(message: string, err: any): void {
    /**
     * @param message is string of details about errors
     * @param err callback error
     */
    console.log(`${message}\n${err}`);
  }

  create(model: mongoose.Model<mongoose.Document, {}>, data: object) {
    /**
     * @param model is mongoose schema model
     * @param data
     * @return
     */
    return model.create(data, (err: any) => {
      if (err) this.__errorHandler('create() cannot add data!\n', err);
      else console.log('Create successfully!');
    });
  }

  updateOne(
    model: mongoose.Model<mongoose.Document, {}>,
    filter: object,
    updateOn: object,
    upsert = true
  ): mongoose.Query<any> {
    /**
         * @param model is mongoose schema model
         * @param filter
         * @param updateOn where to update, takes mongodb query
         * @param upsert is optional default value true
         * @return { n: 1|0, nModified: 0, ok: 1|0 } as Promise

         */
    return model.updateOne(filter, updateOn, { upsert: upsert }, (err) => {
      if (err) this.__errorHandler('updateOne() cannot add data!\n', err);
    });
  }

  read(
    model: mongoose.Model<mongoose.Document, {}>,
    filter = {}
  ): mongoose.Query<any> {
    /**
     * @param model is mongoose schema model
     * @param filter, default is {}
     * @return Promise of all the filtered schema model data
     */
    return model.find(filter, { password: 0 }, (err, res) => {
      if (err) this.__errorHandler('readByFilter() cannot read data!\n', err);
    });
  }

  readPassword(
    model: mongoose.Model<mongoose.Document, {}>,
    filter = {}
  ): Promise<any> {
    /**
     * @param model is mongoose schema model
     * @param filter, default is {}
     * @return Promise of all the filtered schema model data
     */
    return model.find(filter, (err, res) => {
      if (err) this.__errorHandler('readByFilter() cannot read data!\n', err);
    }).exec();
  }
}
