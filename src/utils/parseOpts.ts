import _ from 'lodash';
import R from 'ramda';

/**
 * Removes double quote characters
 * from the start and end of the given string IF they are both present
 *
 * @param {string} str Input string
 * @returns {string} Trimmed string or the original string if there are no double quotes around it.
 * @example
  ```
  dequote('"foo"')
  // returns string 'foo'
  dequote('foo')
  // returns string 'foo'
  ```
 */
const dequote = (str: string) => {
	if (str.length > 1 && str[0] === '"' && str[str.length - 1] === '"') {
		return str.substr(1, str.length - 2)
	}

	return str
}

export const parseOpts = (opts: any) => {
	opts = _.pick(opts,
		'browser',
		'cachePath',
		'cacheList',
		'cacheClear',
		'ciBuildId',
		'config',
		'configFile',
		'cypressVersion',
		'destination',
		'detached',
		'dev',
		'exit',
		'env',
		'force',
		'global',
		'group',
		'headed',
		'headless',
		'key',
		'path',
		'parallel',
		'port',
		'project',
		'reporter',
		'reporterOptions',
		'record',
		'spec',
		'tag')

	if (opts.exit) {
		opts = _.omit(opts, 'exit')
	}

	// some options might be quoted - which leads to unexpected results
	// remove double quotes from certain options
	const removeQuotes = {
		group: dequote,
		ciBuildId: dequote,
	}
	const cleanOpts = R.evolve(removeQuotes, opts)

	// debug('parsed cli options %o', cleanOpts)

	return cleanOpts
}