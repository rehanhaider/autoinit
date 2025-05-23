"""
# --*-- coding: utf-8 --*--
# This module defines the REST API routes
"""

# ==================================================================================================
# Python imports
from os import environ

import requests

# ==================================================================================================
# Powertools imports
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler import APIGatewayRestResolver, CORSConfig
from aws_lambda_powertools.utilities.typing import LambdaContext

# ==================================================================================================
# Module-level imports
from lib.lambda_response import RESPONSE
from lib.progress import get_progress_from_db, get_started_courses, set_progress_from_db
from lib.token import parse_token

# ==================================================================================================
# Global declarations
BUCKET_NAME = environ.get("BUCKET_NAME")
DOMAIN_NAME = environ.get("DOMAIN_NAME")


# ==================================================================================================
# Global initializations
cors_config = CORSConfig(
    allow_origin=f"https://{DOMAIN_NAME}",
    extra_origins=[f"https://www.{DOMAIN_NAME}", "http://localhost:3000"],
    allow_headers=["*", "Authorization"],  # noqa: Q000
)

app = APIGatewayRestResolver(cors=cors_config)
tracer = Tracer()
logger = Logger()

# ==================================================================================================
# Routes


@app.post("/progress/<path_id>")
def update_progress(path_id: str) -> dict:
    data: dict = app.current_event.json_body
    user_id = parse_token(app.current_event.headers.get("authorization"))["cognito:username"]
    logger.info(f"User ID: {user_id}")
    logger.info(f"Progress data: {data}")
    logger.info(f"Path ID: {path_id}")
    set_progress_from_db(user_id=user_id, data=data, path_id=path_id)
    return RESPONSE(body={"message": "Progress data received"})


@app.get("/progress/<path_id>")
def get_progress(path_id: str) -> dict:
    user_id = parse_token(app.current_event.headers.get("authorization"))["cognito:username"]
    logger.info(f"User ID: {user_id}")
    return RESPONSE(body=get_progress_from_db(user_id=user_id, path_id=path_id))


@app.get("/progress")
def get_all_progress() -> dict:
    user_id = parse_token(app.current_event.headers.get("authorization"))["cognito:username"]
    logger.info(f"User ID: {user_id}")
    return RESPONSE(body=get_started_courses(user_id=user_id))


@app.get("/")
def index() -> dict:
    response = requests.get("https://jsonplaceholder.typicode.com/users", timeout=30)
    logger.info("Managed to fetch data from the API")
    # This needs to be single quotes, not double quotes. Otherwise, it will throw an error @TODO: Article
    return RESPONSE(body=response.json()[0])


@tracer.capture_lambda_handler
def main(event: dict, context: LambdaContext) -> dict:
    """
    The lambda handler method: It resolves the proxy route and invokes the appropriate method
    """
    return app.resolve(event, context)
