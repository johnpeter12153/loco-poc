import { BSON } from 'bson';

export class LocoPacket {
  constructor(packetId, method, body, size) {
    this.packetId = packetId;
    this.method = method;
    this.body = body;
    this.size = size;
  }

  static from(data) {
    const buf = Buffer.from(data);
    const packetId = buf.readUInt32LE(0);
    const method = buf.subarray(6, 17).toString().replace(/\0/g, '');
    const bodyLength = buf.readUInt32LE(18);
    const body = BSON.deserialize(buf.subarray(22, 22 + bodyLength));

    return new LocoPacket(packetId, method, body, buf.length);
  }

  toBuffer() {
    const bsonBody = BSON.serialize(this.body);
    const header = Buffer.alloc(22);
    header.writeUint32LE(0, 0);
    header.writeUint16LE(0, 4);
    header.write(this.method, 6, 'utf-8');
    header.writeUInt8(0, 17);
    header.writeUInt32LE(bsonBody.length, 18);

    return Buffer.concat([header, bsonBody]);
  }
}
