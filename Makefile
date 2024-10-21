.PHONY: ⚙️  # make all non-file targets phony

lint: ⚙️
	@echo "Linting JavaScript files..."
	@eslint --stats . && echo "No linting errors found."

clean:
	rm -rf .DS_Store

install-eslint: ⚙️
	@echo "Installing ESLint system-wide..."
	@brew install eslint

serve: ⚙️
	@echo "Serving the scripts under http://localhost:8080..."
	@python -m http.server 8080

watch: ⚙️
	@echo "Watching for changes in JavaScript files..."
	@fswatch -o . | xargs -n1 -I{} make lint

assets: ⚙️
	@echo "Shrinking assets..."
	@# process PNG files to remove metadata and reduce size using std. convert tools
	find assets -name '*.png' -exec magick {} -strip -colors 64 -dither Riemersma {} \;
