# Default stack target for CDK commands (use --all for clarity)
PROJECT ?= MyProject
STACK ?= --all

# Construct full stack name based on STACK variable
ifeq ($(STACK),--all)
  FULL_STACK_NAME=$(STACK)
else
  FULL_STACK_NAME=$(PROJECT)-$(STACK)Stack
endif



# --- Help Target ---
help:
	@echo "Usage: make [target] [VAR=value]"
	@echo ""
	@echo "Targets:"
	@echo "  help           Show this help message"
	@echo ""
	@echo "  --- CDK Core Targets (use STACK=... to specify stack, defaults to --all) ---"
	@echo "  deploy         Deploy specified stack(s) via CDK"
	@echo "  hotswap        Hotswap specified stack(s) via CDK"
	@echo "  destroy        Destroy specified stack(s) via CDK"
	@echo ""
	@echo "  --- Helper Scripts & Tasks ---"
	@echo "  layers         Create Lambda layers via script"
	@echo "  config-env     Configure/Get environment variables via script"
	@echo "  create-user    Run create user script"
	@echo ""
	@echo "  --- Admin Frontend ---"
	@echo "  dev            Run admin frontend dev server"
	@echo ""


# --- CDK Core Targets ---
# These targets accept the STACK variable (e.g., make deploy STACK=MyStack)

deploy:
	@echo ">>> Deploying stack(s): [$(FULL_STACK_NAME)]"
	cd aws && cdk deploy $(FULL_STACK_NAME) --require-approval never

destroy:
	@echo ">>> Destroying stack(s): [$(FULL_STACK_NAME)]"
	cd aws && cdk destroy $(FULL_STACK_NAME) # Add --force if needed

# --- Helper Scripts & Tasks ---

layers:
	@echo ">>> Creating layers..."
	./.scripts/create-layers.sh

env-aws:
	@echo ">>> Creating .env.web.local file..."
	./.scripts/create-env-aws.sh
	mise set

env:
	@echo ">>> Creating .env.*.local files..."
	make env-aws
	mise set


# --- Init ---

create-bucket:
	@echo ">>> Creating bucket..."
	./.scripts/create-bucket.sh


init:
	@echo ">>> Initializing project..."
	@echo ">>> Creating bucket..."
	make create-bucket
	@echo ">>> Deploying common stack..."
	make deploy STACK=Common
	@echo ">>> Setting app data..."
	./.scripts/set-appdata.sh
	@echo ">>> Deploying auth stack..."
	make deploy STACK=Auth
	@echo ">>> Deploying api stack..."
	make deploy STACK=Api
	@echo ">>> Create environment variables..."
	make env
	@echo ">>> Deploying host stack..."
	make deploy STACK=Host
	./.scripts/add-bucket-policy.sh

# --- Web ---
build:
	@echo ">>> Building web output..."
	npm run --prefix ./web/ build


invalidate:
	./.scripts/invalidate.sh

upload:
	@echo ">>> Uploading web output to S3..."
	make build
	./.scripts/add-bucket-policy.sh
	./.scripts/deploy-host.sh


PHONY: build upload deploy destroy layers env-aws env create-bucket init help