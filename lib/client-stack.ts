import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Topic, TopicPolicy } from 'aws-cdk-lib/aws-sns'
import { AccountPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam'

export interface ClientStackProps extends StackProps {
    hubAccountId: string
    topicName: string
}
export class ClientStack extends Stack {
    constructor(scope: Construct, id: string, props: ClientStackProps) {
        super(scope, id, props)

        const clientTopic = new Topic(this, 'clientTopic', { topicName: props.topicName })
        const topicPolicy = new TopicPolicy(this, 'topicPolicy', {
            topics: [clientTopic]
        })

        topicPolicy.document.addStatements(
            new PolicyStatement({
                actions: ['sns:Subscribe'],
                principals: [new AccountPrincipal(props.hubAccountId)],
                resources: [clientTopic.topicArn]
            })
        )
    }
}
