"""
# --*-- coding: utf-8 --*--
# This module handles pre-signup validation using reCaptcha
"""

# ==================================================================================================
# Python imports
from os import environ

# ==================================================================================================
# Boto imports
import boto3
import requests

# ==================================================================================================
# Powertools imports and configuration
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module imports
from shared.logger import logger

# ==================================================================================================
# Global declarations
CAPATCHA_CUTOFF_SCORE = 0.5

TABLE_NAME = environ.get("TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)
SITE_VERIFICATION_URL = "https://www.google.com/recaptcha/api/siteverify"


def get_recaptcha_secret() -> str:
    """
    Get the reCaptcha secret from the environment
    """
    response = table.get_item(Key={"pk": "APP#DATA", "sk": "SECRETS"})
    logger.info(f"Table response: {response}")
    return response.get("Item").get("RECAPTCHA_SECRET_KEY")


def verify_recaptcha(recaptcha_token: str) -> bool:
    """
    Verify the reCaptcha token
    """
    response = requests.post(
        SITE_VERIFICATION_URL,
        data={"secret": get_recaptcha_secret(), "response": recaptcha_token},
        timeout=30,
    )

    if response.raise_for_status():
        return False

    logger.info(f"Response: {response.json()}")
    # Return true if the token is valid and the score is greater than 0.5
    return response.json().get("success") and response.json().get("score") > CAPATCHA_CUTOFF_SCORE


def trigger(event: dict, context: LambdaContext) -> dict:
    """
    Main entry point for the Lambda function
    """
    logger.info(f"Event: {event}")
    logger.info(f"Context: {context}")

    recaptcha_token = event.get("request").get("validationData").get("recaptchaToken")
    logger.info(f"Recaptcha token: {recaptcha_token}")

    verification_result = verify_recaptcha(recaptcha_token)

    logger.info(f"Verification result: {verification_result}")

    if not verification_result:
        msg = "Recaptcha verification failed. Please try again later"
        raise Exception(msg)

    return event
