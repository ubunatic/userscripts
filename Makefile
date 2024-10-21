.PHONY: ⚙️  # make all non-file targets phony

lint: ⚙️
	@echo "Linting JavaScript files..."
	@eslint --stats . && echo "No linting errors found."

install-eslint: ⚙️
	@echo "Installing ESLint system-wide..."
	@brew install eslint

serve: ⚙️
	@echo "Serving the scripts under http://localhost:8080..."
	@python -m http.server 8080

watch: ⚙️
	@echo "Watching for changes in JavaScript files..."
	@fswatch -o . | xargs -n1 -I{} make lint