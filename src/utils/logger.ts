import R from 'ramda'
import chalk from 'chalk'

let logs: string[] = []

const logLevel = () => {
	return (process.env.npm_config_loglevel || 'notice')
}

const error = (...messages: any[]) => {
	logs.push(messages.join(' '))
	console.log(chalk.red(...messages)) // eslint-disable-line no-console
}

const warn = (...messages: any[]) => {
	if (logLevel() === 'silent') return

	logs.push(messages.join(' '))
	console.log(chalk.yellow(...messages)) // eslint-disable-line no-console
}

const log = (...messages: any[]) => {
	if (logLevel() === 'silent' || logLevel() === 'warn') return

	logs.push(messages.join(' '))
	console.log(...messages) // eslint-disable-line no-console
}

// splits long text into lines and calls log()
// on each one to allow easy unit testing for specific message
const logLines = (text: string) => {
	const lines = text.split('\n')

	R.forEach(log, lines)
}

const print = () => {
	return logs.join('\n')
}

const reset = () => {
	logs = []
}

export default {
	log,
	warn,
	error,
	logLines,
	print,
	reset,
	logLevel,
}
