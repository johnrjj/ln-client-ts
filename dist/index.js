"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grpc = require("grpc");
var fs = require("fs");
var path = require("path");
//  Lnd cert is at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
var caller = require("grpc-caller");
// const caller = require('grpc-caller')
var lndCert = fs.readFileSync("/root/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
var lnrpcDescriptor = grpc.load("../protos/rpc.proto");
var lnrpc = lnrpcDescriptor.lnrpc;
console.log(lnrpcDescriptor);
console.log(lnrpcDescriptor.lnrpc);
var lightning = new lnrpc.Lightning('localhost:10009', credentials);
var PROTO_PATH = path.resolve(__dirname, '../protos/rpc.proto');
var client = caller('localhost:10009', PROTO_PATH, 'lnrpc', credentials);
client.getInfo({ name: 'Bob' }, function (err, res) {
    console.log(res);
    console.log(err);
    console.log('reeee');
});
// const client = caller('localhost:10009', services, 'lnrpc', credentials);
// client.getInfo({}).then((x: any) => console.log(x)).catch((e: any) => console.log(e));
// lightning.getInfo({}, (err: any, response: GetInfoResponse.) => {
//   response.toObject().
// });
// call = lightning.getInfo({}, function (err, response) {
//   console.log('GetInfo', response, err);
// }) 
