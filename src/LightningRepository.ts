import * as grpc from 'grpc';
import * as fs from 'fs';
import * as path from 'path';
import * as byteBuffer from 'bytebuffer';
import * as caller from 'grpc-caller';
import { Duplex } from 'stream';

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
};

export class LNRepositoryPlexer extends Duplex {
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

  // works
  async getInfo(): Promise<GetInfoReponse> {
    return this.client.getInfo({});
  }

  async sendPayment() {

    var dest_pubkey = 'ss';
    var dest_pubkey_bytes = byteBuffer.fromHex(dest_pubkey);
    const { call, res, ...rest } = this.client.sendPayment({});

    // call.write({ dest: dest_pubkey_bytes, amt: 6969 });
    const sampleInvoice = 'lntb10n1pd8plq3pp5ernvlhrxtdcj9uxe8f3sx20zgk6l99fy4q0leech5umr0lv4m0yqdz80v3xjg36ygekzdn9x4jkxcfdv3jrqwfdxsukgc3d8ymrscedv43xzenpxqerxvn98yejylgcqzysu8w4fj9mklm7g460ncu9xpql6evvzr8hc8uxyr3sy8c2pyvgecfzy5gwr99s47q5yk2maqz8hn2z325urmgdn3kqqhhnrtruertfm0gph7aw40';
    const x = call.write({ payment_request: sampleInvoice });
    console.log(x);

    console.log('inside sendpayment, call and res: ', call, res);
    console.log('rest of obj', rest);

    // figure out how all this works together....
    // call.on('data', (msg: any) => {
    //   console.log('sendPayment:on.data', msg);
    //   this.emit('ln.sendPayment.data', msg);
    // });
    // call.on('end', () => {
    //   // The server has finished
    //   this.emit('ln.sendPayment.end');
    //   console.log("ln.sendPayment.end");
    // });

    // call.write({ dest: dest_pubkey_bytes, amt: 6969 });

    // call.end();

    // res
    //   .then((x: any) => console.log('sendpayment promise resolved', res))
    //   .catch((e: any) => console.log('sendpayment promise error', e));
    // ... write stuff to call
    // call.write({ 
    //     dest: <YOUR_PARAM>,
    //     dest_string: <YOUR_PARAM>,
    //     amt: <YOUR_PARAM>,
    //     payment_hash: <YOUR_PARAM>,
    //     payment_hash_string: <YOUR_PARAM>,
    //     payment_request: <YOUR_PARAM>,
    //   });

    // { 
    //     payment_error: <string>,
    //     payment_preimage: <bytes>,
    //     payment_route: <Route>,
    // }
    return res;
  }

  async subscribeInvoices(): Promise<void> {
    const rpcCall = this.client.subscribeInvoices({});
    rpcCall.on('data', (msg: any) => {
      this.emit('ln.subscribeInvoices.data', msg);
    });
    rpcCall.on('end', (msg: any) => {
      this.emit('ln.subscribeInvoices.end', msg);
    });
    rpcCall.on('data', (msg: any) => {
      this.emit('ln.subscribeInvoices.status', msg);
    });

  }

  _read() { /* no-op */ }

  _write(msg: any, encoding: string, callback: () => void): void {
    // Pass the msg on to downstream users
    console.log('LN duplex _write, recevied msg', msg)
    this.push(msg);
    // if (!msg.productId || msg.productId !== this.product) {
    //   return callback();
    // }
    // switch (msg && msg.type) {
    //   case 'trade':
    //     // this.addTradeMessageToHistory(msg);
    //     // this.emit('OrderbookHistory.update', this.getCandleFromTradeMessage(msg as TradeMessage)); //this.getCandleFromTradeMessage(msg as TradeMessage)
    //     break;
    //   default:
    //     break;
    // }
    return callback();
  }
}

