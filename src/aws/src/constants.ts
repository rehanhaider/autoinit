import config from "../../config.json";
import { createHash } from "crypto";

////////////////////////////////////////////////////////////
// CONFIGURATION
////////////////////////////////////////////////////////////

const APP_NAME = config.PROJECT_NAME.trim().replace(/ /g, "");
const DOMAIN_NAME = config.DOMAIN_NAME.trim().replace(/ /g, "");
const PROJECT_NAME = config.PROJECT_NAME.trim().replace(/ /g, "");
const BRAND_NAME = config.BRAND_NAME.trim().replace(/ /g, "");

const ARN_POWERTOOLS_LAYER = "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:11";

const BUCKET_NAME = process.env.PUBLIC_BUCKET_NAME || createHash("md5").update(APP_NAME).digest("hex");

export const CONSTANTS = {
    APP_NAME,
    DOMAIN_NAME,
    PROJECT_NAME,
    BRAND_NAME,
    ARN_POWERTOOLS_LAYER,
    BUCKET_NAME,
};

export type ConstantsType = typeof CONSTANTS;

export const PARAMS = {
    TABLE_NAME: `/${APP_NAME}/common/table-name`,
    COMMON_LAYER_ARN: `/${APP_NAME}/common/common-layer-arn`,
    USER_POOL_ARN: `/${APP_NAME}/auth/user-pool-arn`,
    CERTIFICATE_ARN: `/${APP_NAME}/common/certificate-arn`,
};

export type ParamsType = typeof PARAMS;
