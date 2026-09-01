.PHONY: run run-be run-fe

run-be:
	cd backend && uv run python -m app.main --reaload

run-fe:
	cd frontend && npm run dev

run:
	$(MAKE) -j2 run-be run-fe
