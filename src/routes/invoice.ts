import * as bodyParser from 'body-parser';
import * as qrcode from 'qrcode';
import { Router } from 'express';
import { LightningNetworkRepository } from '../repositories/lnd-repository';

const invoiceRouterFactory = (lnRepository: LightningNetworkRepository) => {
  const router = Router();
  router.use(bodyParser.json({ type: '*/*' }));
  router.use(bodyParser.urlencoded({ extended: true }));

  router.post('/account', async (req, res) => {
    const account = await lnRepository.createAccount();
    res.status(201).json(account);
  });

  router.get('/account/:accountId', async (req, res) => {
    const { accountId } = req.params;
    const account = await lnRepository.getAccount(accountId);
    return res.status(200).json(account);
  });

  router.post('/invoice', async (req, res) => {
    const { accountId, satoshis /*currency, amount, description, expiry, metadata */ } = req.body;
    const invoice = await lnRepository.createInvoice(accountId, satoshis);
    return res.status(201).json(invoice);
  });

  // PAY INVOICE
  router.post('/invoice/:invoice/pay', async (req, res) => {
    const { invoice: invoiceId } = req.params;
    const { accountId: fundSourceAccountId, invoice } = req.body;
    const amountPaid = await lnRepository.payInvoice(fundSourceAccountId, invoiceId);
    return res.status(200).json(amountPaid);
  });

  router.get('/invoice/:invoice', async (req, res) => {
    const { invoice } = req.params;
    const invoiceMetadata = await lnRepository.decodePayReq(invoice);
    return res.json(invoiceMetadata);
  });

  router.get('/invoice/:invoice/qr.png', async (req, res) => {
    const { invoice } = req.params;
    console.log('hit the invoice qr route hope it works');
    return qrcode.toFileStream(res.type('png'), `lightning:${invoice}`.toUpperCase(), () => { });
  });

  return router;
};

export { invoiceRouterFactory };
