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
  addToBalance(accountId: string, amount: BigNumber): Promise<BigNumber>;
  deductFromBalance(accountId: string, amount: BigNumber): Promise<BigNumber>;
}

export class DynamoDbAccountCustodianRepository implements AccountCustodianRepository {
  async deductFromBalance(accountId: string, amountToDeductInBtc: BigNumber): Promise<BigNumber> {
    console.log(`Attempingt to deduct ${amountToDeductInBtc} from ${accountId}`);
    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error('Can not find account');
    }
    const { balance } = account;
    const updatedBalance = balance.minus(amountToDeductInBtc);
    if (updatedBalance.isLessThan(new BigNumber(0))) {
      throw new Error('Insufficient balance');
    }
    const res = await dynamoDb
      .update({
        TableName: ACCOUNTS_TABLE_NAME,
        Key: { id: accountId },
        UpdateExpression: 'set balance= :b',
        ExpressionAttributeValues: {
          ':b': updatedBalance.toFixed(8),
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    console.log(res); // { Attributes: { balance: '0.00000015' } }
    return updatedBalance;
  }

  async addToBalance(accountId: string, amountToAddInBtc: BigNumber): Promise<BigNumber> {
    const account = await this.getAccount(accountId);
    if (!account) {
      throw new Error('Can not find account');
    }
    const { balance } = account;
    const updatedBalance = balance.plus(amountToAddInBtc);
    const res = await dynamoDb
      .update({
        TableName: ACCOUNTS_TABLE_NAME,
        Key: { id: accountId },
        UpdateExpression: 'set balance= :b',
        ExpressionAttributeValues: {
          ':b': updatedBalance.toFixed(8),
        },
        ReturnValues: 'UPDATED_NEW',
      })
      .promise();

    console.log(res); // { Attributes: { balance: '0.00000015' } }
    return updatedBalance;
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
      balance: new BigNumber(0.0000001),
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
