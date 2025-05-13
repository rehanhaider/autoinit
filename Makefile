# --- Help Target ---
help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo " deps-aws-npm - Install AWS NPM Dependencies"
	@echo " deps-aws-pip - Install AWS Pip Dependencies"


# --- AWS Targets ---
deps-aws-npm:
	cd src/config/aws && ../../scripts/aws/npm-config.sh

deps-aws-pip:
	cd src/config/aws && pip install -r requirements.txt

