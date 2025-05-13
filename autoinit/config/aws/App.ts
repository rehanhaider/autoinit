import { App } from "aws-cdk-lib";

import { PARAMS, CONSTANTS } from "./constants";


const APP_NAME = "MyApp";
const ARN_POWERTOOLS_LAYER = "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:11";


const app = new App({
    context: {
        APP_NAME,
    },
});

app.synth();

