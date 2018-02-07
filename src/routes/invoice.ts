import * as bodyParser from 'body-parser';
import * as qrcode from 'qrcode';
import { Router } from 'express';
import { LightningNetworkRepository } from '../repositories/lnd-repository';

const invoiceRouterFactory = (lnRepository: LightningNetworkRepository) => {
  const router = Router();
  router.use(bodyParser.json({ type: '*/*' }));
  router.use(bodyParser.urlencoded({ extended: true }));

  // Create account
  router.post('/account', async (req, res) => {
    try {
      const account = await lnRepository.createAccount();
      res.status(201).json(account);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  });

  // Get account Info
  router.get('/account/:accountId', async (req, res) => {
    const { accountId } = req.params;
    if (!accountId) {
      return res.status(400).json({ error: 'missing accountId field' });
    }
    try {
      const account = await lnRepository.getAccount(accountId);
      if (!account) {
        return res.status(404).json({ error: 'account not found' });
      }
      return res.status(200).json(account);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

  // Create invoice
  router.post('/invoice', async (req, res) => {
    const { accountId, satoshis } = req.body;
    if (!accountId) {
      return res.status(400).json({ error: 'missing accountId field' });
    }
    if (!satoshis) {
      return res.status(400).json({ error: 'missing satoshis field' });
    }
    try {
      const invoice = await lnRepository.createInvoice(accountId, satoshis);
      return res.status(201).json(invoice);
    } catch (e) {
      console.log('error creating invoice', e, JSON.stringify(e));
      return res.status(500).json({ error: e });
    }
  });

  // PAY INVOICE
  router.post('/invoice/:invoice/pay', async (req, res) => {
    const { invoice: invoiceId } = req.params;
    const { accountId: fundSourceAccountId, invoice } = req.body;
    if (!fundSourceAccountId) {
      return res.status(400).json({ error: 'missing accountId field' });
    }
    if (!invoice) {
      return res.status(400).json({ error: 'missing invoice field in body' });
    }
    // todo: verify invoice exists and is still valid

    // todo: verify user has enough in balance to pay
    try {
      const amountPaid = await lnRepository.payInvoice(fundSourceAccountId, invoiceId);
      return res.status(200).json(amountPaid);
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  });

  router.get('/invoice/:invoice', async (req, res) => {
    const { invoice } = req.params;
    try {
      const invoiceMetadata = await lnRepository.decodePayReq(invoice);
      return res.json(invoiceMetadata);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
  });

  router.get('/invoice/:invoice/qr.png', async (req, res) => {
    const { invoice } = req.params;
    console.log('hit the invoice qr route hope it works');
    return qrcode.toFileStream(res.type('png'), `lightning:${invoice}`.toUpperCase(), () => { });
  });

  return router;
};

export { invoiceRouterFactory };
