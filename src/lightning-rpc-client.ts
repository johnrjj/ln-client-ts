import * as grpc from 'grpc';
import * as fs from 'fs';
import * as path from 'path';
import * as byteBuffer from 'bytebuffer';
import * as caller from 'grpc-caller';
import { Duplex } from 'stream';

export interface BaseLNClient {
  addInvoice(opts: Partial<Invoice>): Promise<AddInvoiceResponse>;
  getInfo(opts: any): Promise<any>;
  decodePayReq(opts: any): Promise<DecodePayReqResponse>;
  lookupInvoice(opts: any): Promise<any>;
  sendPayment(opts: any): any;
  subscribeInvoices: any;
}

export type LNRPCClient = BaseLNClient;
export type LNClient = BaseLNClient & Duplex;

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
  value: string | number;
  settled: boolean;
  creation_date: string;
  settle_date: string;
  payment_request: string;
  description_hash: Buffer;
  expiry: string;
}

type Partial<T> = {[P in keyof T]?: T[P]};

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

export class RPCLightningNetworkClient extends Duplex implements BaseLNClient {
  rpcClient: LNRPCClient;
  constructor() {
    super({ objectMode: true, highWaterMark: 1024 });

    // less hardcoded plz
    const lndCert = fs.readFileSync('/root/.lnd/tls.cert');
    const credentials = grpc.credentials.createSsl(lndCert);
    const PROTO_PATH = path.resolve(__dirname, '../protos/rpc.proto');
    const client = caller('localhost:10009', PROTO_PATH, 'Lightning', credentials);
    this.rpcClient = client;
  }

  async getInfo(): Promise<GetInfoReponse> {
    return this.rpcClient.getInfo({});
  }

  async decodePayReq(payReq: string): Promise<DecodePayReqResponse> {
    return this.rpcClient.decodePayReq({
      pay_req: payReq,
    });
  }

  async lookupInvoice(options: LookupInvoiceRequest): Promise<LookupInvoiceResponse> {
    return this.rpcClient.lookupInvoice({ ...options });
  }

  async sendPayment(invoice: string): Promise<SendPaymentResponse> {
    const promise: Promise<SendPaymentResponse> = new Promise((accept, reject) => {
      const rpcCall = this.rpcClient.sendPayment({});
      rpcCall.on('data', (msg: SendPaymentResponse) => {
        // emit data event
        console.log('data', msg);
        this.emit('ln.sendPayment.data', msg);
        // clean up rpc
        rpcCall.end();
        // resolve promise
        return msg.payment_error !== '' ? reject(msg.payment_error) : accept(msg);
      });
      rpcCall.on('end', () => {
        console.log('end');
        // The server has finished
        this.emit('ln.sendPayment.end');
        console.log('(LNDUPLEX):ln.sendPayment.end');
      });
      rpcCall.on('error', (e: any) => {
        console.log(`this is the rpcCall.on('error')`, e);
        return reject(e);
      });
      try {
        console.log('calling write');
        rpcCall.write({ payment_request: invoice }, ((err: any, res: any) => console.log(err, res)));
      } catch (e) {
        console.log('error calling pay rpcCall.write', e);
        return reject(e);
      }
    });
    return promise;
  }

  async addInvoice(opts: Partial<Invoice>): Promise<AddInvoiceResponse> {
    const { memo, value } = opts; // value = amount in satoshis
    return this.rpcClient.addInvoice({ value, memo });
  }

  async subscribeInvoices(): Promise<void> {
    const rpcCall = this.rpcClient.subscribeInvoices({});
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
