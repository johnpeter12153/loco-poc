import { LocoClient } from './lib/net/index.js';
import { LocoPacketBuilder } from './lib/packet/builder.js';
import DefaultConfig from './config.js';

const config = DefaultConfig;

export class TicketClient extends LocoClient {
  constructor(host, port) {
    super(host, port);
  }

  async checkIn(userId) {
    const data = new LocoPacketBuilder('CHECKIN')
      .add('userId', userId)
      .add('os', config.os)
      .add('ntype', config.ntype)
      .add('appVer', config.appVersion)
      .add('MCCMNC', config.MCCMNC)
      .add('countryISO', config.countryISO)
      .add('useSub', config.useSub)
      .add('lang', config.language)
      .final();

    await this.write(data);
  }
}
