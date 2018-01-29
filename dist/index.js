"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var grpc = require("grpc");
var fs = require("fs");
// grpc = require('grpc');
// var fs = require("fs");
//  Lnd cert is at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
var caller = require("grpc-caller");
// const caller = require('grpc-caller')
var services = require("./generated/rpc_pb");
var lndCert = fs.readFileSync("/root/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
// const lnrpcDescriptor = grpc.load("rpc.proto");
// const lnrpc = lnrpcDescriptor.lnrpc;
// const lightning = new lnrpc.Lightning('localhost:10009', credentials);
var client = caller('localhost:10009', services, 'lnrpc', credentials);
client.getInfo({}).then(function (x) { return console.log(x); }).catch(function (e) { return console.log(e); });
// lightning.getInfo({}, (err: any, response: GetInfoResponse.) => {
//   response.toObject().
// });
// call = lightning.getInfo({}, function (err, response) {
//   console.log('GetInfo', response, err);
// }) 
