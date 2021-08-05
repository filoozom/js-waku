import * as protobuf from 'protobufjs/light';

export interface PublicKeyMessagePayload {
  ethDmPublicKey: Uint8Array;
  ethAddress: Uint8Array;
  signature: Uint8Array;
}

const Root = protobuf.Root,
  Type = protobuf.Type,
  Field = protobuf.Field;

/**
 * Message used to communicate the Eth-Dm public key linked to a given Ethereum account
 */
export class PublicKeyMessage {
  private static Type = new Type('PublicKeyMessage')
    .add(new Field('ethDmPublicKey', 1, 'bytes'))
    .add(new Field('ethAddress', 2, 'bytes'))
    .add(new Field('signature', 3, 'bytes'));
  private static Root = new Root()
    .define('messages')
    .add(PublicKeyMessage.Type);

  constructor(public payload: PublicKeyMessagePayload) {}

  public encode(): Uint8Array {
    const message = PublicKeyMessage.Type.create(this.payload);
    return PublicKeyMessage.Type.encode(message).finish();
  }

  public static decode(
    bytes: Uint8Array | Buffer
  ): PublicKeyMessage | undefined {
    const payload = PublicKeyMessage.Type.decode(
      bytes
    ) as unknown as PublicKeyMessagePayload;
    if (!payload.signature || !payload.ethDmPublicKey || !payload.ethAddress) {
      console.log('Field missing on decoded Public Key Message', payload);
      return;
    }
    return new PublicKeyMessage(payload);
  }

  get ethDmPublicKey(): Uint8Array {
    return this.payload.ethDmPublicKey;
  }

  get ethAddress(): Uint8Array {
    return this.payload.ethAddress;
  }

  get signature(): Uint8Array {
    return this.payload.signature;
  }
}

export interface DirectMessagePayload {
  toAddress: Uint8Array;
  message: string;
}

/**
 * Direct Encrypted Message used for private communication over the Waku network.
 */
export class DirectMessage {
  private static Type = new Type('DirectMessage')
    .add(new Field('toAddress', 1, 'bytes'))
    .add(new Field('message', 2, 'string'));
  private static Root = new Root().define('messages').add(DirectMessage.Type);

  constructor(public payload: DirectMessagePayload) {}

  public encode(): Uint8Array {
    const message = DirectMessage.Type.create(this.payload);
    return DirectMessage.Type.encode(message).finish();
  }

  public static decode(bytes: Uint8Array | Buffer): DirectMessage | undefined {
    const payload = DirectMessage.Type.decode(
      bytes
    ) as unknown as DirectMessagePayload;
    if (!payload.toAddress || !payload.message) {
      console.log('Field missing on decoded Direct Message', payload);
      return;
    }
    return new DirectMessage(payload);
  }

  get toAddress(): Uint8Array {
    return this.payload.toAddress;
  }

  get message(): string {
    return this.payload.message;
  }
}