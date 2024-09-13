dev:
	op run --env-file="./.dev.env" --no-masking -- yarn dev;
build:
	op run --env-file="./.prod.env" --no-masking -- yarn build;