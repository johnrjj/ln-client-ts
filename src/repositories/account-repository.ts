import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';
import { DynamoDB } from 'aws-sdk';
import { BigNumber } from 'bignumber.js';

AWS.config.update({
  region: 'us-east-1',
  accessKeyId: 'AKIAJHYTHQUJEWSHIEQQ', //process.env.DYNAMODB_ACCESS_KEY_ID;
  secretAccessKey: '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', //process.env.DYNAMODB_SECRET_ACCESS_KEY
});

const ACCOUNTS_TABLE_NAME = 'lnd_cust_accounts';

const dynamoDb = new DynamoDB.DocumentClient();

export interface AccountDetail {
  id: string;
  balance: BigNumber;
  createdAt: number;
  updatedAt: number;
}

export interface AccountCustodianRepository {
  createAccount(): Promise<AccountDetail>;
  getAccount(accountId: string): Promise<AccountDetail | null>;
  addToBalance(satoshis: BigNumber): Promise<number>;
  deductFromBalance(accountId: string, amount: BigNumber): Promise<number>;
}

export class DynamoDbAccountCustodianRepository implements AccountCustodianRepository {
  async deductFromBalance(accountId: string, amount: BigNumber): Promise<number> {
    console.log(`DEDUCT FROM ${accountId} AMT ${amount.toString()} IN DYNAMO`);
    return -1;
  }

  async addToBalance(satoshis: BigNumber): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async getAccount(accountId: string): Promise<AccountDetail | null> {
    const res = await dynamoDb
      .get({
        TableName: ACCOUNTS_TABLE_NAME,
        Key: { id: accountId },
      })
      .promise();
    if (res.Item === undefined) {
      console.log(`accountId ${accountId} not found, returning null from account repo`);
      return null;
    }
    const { Item } = res;
    const account = {
      ...(Item as AccountDetail),
      balance: new BigNumber(Item.balance),
    };
    return account;
  }

  async createAccount(): Promise<AccountDetail> {
    const timestamp = new Date().getTime();
    const account: AccountDetail = {
      id: uuid(),
      createdAt: timestamp,
      updatedAt: timestamp,
      balance: new BigNumber(0.0000000001),
    };
    const params = {
      TableName: ACCOUNTS_TABLE_NAME,
      Item: {
        ...account,
        balance: account.balance.toString(),
      },
    };
    const res = await dynamoDb.put(params).promise();
    return account;
  }
}

// const repo = new DynamoDbAccountCustodianRepository();
// repo.getAccount('9709e4a2-8f86-4487-8a44-c0c71bcb0196')
//   .then(x => console.log(x))
//   .catch(e => console.log(e));
