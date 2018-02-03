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

const get = async (id: string): Promise<any> => {
  const res = await dynamoDb
    .get({
      TableName: 'lnd',
      Key: {
        id: '0f59ee40-ca13-4597-a315-c4c8f4196560',
      },
    })
    .promise();

  console.log(res.Item);
  return res.Item;
};