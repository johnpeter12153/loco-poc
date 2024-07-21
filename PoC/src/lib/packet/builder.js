import { LocoPacket } from './packet.js';

class LocoPacketBuilder {
  constructor(method) {
    this.method = method;
    this.body = {};
  }

  add(key, value) {
    this.body[key] = value;
    return this;
  }

  final() {
    return new LocoPacket(0, this.method, this.body).toBuffer();
  }
}

export { LocoPacketBuilder };
