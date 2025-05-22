import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { PUBLIC_CDK_AWS_REGION } from "astro:env/client";
import { PUBLIC_APP_CLIENT_ID, PUBLIC_RECAPATCHA_CLIENT_KEY } from "astro:env/client";

export const REGION = PUBLIC_CDK_AWS_REGION;
export const CLIENT_ID = PUBLIC_APP_CLIENT_ID;
export const RECAPATCHA_CLIENT_KEY = PUBLIC_RECAPATCHA_CLIENT_KEY;

export const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });
