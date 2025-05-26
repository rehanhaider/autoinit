import { App, Tags } from "aws-cdk-lib";
import { CommonStack } from "./stacks/Common";
import { AuthStack } from "./stacks/Auth";
import { ApiStack } from "./stacks/Api";

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

const apiStack = new ApiStack(app, `${APP_NAME}-ApiStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

// Dependencies
authStack.addDependency(commonStack);
apiStack.addDependency(commonStack);
apiStack.addDependency(authStack);

// Tags
Tags.of(commonStack).add("Project", APP_NAME);
Tags.of(authStack).add("Project", APP_NAME);
Tags.of(apiStack).add("Project", APP_NAME);

app.synth();
