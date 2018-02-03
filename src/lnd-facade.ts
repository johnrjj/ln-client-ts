import {
  LightningNetworkClient,
  AddInvoiceResponse,
  DecodePayReqResponse,
} from './lightning-client';
import { BigNumber } from 'bignumber.js';
import { AccountCustodianRepository } from './dynamo';

export class LightNetworkRepository {
  constructor(
    private lnClient: LightningNetworkClient,
    private accountRepository: AccountCustodianRepository
  ) { }

  // Create an account
  async createAccount() {
    const account = await this.accountRepository.createAccount();
    return account;
  }

  // Create invoice
  async createInvoice(amtInSatoshis: number): Promise<AddInvoiceResponse> {
    const invoiceRes = await this.lnClient.addInvoice(amtInSatoshis);
    return invoiceRes;
  }

  // Add money to user account
  async receiveMoney(amtInSatoshis: BigNumber): Promise<any> {
    const dbRes = await this.accountRepository.addToBalance(amtInSatoshis);
    return dbRes;
  }

  // Pays invoice then deducts money from user account
  async payInvoice(payReq: string): Promise<BigNumber> {
    const { destination, num_satoshis, payment_hash } = await this.lnClient.decodePayReq(payReq);
    const payRes = await this.lnClient.payInvoice(payReq);
    const dbRes = await this.accountRepository.deductFromBalance(new BigNumber(num_satoshis));
    return new BigNumber(num_satoshis);
  }

  // Look up existing invoice
  async decodePayReq(payReq: string): Promise<DecodePayReqResponse> {
    const invoice = await this.lnClient.decodePayReq(payReq);
    return {
      ...invoice,
      // num_satoshis invoice.num_satoshis
    };
  }
}
