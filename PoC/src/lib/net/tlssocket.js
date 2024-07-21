import tls from 'tls';
import EventEmitter2 from 'eventemitter2';
import { LocoPacket } from '../packet/index.js';

export class TlsSocket extends EventEmitter2 {
  constructor(host, port) {
    super();
    this.host = host;
    this.port = port;
    this.socket = null;
  }

  isConnected() {
    return this.socket !== null;
  }

  async connect() {
    this.socket = tls.connect({ host: this.host, port: this.port, timeout: 0 });
    this.socket.on('data', (data) => {
      const packet = LocoPacket.from(data);
      this.emit('packet', packet);
    });
  }

  async write(data) {
    if (!this.isConnected()) {
      throw new Error('[TlsSocket::write] socket is not connected.');
    }

    this.socket.write(data);
  }

  disconnect() {
    if (this.isConnected()) {
      this.socket.end();
    }
  }
}
