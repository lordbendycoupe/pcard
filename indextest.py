import boto3
import json

class userdata:

    def __init__(self):
        client = boto3.resource('dynamodb')
        tablename = 'newuser'
        
        self.table = client.Table(tablename)
        
        

    def create_event(self, event): 
        response = self.table.put_item(
            Item = {
                'name': event['name'],
                'email': event['email'],
                'job_title':event['job_title'],
                'birthday': event['birthday'],
                'employer': event['employer'],
                'city': event['city'],
                'phone_number': event['phone_number']
            }
        )

        return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'body': 'Record ' + event['name'] + ' created'
        }

    def read_event(self, event):
        response = self.table.get_item (
            key = {
                'name' : event['name']
            }
        )
        if 'Item' in response: 
            return response['Item']
        else:
            return {
                'statusCode': '404',
                'body': 'not found'
            }

    def get_data(self ,event):
        response = self.table.get_item(
            key = {
                'name': event['name']
            }
        )
        if 'Item' in response:
            return response['Item']
        else:
            return {
                'statusCode': '404',
                'body': 'data not found'
            }

    def update_data(self ,event):
        response = self.table.update_item(
            key = {'name': event['name']},
            ExpressionAttributeValues = {
                '#E' : 'email',
                '#J' : 'job_title',
                '#B' : 'birthday',
                '#C' : 'city',
                '#P' : 'phone_number',
                '#n' : 'employer'
            }

           # ExpressionAttributeValues = {

           #     ':e':event['email'],
           #     ':j':event['job_title'],
           #     ':b':event['birthday'],
           #     ':c':event['city'],
           #     ':p':event['phone_number']
          #  }

           # UpdateExpression = 'SET #E = :e, #J = :j, #B = :b, #C = :c #P',
            #ReturnValues = 'updated'


        )
        return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'body': 'Record ' + event['name'] + 'updated'
        }

    def delete_data(self, event):
        response = self.table.delete_item(

            key = {
                'name': event['name']
            }
        )

        return {
            'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
            'body': 'Record ' + event['name'] + 'deleted'
        }

def lambda_handler(event, context):
    if event:
        user_Object = userdata()
        if event['tasktype'] == "create":
            create_result = user_Object.create_event(event['data'])
            return create_result
        elif event['tasktype'] == "read": 
            read_result = user_Object.read_event(event['data'])
            return read_result
        elif event['tasktype'] == 'update':
            update_result = user_Object.update_data(event['data'])
            return update_result
        elif event['tasktype'] == 'delete':
            delete_result = user_Object.delete_data(event['data'])
        else:
            return {
                'statusCode': '404',
                'body': 'not found'
            }