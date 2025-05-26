import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
    aws_s3 as s3,
    aws_cloudfront as cdn,
    aws_cloudfront_origins as origins,
    aws_certificatemanager as acm,
    aws_ssm as ssm,
    aws_iam as iam,
} from "aws-cdk-lib";
import { aws_route53 as route53, aws_route53_targets as route53Targets } from "aws-cdk-lib";

import { ConstantsType, ParamsType } from "../constants";
import { join } from "path";

interface HostStackProps extends StackProps {
    constants: ConstantsType;
    params: ParamsType;
}

export class HostStack extends Stack {
    constructor(scope: Construct, id: string, props: HostStackProps) {
        super(scope, id, props);

        // Get bucket name from environment variable
        const BUCKET_NAME = props.constants.BUCKET_NAME;
        const hostedZone = route53.HostedZone.fromLookup(this, `${props.constants.APP_NAME}-HostedZone`, {
            domainName: props.constants.DOMAIN_NAME,
        });

        //////////////////////////////////////////
        // ACM Certificate
        //////////////////////////////////////////

        const certificateArn = ssm.StringParameter.fromStringParameterAttributes(this, `${props.constants.APP_NAME}-CertificateArn`, {
            parameterName: props.params.CERTIFICATE_ARN,
        });

        const certificate = acm.Certificate.fromCertificateArn(this, `${props.constants.APP_NAME}-Certificate`, certificateArn.stringValue);

        //////////////////////////////////////////
        // S3 bucket
        //////////////////////////////////////////

        const bucket = s3.Bucket.fromBucketName(this, `${props.constants.APP_NAME}-Bucket`, BUCKET_NAME);

        ////////////////////////////////////////
        // CloudFront
        ////////////////////////////////////////

        const cfFunction = new cdn.Function(this, `${props.constants.APP_NAME}-Function`, {
            code: cdn.FunctionCode.fromFile({
                filePath: join(__dirname, "fn/cdn/CleanUrl.js"),
            }),
        });

        const cdnDistribution = new cdn.Distribution(this, `${props.constants.APP_NAME}-CDN`, {
            defaultBehavior: {
                origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, {
                    originAccessLevels: [cdn.AccessLevel.READ, cdn.AccessLevel.LIST],
                }),
                viewerProtocolPolicy: cdn.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                functionAssociations: [
                    {
                        function: cfFunction,
                        eventType: cdn.FunctionEventType.VIEWER_REQUEST,
                    },
                ],
                cachePolicy: cdn.CachePolicy.CACHING_OPTIMIZED,
            },
            defaultRootObject: "index.html",
            priceClass: cdn.PriceClass.PRICE_CLASS_ALL,
            certificate: certificate,
            domainNames: [`${props.constants.DOMAIN_NAME}`, `www.${props.constants.DOMAIN_NAME}`],
        });

        // Create the Route 53 records
        new route53.ARecord(this, `${props.constants.APP_NAME}-ARecord`, {
            zone: hostedZone,
            target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(cdnDistribution)),
            recordName: props.constants.DOMAIN_NAME,
        });

        new route53.CnameRecord(this, `${props.constants.APP_NAME}-WwwARecord`, {
            zone: hostedZone,
            domainName: props.constants.DOMAIN_NAME,
            recordName: `www.${props.constants.DOMAIN_NAME}`,
        });
    }
}
