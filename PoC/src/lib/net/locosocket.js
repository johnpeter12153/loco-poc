import net from 'net';
import EventEmitter2 from 'eventemitter2';
import { LocoPacket } from '../packet/index.js';
import { log } from '../../log.js';

export class LocoSocket extends EventEmitter2 {
  constructor(host, port, cryptor) {
    super();
    this.host = host;
    this.port = port;
    this.cryptor = cryptor;
    this.socket = null;
    this.buffer = Buffer.alloc(0);
    this.chunk = Buffer.alloc(0);
  }

  isConnected() {
    return this.socket !== null;
  }

  async handshake() {
    const encryptedAesKey = this.cryptor.encryptAesKey();
    const buf = Buffer.alloc(12);
    buf.writeUInt32LE(encryptedAesKey.length, 0);
    buf.writeUInt32LE(16, 4);
    buf.writeUInt32LE(2, 8);

    const packet = Buffer.concat([buf, encryptedAesKey]);

    await this.write(packet);

    log(
      '[+] Handshake packet was successfully sent to ticket server! (no response)'
    );
    console.log();
  }

  async connect() {
    this.socket = net.connect({ host: this.host, port: this.port });
    this.socket.on('data', (chunk) => {
      this.decryptChunk(chunk);
      this.processBlock();
    });

    await this.handshake();
  }

  async write(data) {
    if (!this.isConnected()) {
      throw new Error('[LocoSocket::write] socket is not connected.');
    }

    this.socket.write(data);
  }

  decryptChunk(chunk) {
    this.chunk = Buffer.concat([this.chunk, chunk]);

    try {
      while (this.chunk.length > 0) {
        const len = this.chunk.readUInt32LE(0);

        if (this.chunk.length < len + 4) break;

        const iv = this.chunk.subarray(4, 20);
        const block = this.cryptor.aesDecrypt(
          this.chunk.subarray(20, len + 4),
          iv
        );
        this.buffer = Buffer.concat([this.buffer, block]);
        this.chunk = this.chunk.subarray(len + 4);
      }
    } catch (err) {
      console.log(err);
    }
  }

  processBlock() {
    if (this.buffer.length === 0) return;

    // body의 데이터 길이가 안맞으면 body를 더 받아와야 함.
    if (this.buffer.readUint32LE(18) > this.buffer.subarray(22).length) return;

    try {
      while (this.buffer.length > 0) {
        const packet = LocoPacket.from(this.buffer);
        this.buffer = this.buffer.subarray(packet.size);

        this.emit('packet', packet);
      }
    } catch (err) {
      console.log(err);
    }
  }

  disconnect() {
    if (this.isConnected()) {
      this.socket.end();
    }
  }
}
