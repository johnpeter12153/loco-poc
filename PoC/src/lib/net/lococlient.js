import { BaseClient } from './baseclient.js';
import { Cryptor } from '../cryptor.js';
import { LocoSocket } from './locosocket.js';

export class LocoClient extends BaseClient {
  constructor(host, port) {
    const cryptor = new Cryptor();
    const socket = new LocoSocket(host, port, cryptor);
    socket.on('packet', (packet) => {
      this.emit(packet.method, packet.body);
    });
    super(socket);

    this.cryptor = cryptor;
    this.packetId = 0;
  }

  async write(data) {
    data.writeUInt32LE(this.packetId++, 0);
    const encrypted = this.cryptor.aesEncrypt(data);

    const header = Buffer.alloc(4);
    header.writeUInt32LE(encrypted.length);
    await super.write(Buffer.concat([header, encrypted]));
  }
}
