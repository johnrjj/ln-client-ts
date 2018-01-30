import * as grpc from 'grpc';
import * as fs from 'fs';
import * as path from 'path';
import * as byteBuffer from 'bytebuffer';
import * as caller from 'grpc-caller';
import { GetInfoResponse, GraphTopologyUpdate } from './generated/rpc_pb';
import { Duplex } from 'stream';

export class LNRepositoryPlexer extends Duplex {
  client: any;
  constructor() {
    super({ objectMode: true, highWaterMark: 1024 });

    const lndCert = fs.readFileSync('/root/.lnd/tls.cert');
    // const lndCert = fs.readFileSync('../tls.cert');

    const credentials = grpc.credentials.createSsl(lndCert);
    const lnrpcDescriptor = grpc.load('../protos/rpc.proto');
    const lnrpc = lnrpcDescriptor.lnrpc;
    const lightning = new (lnrpc as any).Lightning('localhost:10009', credentials);
    const PROTO_PATH = path.resolve(__dirname, '../protos/rpc.proto');
    const client = caller('localhost:10009', PROTO_PATH, 'Lightning', credentials);
    this.client = client;
  }

  async getInfo(): Promise<any> {
    this.client.getInfo({});
  }

  async sendPayment() {
    const { call, res } = this.client.sendPayment({})

    // figure out how all this works together....
    call.on('data', (msg: any) => {
      console.log('sendPayment:on.data', msg);
      this.emit('ln.sendPayment.data', msg);
    });
    call.on('end', () => {
      // The server has finished
      this.emit('ln.sendPayment.end');
      console.log("ln.sendPayment.end");
    });

    // call.write({ dest: dest_pubkey_bytes, amt: 6969 });

    // call.end();

    res
      .then((x: any) => console.log('sendpayment promise resolved', res))
      .catch((e: any) => console.log('sendpayment promise error', e));
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

