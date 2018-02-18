import * as express from 'express';
import * as expressLogger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as expressWsFactory from 'express-ws';
import * as Raven from 'raven';
import { BigNumber } from 'bignumber.js';
import { RPCLightningNetworkClient, InvoiceStreamingMessage } from './lightning-rpc-client';
import { invoiceRouterFactory } from './routes/invoice';
import { LightningNetworkRepository } from './repositories/lnd-repository';
import { DynamoDbAccountCustodianRepository } from './repositories/account-repository';
import { ConsoleLoggerFactory, Logger } from './logger';
import { WebSocketNode } from './websocket';

const DSN =
  'https://eb6b4b896bc648a097e4c5282353180c:e5271223b49e422a842aaea732832f62@sentry.io/289902';
BigNumber.config({
  EXPONENTIAL_AT: 1000,
});

const PORT = 8000;
(async () => {
  process.on('unhandledRejection', err => {
    throw err;
  });

  const logger: Logger = ConsoleLoggerFactory({ level: 'debug' }); //config.LOG_LEVEL });

  const lnClient = new RPCLightningNetworkClient();
  const paymentDatastore = new DynamoDbAccountCustodianRepository();
  const lnRepository = new LightningNetworkRepository(lnClient, paymentDatastore);

  await lnClient.subscribeInvoices();
  lnClient.on('ln.subscribeInvoices.data', (msg: InvoiceStreamingMessage) => {
    console.log('ln.subscribeInvoices.data', msg);
    const { accountId } = JSON.parse(msg.memo);
    if (!accountId) {
      return;
    }
    const { value: amountReceivedInSatoshis } = msg;
    const amountReceivedInBtc = new BigNumber(String(amountReceivedInSatoshis)).div(100000000);
    lnRepository.receiveMoney(accountId, amountReceivedInBtc);
  });

  const app = express();
  Raven.config(DSN).install();
  app.use(Raven.requestHandler());

  const expressWs = expressWsFactory(app);
  const wss = expressWs.getWss('/ws');
  app.set('trust proxy', true);
  app.use(expressLogger('dev'));
  app.use(helmet());
  app.use(cors());
  // app.use('/', express.static(__dirname + '/public'));
  app.get('/', (_, res) => res.send('Welcome to the Conduit API'));
  app.get('/healthcheck', (_, res) => res.sendStatus(200));
  app.use('/api/v0', invoiceRouterFactory(lnRepository));
  const webSocketNode = new WebSocketNode({
    wss,
    lnClient,
  });
  (app as any).ws('/ws', (ws: any, req: any, next: any) =>
    webSocketNode.connectionHandler(ws, req, next)
  );

  // 404 handler

  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());

  app.use((req, res, next) => {
    const err = new Error('Not Found') as any;
    err.status = 404;
    next(err);
  });

  app.use((error: any, req: any, res: any, next: any) => {
    res.status(error.status || 500);
    console.log(res.sentry);
    res.json({ ...error });
  });

  app.listen(PORT, () => console.log(`Started app on ${PORT}`));
})();
