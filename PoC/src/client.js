import { AccountManager } from './lib/account.js';
import { BookingClient } from './booking.js';
import { TicketClient } from './ticket.js';
import { CarriageClient } from './carriage.js';
import { UserInfo } from './model/index.js';
import { log } from './log.js';

export class TalkClient {
  constructor() {
    this.accountManager = new AccountManager();
    this.userInfo = null;
  }

  async login(email, password, deviceUuid, deviceName) {
    log('[+] Sending HTTPS request to login server...');

    const loginRes = await this.accountManager.login(
      email,
      password,
      deviceUuid,
      deviceName
    );

    log('[+] HTTPS request was successfully sent to login server!');
    console.log(loginRes);
    console.log();

    this.userInfo = new UserInfo(loginRes);
    await this.book(this.userInfo.userId);
  }

  async book(userId) {
    const bookingClient = new BookingClient();
    bookingClient.on('GETCONF', async (body) => {
      const host = body.ticket.lsl[0];
      const port = body.wifi.ports[0];

      log('[+] GETCONF packet was successfully sent to booking server!');
      console.log(`Ticket address: ${host}:${port}`);
      console.log();

      bookingClient.disconnect();

      await this.checkIn(host, port, userId);
    });

    await bookingClient.connect();

    log('[+] Sending GETCONF packet to booking server...');
    await bookingClient.book(userId);
  }

  async checkIn(host, port, userId) {
    const ticketClient = new TicketClient(host, port);
    ticketClient.on('CHECKIN', async (body) => {
      const host = body.host;
      const port = body.port;

      log('[+] CHECKIN packet was successfully sent to ticket server!');
      console.log(`Carriage address: ${host}:${port}`);
      console.log();

      ticketClient.disconnect();

      await this.carriage(host, port);
    });

    await ticketClient.connect();

    log('[+] Sending CHECKIN packet to ticket server...');
    await ticketClient.checkIn(userId);
  }

  async carriage(host, port) {
    const carriageClient = new CarriageClient(host, port);
    carriageClient.on('LOGINLIST', async (body) => {
      log('[+] LOGINLIST packet was successfully sent to carriage server!');

      carriageClient.sendMsg(391668716708953, 'Hello, Loco!');
    });
    carriageClient.onAny((event, value) => {
      console.log(event, value);
      console.log();
    });

    await carriageClient.connect();

    log('[+] Sending LOGINLIST packet to carriage server...');
    await carriageClient.loginList(this.userInfo);
  }

  // ... 이제 커맨드들을 작성하면 된다! (커맨드를 보낼 때 carriage가 연결돼있는지 확인할 것..)
}
