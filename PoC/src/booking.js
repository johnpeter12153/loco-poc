import { BaseClient, TlsSocket } from './lib/net/index.js';
import { LocoPacketBuilder } from './lib/packet/index.js';

export class BookingClient extends BaseClient {
  constructor() {
    const socket = new TlsSocket('booking-loco.kakao.com', 443);
    socket.on('packet', (packet) => {
      if (packet.method === 'GETCONF') {
        this.emit(packet.method, packet.body);
      }
    });
    super(socket);
  }

  async book(userId) {
    const data = new LocoPacketBuilder('GETCONF')
      .add('userId', userId)
      .add('MCCMNC', '999')
      .add('os', 'win32')
      .final();

    await this.write(data);
  }
}
