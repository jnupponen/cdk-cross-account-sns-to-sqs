#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { ClientStack } from '../lib/client-stack'
import { HubStack } from '../lib/hub-stack'

const app = new cdk.App()
new ClientStack(app, 'CrossAccountSnsSubscriptionClientStack', {
    hubAccountId: '1234567890', // example
    topicName: 'alarm-topic'
})
new HubStack(app, 'CrossAccountSnsSubscriptionHubStack', {
    clientAccountIds: ['0987654321'], // example
    topicName: 'alarm-topic'
})
