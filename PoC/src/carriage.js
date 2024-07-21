import { BSON } from 'bson';
import { LocoClient } from './lib/net/index.js';
import { LocoPacketBuilder } from './lib/packet/builder.js';
import DefaultConfig from './config.js';

const config = DefaultConfig;

export class CarriageClient extends LocoClient {
  constructor(host, port) {
    super(host, port);
  }

  async loginList(userInfo) {
    const data = new LocoPacketBuilder('LOGINLIST')
      .add('prtVer', '1.0')
      .add('appVer', config.appVersion)
      .add('os', config.os)
      .add('lang', config.language)
      .add('oauthToken', userInfo.accessToken)
      .add('duuid', process.env.DEVICE_UUID)
      .add('ntype', config.ntype)
      .add('MCCMNC', config.MCCMNC)
      .add('pcst', 1)
      .add('chatIds', [])
      .add('maxIds', [])
      .add('lastTokenId', 0)
      .add('lbk', 0)
      .add('rp', null)
      .final();

    await this.write(data);
  }

  async sendMsg(chatId, msg, type = 1) {
    const data = new LocoPacketBuilder('WRITE')
      .add('chatId', chatId)
      .add('msg', msg)
      .add('msgId', 0)
      .add('type', type)
      .final();

    await this.write(data);
  }
}
