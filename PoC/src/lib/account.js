import axios from 'axios';
import { generateXVC } from '../util.js';
import DefaultConfig from '../config.js';

export class AccountManager {
  constructor() {
    this.config = DefaultConfig;
    this.webClient = axios.create({
      baseURL: 'https://katalk.kakao.com/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'A': `win32/${this.config.appVersion}/ko`,
        'X-VC': generateXVC(),
        'User-Agent': `KT/${this.config.appVersion} Wd/${this.config.osVersion} ko`,
        'Accept': '*/*',
        'Accept-Language': 'ko',
      },
    });
  }

  async login(email, password, deviceUuid, deviceName) {
    const params = new URLSearchParams({
      email: email,
      password: password,
      device_uuid: deviceUuid,
      permanent: 'true',
      os_version: this.config.osVersion,
      device_name: deviceName,
    });

    const res = await this.webClient.post('/win32/account/login.json', params);
    return res.data;
  }
}
