import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Queue } from 'aws-cdk-lib/aws-sqs'
import { Subscription, SubscriptionProtocol, Topic } from 'aws-cdk-lib/aws-sns'
import { AccountPrincipal, Effect, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam'

export interface HubStackProps extends StackProps {
    clientAccountIds: [string]
    topicName: string
}

export class HubStack extends Stack {
    constructor(scope: Construct, id: string, props: HubStackProps) {
        super(scope, id, props)

        const hubQueue = new Queue(this, 'hubQueue')

        for (let accountId of props.clientAccountIds) {
            const clientTopic = Topic.fromTopicArn(
                this,
                'clientTopic',
                `arn:aws:sns:eu-west-1:${accountId}:${props.topicName}`
            )
            hubQueue.addToResourcePolicy(
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['sqs:SendMessage'],
                    principals: [new ServicePrincipal('sns.amazonaws.com')],
                    resources: [hubQueue.queueArn],
                    conditions: {
                        ArnEquals: {
                            'aws:SourceArn': clientTopic.topicArn
                        }
                    }
                })
            )
            new Subscription(this, 'topicSubscription', {
                topic: clientTopic,
                protocol: SubscriptionProtocol.SQS,
                endpoint: hubQueue.queueArn
            })
        }
    }
}
