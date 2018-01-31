import * as bodyParser from 'body-parser';
import * as qrcode from 'qrcode';
import { Router } from 'express';
import { LNRepositoryPlexer } from '../lightning-repository';

const invoiceRouterFactory = (lnRepository: LNRepositoryPlexer) => {
  const router = Router();
  router.use(bodyParser.json({ type: '*/*' }));
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/invoices', async (req, res) => {
    // const { ...rest } = req.query;
  });

  router.get('/invoice/:invoice', async (req, res) => {
    const { invoice: invoiceRHashString } = req.params;
    const invoice = await lnRepository.lookupInvoice({ r_hash_str: invoiceRHashString });
    return res.json(invoice);
  });

  router.post('/invoice', async (req, res) => {
    const { msatoshi, /*currency, amount, description, expiry, metadata */ } = req.body;
    const invoice = await lnRepository.addInvoice(msatoshi);
    return res.status(201).json(invoice);
  })

  router.post('/checkout/:invoice/qr.png', async (req, res) => {
    const { invoice } = req.params;
    return qrcode.toFileStream(res.type('png'), `lightning:${invoice}`.toUpperCase(), () => { })
  });

  return router;
};

export {
  invoiceRouterFactory,
}