import EventEmitter2 from 'eventemitter2';

export class BaseClient extends EventEmitter2 {
  constructor(socket) {
    super();
    this.socket = socket;
  }

  isConnected() {
    return this.socket !== null;
  }

  async connect() {
    await this.socket.connect();
  }

  async write(data) {
    if (this.isConnected()) {
      await this.socket.write(data);
    }
  }

  disconnect() {
    if (this.isConnected()) {
      this.socket.disconnect();
    }
  }
}
