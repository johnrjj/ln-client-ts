import {
  RPCLightningNetworkClient,
  AddInvoiceResponse,
  DecodePayReqResponse,
  LNClient,
  SendPaymentResponse,
} from '../lightning-rpc-client';
import { BigNumber } from 'bignumber.js';
import { AccountCustodianRepository, AccountDetail } from './account-repository';

export class LightningNetworkRepository {
  constructor(private lnClient: LNClient, private accountRepository: AccountCustodianRepository) {}

  // Create an account
  async createAccount() {
    const account = await this.accountRepository.createAccount();
    return account;
  }

  // Get account info
  async getAccount(accountId: string): Promise<AccountDetail | null> {
    const account = await this.accountRepository.getAccount(accountId);
    return account;
  }

  // Create invoice
  async createInvoice(accountId: string, amtInSatoshis: number): Promise<AddInvoiceResponse> {
    const invoiceRes = await this.lnClient.addInvoice({
      value: amtInSatoshis,
      memo: JSON.stringify({ accountId }),
    });
    return invoiceRes;
  }

  // Add money to user account
  async receiveMoney(accountId: string, amtInSatoshis: BigNumber): Promise<any> {
    const dbRes = await this.accountRepository.addToBalance(accountId, amtInSatoshis);
    return dbRes;
  }

  // Pays invoice then deducts money from user account
  async payInvoice(fundSourceAccountId: string, payReq: string): Promise<SendPaymentResponse> {
    const { destination, num_satoshis, payment_hash } = await this.lnClient.decodePayReq(payReq);
    let payRes: SendPaymentResponse | null = null;
    try {
      payRes = await this.lnClient.sendPayment(payReq);
    } catch (e) {
      console.log('error paying payreq on ln daemon', e);
      throw e;
    }
    const dbRes = await this.accountRepository.deductFromBalance(
      fundSourceAccountId,
      new BigNumber(num_satoshis)
    );
    return payRes;
    // return new BigNumber(num_satoshis);
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
