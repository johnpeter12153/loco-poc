import crypto from 'crypto';
import DefaultConfig from '../config.js';

export class Cryptor {
  constructor() {
    this.aesAlgo = 'aes-128-cfb';
    this.aesKey = crypto.randomBytes(16);
    this.rsaPubKey = DefaultConfig.publicKey;
  }

  aesEncrypt(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.aesAlgo, this.aesKey, iv);
    return Buffer.concat([iv, cipher.update(data), cipher.final()]);
  }

  aesDecrypt(data, iv) {
    const decipher = crypto.createDecipheriv(this.aesAlgo, this.aesKey, iv);
    return Buffer.concat([decipher.update(data), decipher.final()]);
  }

  rsaEncrypt(data) {
    return crypto.publicEncrypt(
      {
        key: this.rsaPubKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      data
    );
  }

  encryptAesKey() {
    return this.rsaEncrypt(this.aesKey);
  }
}
