import * as bodyParser from 'body-parser';
import * as qrcode from 'qrcode';
import { Router } from 'express';

const v0ApiRouterFactory = () => {
  const router = Router();
  router.use(bodyParser.json({ type: '*/*' }));
  router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/invoices', async (req, res) => {
    const { page, per_page } = req.query;
    // get invoices

    // const pairs = await client.getTokenPairs({ page, perPage: per_page });
    // res.status(201).json(pairs);
  });

  router.get('/invoice/:invoice', async (req, res) => {
    const { invoice } = req.params;

  });

  router.post('/invoice', async (req, res) => {
    // const x = await newInvoice();
    res.status(201).json({});
  })

  router.post('/checkout/:invoice/qr.png', async (req, res) => {
    // qrcode.toFileStream(res.type('png'), `lightning:${req.invoice.payreq}`.toUpperCase(), () => {})
  });


};