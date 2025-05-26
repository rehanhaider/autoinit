import { Stack, StackProps } from "aws-cdk-lib";
import {
    aws_dynamodb as dynamodb,
    aws_lambda as lambda,
    aws_ssm as ssm,
    RemovalPolicy,
    aws_s3 as s3,
    aws_certificatemanager as acm,
    aws_route53 as route53,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface CommonStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class CommonStack extends Stack {
    constructor(scope: Construct, id: string, props: CommonStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////
        // DynamoDB table for holding News data
        ////////////////////////////////////////////////////////////
        // Create a DynamoDB table for the API
        const table = new dynamodb.Table(this, `${props.constants.APP_NAME}-Table`, {
            tableName: `${props.constants.APP_NAME}-Table`,
            partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "sk", type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        ////////////////////////////////////////////////////////////
        // Common Layer for lambda functions
        ////////////////////////////////////////////////////////////

        const commonLayer = new lambda.LayerVersion(this, `${props.constants.APP_NAME}-CommonLayer`, {
            compatibleRuntimes: [lambda.Runtime.PYTHON_3_12],
            code: lambda.Code.fromAsset(join(__dirname, "../../../.layers/common")),
            removalPolicy: RemovalPolicy.RETAIN,
        });

        // //////////////////////////////////////////
        // // ACM Certificate
        // //////////////////////////////////////////
        const hostedZone = route53.HostedZone.fromLookup(this, `${props.constants.APP_NAME}-HostedZone`, {
            domainName: props.constants.DOMAIN_NAME,
        });

        // Split this out into a separate stack
        const certificate = new acm.Certificate(this, `${props.constants.APP_NAME}-Certificate`, {
            certificateName: `${props.constants.APP_NAME}-Certificate`,
            domainName: props.constants.DOMAIN_NAME,
            subjectAlternativeNames: [`www.${props.constants.DOMAIN_NAME}`, `*.${props.constants.DOMAIN_NAME}`],
            validation: acm.CertificateValidation.fromDnsMultiZone({
                [`${props.constants.DOMAIN_NAME}`]: hostedZone,
                [`www.${props.constants.DOMAIN_NAME}`]: hostedZone,
                [`*.${props.constants.DOMAIN_NAME}`]: hostedZone,
            }),
        });

        // Unable to delete the CNAMES created by the certificate for validation: TODO: Investigate how to delete the CNAMES
        // @TODO: Create a removal script that looks for *.DOMAIN_NAME and removes it from the hosted zone
        certificate.applyRemovalPolicy(RemovalPolicy.DESTROY);

        ////////////////////////////////////////////////////////////
        // Create SSM parameters
        ////////////////////////////////////////////////////////////

        const tableNameParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
            stringValue: table.tableName,
            tier: ssm.ParameterTier.STANDARD,
            description: `The name of the DynamoDB table for ${props.constants.APP_NAME}`,
        });

        const commonLayerArnParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
            stringValue: commonLayer.layerVersionArn,
            tier: ssm.ParameterTier.STANDARD,
            description: `The ARN of the Common Layer for ${props.constants.APP_NAME}`,
        });

        const certificateArnParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-CertificateArn`, {
            parameterName: props.params.CERTIFICATE_ARN,
            stringValue: certificate.certificateArn,
            tier: ssm.ParameterTier.STANDARD,
            description: `The ARN of the Certificate for ${props.constants.APP_NAME}`,
        });
    }
}
