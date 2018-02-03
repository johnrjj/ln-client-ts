import * as bodyParser from 'body-parser';
import * as qrcode from 'qrcode';
import { Router } from 'express';
import { LightNetworkRepository } from '../lnd-facade';

const invoiceRouterFactory = (lnRepository: LightNetworkRepository) => {
  const router = Router();
  router.use(bodyParser.json({ type: '*/*' }));
  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/account', async (req, res) => {
    const account = await lnRepository.createAccount();
    res.status(201).json(account);
  });

  router.post('/invoice/create', async (req, res) => {
    const { msatoshi /*currency, amount, description, expiry, metadata */ } = req.body;
    const invoice = await lnRepository.createInvoice(msatoshi);
    return res.status(201).json(invoice);
  });

  router.post('/invoice/:invoice/pay', async (req, res) => {
    const { invoice } = req.params;
    const amountPaid = await lnRepository.payInvoice(invoice);
    return res.status(200).json(amountPaid);
  });

  // router.get('/invoices', async (req, res) => {
  //   // const { ...rest } = req.query;
  // });

  router.get('/invoice/:invoice', async (req, res) => {
    const { invoice } = req.params;
    const invoiceMetadata = await lnRepository.decodePayReq(invoice);
    return res.json(invoiceMetadata);
  });

  router.post('/checkout/:invoice/qr.png', async (req, res) => {
    const { invoice } = req.params;
    return qrcode.toFileStream(res.type('png'), `lightning:${invoice}`.toUpperCase(), () => {});
  });

  return router;
};

export { invoiceRouterFactory };
