import * as grpc from 'grpc';
import * as fs from 'fs';
import * as path from 'path';
import * as byteBuffer from 'bytebuffer';
import * as caller from 'grpc-caller';
import { Duplex } from 'stream';

export interface DecodePayReqResponse {
  destination: string;
  payment_hash: string;
  num_satoshis: string;
}

export interface Invoice {
  memo: string;
  receipt: Buffer;
  r_preimage: Buffer;
  r_hash: Buffer;
  value: string;
  settled: boolean;
  creation_date: string;
  settle_date: string;
  payment_request: string;
  description_hash: Buffer;
  expiry: string;
}

export type InvoiceStreamingMessage = Invoice;

export interface LookupInvoiceRequest {
  r_hash_str?: string;
  r_hash?: Buffer;
}

export type LookupInvoiceResponse = Invoice;

export interface GetInfoReponse {
  alias: string;
  num_pending_channels: number;
  num_active_channels: number;
  num_peers: number;
  block_height: number;
  block_hash: string;
  synced_to_chain: boolean;
  testnet: boolean;
  chains: Array<string>;
  uris: Array<string>;
}

export interface SendPaymentResponse {
  payment_error: string;
  payment_preimage: Buffer;
  payment_route: {
    total_time_lock: number;
    total_fees: string;
    total_amt: string;
    hops: Array<any>;
  };
}

export interface AddInvoiceResponse {
  r_hash: string;
  payment_request: string;
}

export class LightningNetworkClient extends Duplex {
  client: any;
  constructor() {
    super({ objectMode: true, highWaterMark: 1024 });

    // less hardcoded plz
    const lndCert = fs.readFileSync('/root/.lnd/tls.cert');
    const credentials = grpc.credentials.createSsl(lndCert);
    const PROTO_PATH = path.resolve(__dirname, '../protos/rpc.proto');
    const client = caller('localhost:10009', PROTO_PATH, 'Lightning', credentials);
    this.client = client;
  }

  async getInfo(): Promise<GetInfoReponse> {
    return this.client.getInfo({});
  }

  async decodePayReq(payReq: string): Promise<DecodePayReqResponse> {
    return this.client.decodePayReq({
      pay_req: payReq,
    });
  }

  async lookupInvoice(options: LookupInvoiceRequest): Promise<LookupInvoiceResponse> {
    return this.client.lookupInvoice({ ...options });
  }

  async payInvoice(invoice: string): Promise<SendPaymentResponse> {
    const promise: Promise<SendPaymentResponse> = new Promise((accept, reject) => {
      const rpcCall = this.client.sendPayment({});
      rpcCall.on('data', (msg: SendPaymentResponse) => {
        // emit data event
        this.emit('ln.sendPayment.data', msg);
        // clean up rpc
        rpcCall.end();
        // resolve promise
        return msg.payment_error !== '' ? reject(msg.payment_error) : accept(msg);
      });
      rpcCall.on('end', () => {
        // The server has finished
        this.emit('ln.sendPayment.end');
        console.log('(LNDUPLEX):ln.sendPayment.end');
      });
      rpcCall.write({ payment_request: invoice });
    });
    return promise;
  }

  async addInvoice(amountInSatoshis: number): Promise<AddInvoiceResponse> {
    return this.client.addInvoice({ value: amountInSatoshis });
  }

  async subscribeInvoices(): Promise<void> {
    const rpcCall = this.client.subscribeInvoices({});
    rpcCall.on('data', (msg: InvoiceStreamingMessage) => {
      this.emit('ln.subscribeInvoices.data', msg);
    });
    rpcCall.on('end', (msg: any) => {
      this.emit('ln.subscribeInvoices.end', msg);
    });
    rpcCall.on('status', (msg: any) => {
      this.emit('ln.subscribeInvoices.status', msg);
    });
  }

  _read() {
    /* no-op */
  }

  _write(msg: any, encoding: string, callback: () => void): void {
    console.log('LN duplex _write, recevied msg', msg);
    // Pass the msg on to downstream users
    this.push(msg);
    // switch (msg && msg.type) {
    //   case 'test':
    //     do stuff then emit again
    //     break;
    //   default:
    //     break;
    // }
    return callback();
  }
}
