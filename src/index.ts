import * as grpc from 'grpc';
import * as fs from 'fs';
import { GetInfoResponse } from './generated/rpc_pb';


// grpc = require('grpc');
// var fs = require("fs");

//  Lnd cert is at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
import * as caller from 'grpc-caller';
// const caller = require('grpc-caller')

import * as services from './generated/rpc_pb';

const lndCert = fs.readFileSync("/root/.lnd/tls.cert");
const credentials = grpc.credentials.createSsl(lndCert);
// const lnrpcDescriptor = grpc.load("rpc.proto");
// const lnrpc = lnrpcDescriptor.lnrpc;
// const lightning = new lnrpc.Lightning('localhost:10009', credentials);

const client = caller('localhost:10009', services, 'lnrpc', credentials);
client.getInfo({}).then((x: any) => console.log(x)).catch((e: any) => console.log(e));

// lightning.getInfo({}, (err: any, response: GetInfoResponse.) => {
//   response.toObject().
// });

// call = lightning.getInfo({}, function (err, response) {
//   console.log('GetInfo', response, err);
// })