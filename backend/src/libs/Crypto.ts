import crypto = require('crypto');
import { ENCRYPTION } from '../config';

export class Crypto {
  /**
   * This class handles all the encryption process!
   */

  private __cipherAlgorithm: string;
  private __generatedHash: string;

  constructor() {
    this.__cipherAlgorithm = ENCRYPTION.cipherAlgorithm;
    this.__generatedHash = crypto
      .createHash(ENCRYPTION.algorithm)
      .update(String(ENCRYPTION.key))
      .digest("base64")
      .substr(0, 32);
  }

  encryption(data: string): Buffer {
    let tempData = Buffer.from(data, 'binary');
    let initializationVector = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(
      this.__cipherAlgorithm,
      this.__generatedHash,
      initializationVector
    );
    let result = Buffer.concat([
      initializationVector,
      cipher.update(tempData),
      cipher.final(),
    ]);

    return result;
  }

  decryption(data: Buffer): string {
    let initializationVector = data.slice(0, 16);
    let tempData: any = data.slice(16);
    let decipher = crypto.createDecipheriv(
      this.__cipherAlgorithm,
      this.__generatedHash,
      initializationVector
    );
    let result = Buffer.concat([decipher.update(tempData), decipher.final()]);

    return result.toString('binary');
  }
}
