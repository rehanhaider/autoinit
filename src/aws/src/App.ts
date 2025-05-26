import { App, StackProps, Tags } from "aws-cdk-lib";
import { CommonStack } from "./stacks/Common";
import { AuthStack } from "./stacks/Auth";
import { ApiStack } from "./stacks/Api";
import { AdminStack } from "./stacks/Admin";
import { HostStack } from "./stacks/Host";

import { PARAMS, CONSTANTS } from "./constants";

const env = {
    account: process.env.SECRET_AWS_ACCOUNT,
    region: process.env.PUBLIC_AWS_REGION,
};

const app = new App();
const APP_NAME = CONSTANTS.APP_NAME;

// Shared stack props
const sharedProps: StackProps & { constants: typeof CONSTANTS; params: typeof PARAMS } = {
    env,
    constants: CONSTANTS,
    params: PARAMS,
};

// Stack instantiation
const commonStack = new CommonStack(app, `${APP_NAME}-CommonStack`, sharedProps);
const authStack = new AuthStack(app, `${APP_NAME}-AuthStack`, sharedProps);
const apiStack = new ApiStack(app, `${APP_NAME}-ApiStack`, sharedProps);
const adminStack = new AdminStack(app, `${APP_NAME}-AdminStack`, sharedProps);
const hostStack = new HostStack(app, `${APP_NAME}-HostStack`, sharedProps);

// Stack dependencies
authStack.addDependency(commonStack);
apiStack.addDependency(commonStack);
apiStack.addDependency(authStack);
adminStack.addDependency(commonStack);
hostStack.addDependency(commonStack);

// Auto-tagging
const stacks = [commonStack, authStack, apiStack, adminStack, hostStack];
stacks.forEach((stack) => Tags.of(stack).add("Project", APP_NAME));

app.synth();
