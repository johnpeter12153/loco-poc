import { TalkClient } from './src/client.js';

const { EMAIL, PASSWORD, DEVICE_UUID, DEVICE_NAME } = process.env;
const client = new TalkClient();
await client.login(EMAIL, PASSWORD, DEVICE_UUID, DEVICE_NAME);
