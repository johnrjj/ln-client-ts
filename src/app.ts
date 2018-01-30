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

  await lnRepository.subscribeInvoices(); // returns undefined
  // console.log('substart from lnrepo', subStart);
  lnRepository.on('ln.subscribeInvoices.data', (msg => console.log('ln.subscribeInvoices.data', msg)))

  // const tx1 = 'lntb10n1pd8zqj5pp5x7696xn4slkj877qwp3nlmc9ynz08nnuaa5u49vwegmep9tg7ruqdz80v3xjg36ygurwdehxa3rzvfd8ycngdedxsuxzepdv9jrxcedvdjngvf3xqmxzce4v33zylgcqzys96rzl7qc3yuwzpsl50lhc2eu7w3y4rudc0wltskzp3hkvq3ezc642ekdedppjvghm8t7d8udq0df8rx9klhkjscuqw6vpjwwaesfpugqrwdqv3';
  // const tx2 = 'lntb20n1pd8zqn2pp58cjglt9pzqpve8jrf2x3684st735zxpc78u2ffsjcu4rh8573ugqdz80v3xjg36yfsnvcejxycn2dedxf3kxcfdx3jngvfd8ycrqv3dxsmnsenxvy6xvdrrxpjzylgcqzysrqql7n20ja2jey2h7ksg3phjus3nthz9ap8u5awugcvg9urf5duzsgmqjn02cne26xxflvwrd6u0whxc0f4ucr5ceq9aggm09xxd95qqyvccu5';
  // const tx1res = await lnRepository.payInvoice(tx1);
  // const tx2res = await lnRepository.payInvoice(tx2);

  const tx = await lnRepository.addInvoice(300);
  console.log(tx.payment_request);

  const app = express();
  const expressWs = expressWsFactory(app);
  app.set('trust proxy', true);
  app.use('/', express.static(__dirname + '/public'));
  app.use(expressLogger('dev'));
  app.use(helmet());
  app.use(cors());
  app.get('/', (_, res) => res.send('Welcome to the Conduit API'));
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
