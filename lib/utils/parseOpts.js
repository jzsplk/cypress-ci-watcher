"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var ramda_1 = __importDefault(require("ramda"));
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
var dequote = function (str) {
    if (str.length > 1 && str[0] === '"' && str[str.length - 1] === '"') {
        return str.substr(1, str.length - 2);
    }
    return str;
};
exports.parseOpts = function (opts) {
    opts = lodash_1.default.pick(opts, 'browser', 'cachePath', 'cacheList', 'cacheClear', 'ciBuildId', 'config', 'configFile', 'cypressVersion', 'destination', 'detached', 'dev', 'exit', 'env', 'force', 'global', 'group', 'headed', 'headless', 'key', 'path', 'parallel', 'port', 'project', 'reporter', 'reporterOptions', 'record', 'spec', 'tag');
    if (opts.exit) {
        opts = lodash_1.default.omit(opts, 'exit');
    }
    // some options might be quoted - which leads to unexpected results
    // remove double quotes from certain options
    var removeQuotes = {
        group: dequote,
        ciBuildId: dequote,
    };
    var cleanOpts = ramda_1.default.evolve(removeQuotes, opts);
    // debug('parsed cli options %o', cleanOpts)
    return cleanOpts;
};
