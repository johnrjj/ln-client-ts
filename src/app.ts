import * as express from 'express';
import * as expressLogger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as expressWsFactory from 'express-ws';
import { LNRepositoryPlexer } from './LightningRepository';

const PORT = 8000;
(async () => {
  process.on('unhandledRejection', err => {
    throw err;
  });

  const lnRepository = new LNRepositoryPlexer();
  const info = await lnRepository.getInfo();
  console.log('getinfo from lnrepo', info);

  const subStart = await lnRepository.subscribeInvoices();
  console.log('substart from lnrepo', subStart);
  lnRepository.on('ln.subscribeInvoices.data', (msg => console.log('ln.subscribeInvoices.data', msg)))

  const didSend = await lnRepository.sendPayment();
  console.log('sendPayment from lnrepo', didSend);

  const app = express();
  const expressWs = expressWsFactory(app);
  app.set('trust proxy', true);
  app.use('/', express.static(__dirname + '/public'));
  app.use(expressLogger('dev'));
  app.use(helmet());
  app.use(cors());
  app.get('/', (_, res) => res.send('Welcome to the Conduit Relay API'));
  app.get('/healthcheck', (_, res) => res.sendStatus(200));
  // app.use('/api/v0', v0ApiRouterFactory(relay, logger));

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
