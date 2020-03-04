"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = __importDefault(require("ramda"));
var chalk_1 = __importDefault(require("chalk"));
var logs = [];
var logLevel = function () {
    return (process.env.npm_config_loglevel || 'notice');
};
var error = function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    logs.push(messages.join(' '));
    console.log(chalk_1.default.red.apply(chalk_1.default, messages)); // eslint-disable-line no-console
};
var warn = function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    if (logLevel() === 'silent')
        return;
    logs.push(messages.join(' '));
    console.log(chalk_1.default.yellow.apply(chalk_1.default, messages)); // eslint-disable-line no-console
};
var log = function () {
    var messages = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        messages[_i] = arguments[_i];
    }
    if (logLevel() === 'silent' || logLevel() === 'warn')
        return;
    logs.push(messages.join(' '));
    console.log.apply(console, messages); // eslint-disable-line no-console
};
// splits long text into lines and calls log()
// on each one to allow easy unit testing for specific message
var logLines = function (text) {
    var lines = text.split('\n');
    ramda_1.default.forEach(log, lines);
};
var print = function () {
    return logs.join('\n');
};
var reset = function () {
    logs = [];
};
exports.default = {
    log: log,
    warn: warn,
    error: error,
    logLines: logLines,
    print: print,
    reset: reset,
    logLevel: logLevel,
};
