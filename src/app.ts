import * as express from 'express';
import * as expressLogger from 'morgan';
import { ConsoleLoggerFactory, Logger } from './logger';

import * as helmet from 'helmet';
import * as cors from 'cors';
import * as expressWsFactory from 'express-ws';
import { LNRepositoryPlexer, InvoiceStreamingMessage } from './lightning-repository';
import { invoiceRouterFactory } from './routes/invoice';

const PORT = 8000;
(async () => {
  process.on('unhandledRejection', err => {
    throw err;
  });
  const logger: Logger = ConsoleLoggerFactory({ level: 'debug' });//config.LOG_LEVEL });

  const lnRepository = new LNRepositoryPlexer();

  await lnRepository.subscribeInvoices();
  lnRepository.on('ln.subscribeInvoices.data', ((msg: InvoiceStreamingMessage) => console.log('ln.subscribeInvoices.data', msg)))

  const app = express();
  const expressWs = expressWsFactory(app);
  app.set('trust proxy', true);
  app.use('/', express.static(__dirname + '/public'));
  app.use(expressLogger('dev'));
  app.use(helmet());
  app.use(cors());
  app.get('/', (_, res) => res.send('Welcome to the Conduit API'));
  app.get('/healthcheck', (_, res) => res.sendStatus(200));
  app.use('/api/v0', invoiceRouterFactory(lnRepository));

  // 404 handler
  app.use((req, res, next) => {
    const err = new Error('Not Found') as any;
    err.status = 404;
    next(err);
  });

  app.use((error: any, req: any, res: any, next: any) => {
    res.status(error.status || 500);
    res.json({ ...error });
  });

  app.listen(PORT), () => console.log(`Started on port ${PORT}`);
})();
