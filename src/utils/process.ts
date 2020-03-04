import logger from './logger'

export function exit(code: number) {
	process.exit(code)
};

export function logErrorExit1(err: Error) {
	logger.error(err.message)

	process.exit(1)
};