# --- Help Target ---
help:
	@echo "Usage: make [target]"
	@echo "Targets:"
	@echo "  help - Show this help message"
	@echo " deps-aws - Install AWS Dependencies"


# --- AWS Targets ---
deps-aws:
	cd src/config/aws && ../../scripts/aws/npm-config.sh

