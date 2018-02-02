// var region = "us-west-2";
// var accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
// var secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
import * as AWS from 'aws-sdk';
import * as uuid from 'uuid/v4';
import { DynamoDB } from 'aws-sdk';
AWS.config.update({

});

const dynamoDb = new DynamoDB.DocumentClient()

const put = async (): Promise<any> => {
  const timestamp = new Date().getTime()
  const data = { foo: 'bar', text: 'foobar' };
  const params = {
    TableName: process.env.DYNAMODB_TABLE || 'lnd',
    Item: {
      id: uuid(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  }
  return await dynamoDb.put(params).promise();
}

const get = async (id: string): Promise<any> => {
  const res = await dynamoDb.get(
    {
      TableName: 'lnd',
      Key: {
        'id': '0f59ee40-ca13-4597-a315-c4c8f4196560',
      }
    }).promise();

  console.log(res.Item);
  return res.Item;
}


put().then(x => console.log(x)).catch(e => console.log(e));