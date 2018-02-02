import { LightningNetworkClient, AddInvoiceResponse } from "./lightning-repository";

export class LightNetworkRepository {
  constructor(private lnClient: LightningNetworkClient, private paymentDatastore: any) { }

  // Create invoice
  async createInvoice(amtInSatoshis: number): Promise<AddInvoiceResponse> {
    const invoiceRes = await this.lnClient.addInvoice(amtInSatoshis);
    return invoiceRes;
  }

  // Add money to user account
  async receiveMoney(x: number): Promise<any> {
    const dbRes = await this.paymentDatastore.addToBalance(x);
    return dbRes;
  }

  // Pays invoice then deducts money from user account
  async payInvoice(payReq: string): Promise<any> {
    const { destination, num_satoshis, payment_hash } = await this.lnClient.decodePayReq(payReq);
    const payRes = await this.lnClient.payInvoice(payReq);
    const dbRes = await this.paymentDatastore.deductFromBalance(num_satoshis);
    return true;
  }

  // Look up existing invoice
  async decodePayReq(payReq: string) {
    const invoice = await this.lnClient.decodePayReq(payReq);
    return invoice;
  }
}