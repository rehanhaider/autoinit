"""
# --*-- coding: utf-8 --*--
# This module defines the REST API routes
"""

# ==================================================================================================
# Python imports
from os import environ

import boto3

# ==================================================================================================
# Powertools imports
from aws_lambda_powertools.event_handler import APIGatewayRestResolver, CORSConfig
from aws_lambda_powertools.utilities.data_classes import APIGatewayProxyEvent, event_source
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module-level imports
from shared.lambda_response import RESPONSE
from shared.logger import logger

# ==================================================================================================
# Global declarations
TABLE_NAME = environ.get("TABLE_NAME")

# ==================================================================================================
# Global initializations

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(TABLE_NAME)

cors_config = CORSConfig(
    allow_origin="*",
    allow_headers=["*", 'Authorization'],  # noqa: Q000
)

app = APIGatewayRestResolver(cors=cors_config)


# ==================================================================================================
# Routes


@event_source(APIGatewayProxyEvent)
def main(event: APIGatewayProxyEvent, context: LambdaContext) -> dict:
    """
    The lambda handler method: It resolves the proxy route and invokes the appropriate method
    """
    logger.info(f"Event: {event}")
    logger.info(f"Context: {context}")
    return app.resolve(event, context)


# ==================================================================================================
# Helper functions


@app.get("/sources")
def get_sources() -> dict:
    """
    Get all sources
    """
    return RESPONSE.success(data=[])


@app.post("/add-source")
def add_source() -> dict:
    """
    Add a new source
    """
    return RESPONSE.success(data=[])


@app.post("/update-source")
def update_source() -> dict:
    """
    Update a source
    """
    return RESPONSE.success(data=[])


@app.post("/delete-source")
def delete_source() -> dict:
    """
    Delete a source
    """
    return RESPONSE.success(data=[])
