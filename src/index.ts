import * as grpc from 'grpc';
import * as fs from 'fs';
import * as path from 'path';


//  Lnd cert is at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
import * as caller from 'grpc-caller';
// const caller = require('grpc-caller')





const lndCert = fs.readFileSync("/root/.lnd/tls.cert");
const credentials = grpc.credentials.createSsl(lndCert);
const lnrpcDescriptor = grpc.load("../protos/rpc.proto");
const lnrpc = lnrpcDescriptor.lnrpc;
console.log(lnrpcDescriptor);
console.log(lnrpcDescriptor.lnrpc);
const lightning = new (lnrpc as any).Lightning('localhost:10009', credentials);

const PROTO_PATH = path.resolve(__dirname, '../protos/rpc.proto')
const client = caller('localhost:10009', PROTO_PATH, 'lnrpc', credentials)
client.getInfo({ name: 'Bob' }, (err: any, res: any) => {
  console.log(res)
  console.log(err)
  console.log('reeee');
})

// const client = caller('localhost:10009', services, 'lnrpc', credentials);
// client.getInfo({}).then((x: any) => console.log(x)).catch((e: any) => console.log(e));

// lightning.getInfo({}, (err: any, response: GetInfoResponse.) => {
//   response.toObject().
// });

// call = lightning.getInfo({}, function (err, response) {
//   console.log('GetInfo', response, err);
// })