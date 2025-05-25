import { App, Tags } from "aws-cdk-lib";
import { CommonStack } from "./stacks/Common";
import { AuthStack } from "./stacks/Auth";

import { PARAMS, CONSTANTS } from "./constants";

const app = new App();

const APP_NAME = CONSTANTS.APP_NAME;

const commonStack = new CommonStack(app, `${APP_NAME}-CommonStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const authStack = new AuthStack(app, `${APP_NAME}-AuthStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

Tags.of(commonStack).add("Project", APP_NAME);
Tags.of(authStack).add("Project", APP_NAME);

app.synth();
