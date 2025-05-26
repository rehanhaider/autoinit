import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import {
    aws_cognito as cognito,
    aws_certificatemanager as acm,
    aws_ssm as ssm,
    aws_lambda as lambda,
    aws_logs as logs,
    aws_dynamodb as dynamodb,
} from "aws-cdk-lib";
import { Construct } from "constructs";

import { join } from "path";

import { ConstantsType, ParamsType } from "../constants";

export interface AuthStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class AuthStack extends Stack {
    constructor(scope: Construct, id: string, props: AuthStackProps) {
        super(scope, id, props);

        const FROM_EMAIL = `noreply@${props.constants.DOMAIN_NAME}`;
        const FROM_NAME = props.constants.BRAND_NAME;
        const REPLY_TO = `support@${props.constants.DOMAIN_NAME}`;
        const EMAIL_SUBJECT = `[${props.constants.PROJECT_NAME}] Please verify your email address`;
        const MESSAGE_STRING = `Hi,<br><br>
        To complete your signup please verify your email by clicking on {##Verify Email##}<br><br>
        Best Regards,<br>
        ${props.constants.PROJECT_NAME} Team`;

        ////////////////////////////////////////////////////////////
        // Cognito User Pool
        ////////////////////////////////////////////////////////////

        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
        });

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        const commonLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.constants.APP_NAME}-CommonLayer`,
            commonLayerArn.stringValue
        );

        const powertoolsLayer = lambda.LayerVersion.fromLayerVersionArn(
            this,
            `${props.constants.APP_NAME}-PowertoolsLayer`,
            props.constants.ARN_POWERTOOLS_LAYER
        );

        const reCapatchaVerification = new lambda.Function(this, `${props.constants.APP_NAME}PreSignUpFunction`, {
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "pre_signup.trigger",
            code: lambda.Code.fromAsset(join(__dirname, "fn/cognito")),
            layers: [commonLayer, powertoolsLayer],
            environment: {
                PROJECT_NAME: props.constants.APP_NAME,
                DOMAIN_NAME: props.constants.DOMAIN_NAME,
                TABLE_NAME: tableName.stringValue,
            },
        });

        const table = dynamodb.Table.fromTableName(this, `${props.constants.APP_NAME}-Table`, tableName.stringValue);
        table.grantReadWriteData(reCapatchaVerification);

        new logs.LogGroup(this, `${props.constants.APP_NAME}-PreSignUpFunctionLogGroup`, {
            logGroupName: `/aws/lambda/${reCapatchaVerification.functionName}`,
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const userPool = new cognito.UserPool(this, `${props.constants.APP_NAME}-UserPool`, {
            userPoolName: `${props.constants.APP_NAME}-UserPool`,
            signInAliases: { email: true },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: false,
                },
                givenName: {
                    required: true,
                    mutable: true,
                },
                familyName: {
                    required: true,
                    mutable: true,
                },
            },
            mfa: cognito.Mfa.OFF,
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            selfSignUpEnabled: true,
            autoVerify: { email: true },
            email: cognito.UserPoolEmail.withSES({
                fromEmail: FROM_EMAIL,
                fromName: FROM_NAME,
                replyTo: REPLY_TO,
                sesVerifiedDomain: props.constants.DOMAIN_NAME,
                sesRegion: "us-east-1",
            }),
            // email: cognito.UserPoolEmail.withCognito(),
            userVerification: {
                emailSubject: EMAIL_SUBJECT,
                emailBody: MESSAGE_STRING,
                emailStyle: cognito.VerificationEmailStyle.LINK,
            },
            lambdaTriggers: {
                preSignUp: reCapatchaVerification,
            },
            removalPolicy: RemovalPolicy.DESTROY,
        });

        ////////////////////////////////////////////////////////////
        // Create SSM parameters
        ////////////////////////////////////////////////////////////

        const userPoolArnParameter = new ssm.StringParameter(this, `${props.constants.APP_NAME}-UserPoolArn`, {
            parameterName: props.params.USER_POOL_ARN,
            stringValue: userPool.userPoolArn,
            tier: ssm.ParameterTier.STANDARD,
            description: `The ARN of the Cognito User Pool for ${props.constants.APP_NAME}`,
        });

        ////////////////////////////////////////////////////////////
        // Cognito User Pool Client
        ////////////////////////////////////////////////////////////

        // authflow - default is userSrp, custom, and refreshToken

        const userPoolClient = new cognito.UserPoolClient(this, `${props.constants.APP_NAME}-AppClient`, {
            userPool: userPool,
            userPoolClientName: `${props.constants.APP_NAME}-AppClient`,
            generateSecret: false, // Auth handled at client side. For secure app, we need to enable this so that we can authenticate in server
            authFlows: {
                userSrp: true, // Includes refresh tokens. No need to define explicitly
                userPassword: true,
                custom: true, // In case we need to add any auth challenge for secure app
            },
            oAuth: {
                callbackUrls: [
                    "http://localhost:4321/",
                    `https://${props.constants.DOMAIN_NAME}`,
                    `https://www.${props.constants.DOMAIN_NAME}`,
                ],
            },
        });

        ////////////////////////////////////////////////////////////
        // Custom Domain
        ////////////////////////////////////////////////////////////

        // Customer domain not configured as it requries setting up a separate subdomain and associated pages. Rather using link & redirect URLs
        userPool.addDomain(`${props.constants.APP_NAME}-UserPoolDomain`, {
            cognitoDomain: {
                domainPrefix: userPoolClient.userPoolClientId,
            },
            // customDomain: {
            //     domainName: `auth.${props.domainName}`,
            //     certificate: certificate,
            // },
        });
    }
}
