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
	@echo "  destroy        Destroy specified stack(s) via CDK"
	@echo ""
	@echo "  --- Helper Scripts & Tasks ---"
	@echo "  layers         Create Lambda layers via script"
	@echo "  env     Configure/Get environment variables via script"
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

env:
	@echo ">>> Creating .env.*.local files..."
	./.scripts/create-env-aws.sh
	mise set



# --- Web ---

dev:
	@echo ">>> Running admin frontend dev server..."
	npm run --prefix ./web/ dev

build-web:
	@echo ">>> Building web output..."
	npm run --prefix ./web/ build


invalidate:
	./.scripts/invalidate.sh

upload:
	@echo ">>> Uploading web output to S3..."
	make build
	./.scripts/add-bucket-policy.sh
	./.scripts/deploy-host.sh


# --- Mobile ---

## WIP
build-mobile:
	@echo ">>> Building mobile output..."
	cd mobile && npx expo prebuild
	cd mobile/android && ./gradlew assembleRelease


# --- Init ---

create-bucket:
	@echo ">>> Creating bucket..."
	./.scripts/create-bucket.sh


init:
	@echo ">>> Initializing project..."
	@echo ">>> Step 1: Creating bucket..."
	make create-bucket
	@echo ">>> Step 2: Creating layers..."
	make layers
	@echo ">>> Step 3: Deploying common stack..."
	make deploy STACK=Common
	@echo ">>> Step 4: Setting app data..."
	./.scripts/set-appdata.sh
	@echo ">>> Step 5: Deploying auth stack..."
	make deploy STACK=Auth
	@echo ">>> Step 6: Deploying api stack..."
	make deploy STACK=Api
	@echo ">>> Step 7: Create environment variables..."
	make env
	@echo ">>> Step 8: Deploying host stack..."
	make deploy STACK=Host
	./.scripts/add-bucket-policy.sh
	@echo ">>> Step 9: Building web output..."
	make build
	@echo ">>> Step 10: Uploading web output to S3..."
	make upload && make invalidate




PHONY: build upload deploy destroy layers env-aws env create-bucket init help dev build-web invalidate