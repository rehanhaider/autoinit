import { Stack, StackProps, RemovalPolicy, Size } from "aws-cdk-lib";
import {
    aws_cognito as cognito,
    aws_dynamodb as dynamodb,
    aws_ssm as ssm,
    aws_apigateway as apigateway,
    aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { join } from "path";
import { ConstantsType, ParamsType } from "../constants";

export interface AdminStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class AdminStack extends Stack {
    constructor(scope: Construct, id: string, props: AdminStackProps) {
        super(scope, id, props);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Import SSM parameters
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const tableName = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-TableName`, {
            parameterName: props.params.TABLE_NAME,
        });

        const commonLayerArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CommonLayerArn`, {
            parameterName: props.params.COMMON_LAYER_ARN,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        /**
         * Admin User Authentication
         */
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const adminUserPool = new cognito.UserPool(this, `${props.constants.APP_NAME}-AdminUserPool`, {
            userPoolName: `${props.constants.APP_NAME}-AdminUserPool`,
            signInAliases: { email: true },
            standardAttributes: {
                email: { required: true, mutable: true },
                givenName: { required: true, mutable: true },
                familyName: { required: true, mutable: true },
            },
            mfa: cognito.Mfa.OFF,
            accountRecovery: cognito.AccountRecovery.NONE,
            selfSignUpEnabled: false,
            email: cognito.UserPoolEmail.withCognito(),
            removalPolicy: RemovalPolicy.DESTROY,
        });

        const adminUserPoolClient = new cognito.UserPoolClient(this, `${props.constants.APP_NAME}-AdminUserPoolClient`, {
            userPool: adminUserPool,
            authFlows: {
                userSrp: true,
                adminUserPassword: true,
            },
            generateSecret: false,
            disableOAuth: true,
        });

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Admin API Lambda
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Configure the Layers

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

        // Configure the Admin Lambda
        const adminLambda = new lambda.Function(this, `${props.constants.APP_NAME}-AdminLambda`, {
            functionName: `${props.constants.APP_NAME}-AdminLambda`,
            runtime: lambda.Runtime.PYTHON_3_12,
            handler: "app.main",
            code: lambda.Code.fromAsset(join(__dirname, "fn/admin")),
            layers: [commonLayer, powertoolsLayer],
            environment: {
                TABLE_NAME: tableName.stringValue,
            },
        });

        // Configure the Admin Lambda to access the Admin Table
        const table = dynamodb.Table.fromTableName(this, `${props.constants.APP_NAME}-Table`, tableName.stringValue);
        table.grantReadWriteData(adminLambda);

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Admin API
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, `${props.constants.APP_NAME}-AdminAuthorizer`, {
            authorizerName: `${props.constants.APP_NAME}-AdminAuthorizer`,
            cognitoUserPools: [adminUserPool],
        });

        const adminApi = new apigateway.LambdaRestApi(this, `${props.constants.APP_NAME}-AdminApi`, {
            handler: adminLambda,
            proxy: true,
            restApiName: `${props.constants.APP_NAME}-AdminApi`,
            deployOptions: {
                stageName: "admin",
            },
            endpointTypes: [apigateway.EndpointType.REGIONAL],
            minCompressionSize: Size.bytes(0),
            defaultMethodOptions: {
                authorizationType: apigateway.AuthorizationType.COGNITO,
                authorizer: authorizer,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: ["*"],
                allowMethods: apigateway.Cors.ALL_METHODS,
                allowHeaders: ["*", "Authorization"],
            },
        });
    }
}
