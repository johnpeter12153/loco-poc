export class UserInfo {
  constructor(info) {
    this.userId = info.userId;
    this.countryIso = info.countryIso;
    this.countryCode = info.countryCode;
    this.accountId = info.accountId;
    this.accessToken = info.access_token;
    this.refreshToken = info.refresh_token;
    this.tokenType = info.token_type;
    this.autoLoginAccountId = info.autoLoginAccountId;
    this.displayAccountId = info.displayAccountId;
    this.mainDeviceAgentName = info.mainDeviceAgentName;
    this.mainDeviceAppVersion = info.mainDeviceAppVersion;
  }
}
