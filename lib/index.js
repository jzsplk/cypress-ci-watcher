#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='../node_modules/cypress/types/cypress-npm-api.d.ts'/>
var CypressApi = __importStar(require("cypress"));
var slack_1 = require("./slack/utils/slack");
var lodash_1 = __importDefault(require("lodash"));
var parseOpts_1 = require("./utils/parseOpts");
var process_1 = require("./utils/process");
var logger_1 = __importDefault(require("./utils/logger"));
var chalk = require("chalk");
var clear = require("clear");
var figlet = require("figlet");
var path = require("path");
var commander_1 = __importDefault(require("commander"));
var marge = require("mochawesome-report-generator");
var merge = require("mochawesome-merge").merge;
var del = require("del");
var yargs = require("yargs");
// clear();
console.log(chalk.red(figlet.textSync("cypress-ci-watcher", { horizontalLayout: "full" })));
// cypress run below
function generateReport(options) {
    return merge(options).then(function (report) { return marge.create(report, options); });
}
var parsedArgs = lodash_1.default.omit(yargs.parse(process.argv.slice(2)), "_", "$0");
var options = __assign({ reporter: "cypress-multi-reporters", reporterOptions: {
        reporterEnabled: "mocha-junit-reporter, mochawesome",
        mochaJunitReporterReporterOptions: {
            mochaFile: "cypress/reports/junit/test_results[hash].xml",
            toConsole: false
        },
        mochawesomeReporterOptions: {
            reportDir: "cypress/reports/mocha",
            quiet: true,
            overwrite: false,
            html: false,
            json: true
        }
    } }, parsedArgs);
var spaceDelimitedArgsMsg = function (flag, args) {
    var msg = "\n\n\t  \"" + args.join(" ") + "\"\n\n\t  This will work, but it's not recommended.\n\n\t  If you are trying to pass multiple arguments, separate them with commas instead:\n\t\tcypress run --" + flag + " arg1,arg2,arg3\n\t";
    if (flag === "spec") {
        msg += "\n\t  The most common cause of this warning is using an unescaped glob pattern. If you are\n\t  trying to pass a glob pattern, escape it using quotes:\n\t\tcypress run --spec \"**/*.spec.js\"\n\t  ";
    }
    logger_1.default.log();
    // logger.warn(stripIndent(msg))
    logger_1.default.log();
};
var parseVariableOpts = function (fnArgs, args) {
    var opts = fnArgs[0], unknownArgs = fnArgs[1];
    if (unknownArgs && unknownArgs.length && (opts.spec || opts.tag)) {
        // this will capture space-delimited args after
        // flags that could have possible multiple args
        // but before the next option
        // --spec spec1 spec2 or --tag foo bar
        var multiArgFlags = lodash_1.default.compact([
            opts.spec ? "spec" : opts.spec,
            opts.tag ? "tag" : opts.tag
        ]);
        lodash_1.default.forEach(multiArgFlags, function (flag) {
            var _a;
            var argIndex = lodash_1.default.indexOf(args, "--" + flag) + 2;
            var nextOptOffset = lodash_1.default.findIndex(lodash_1.default.slice(args, argIndex), function (arg) {
                return lodash_1.default.startsWith(arg, "--");
            });
            var endIndex = nextOptOffset !== -1 ? argIndex + nextOptOffset : (_a = args === null || args === void 0 ? void 0 : args.length) !== null && _a !== void 0 ? _a : 0;
            var maybeArgs = lodash_1.default.slice(args, argIndex, endIndex);
            var extraArgs = lodash_1.default.intersection(maybeArgs, unknownArgs);
            if (extraArgs.length) {
                opts[flag] = [opts[flag]].concat(extraArgs);
                spaceDelimitedArgsMsg(flag, opts[flag]);
                opts[flag] = opts[flag].join(",");
            }
        });
    }
    // debug('variable-length opts parsed %o', { args, opts })
    return parseOpts_1.parseOpts(opts);
};
var descriptions = {
    browserOpenMode: "path to a custom browser to be added to the list of available browsers in Cypress",
    browserRunMode: "runs Cypress in the browser with the given name. if a filesystem path is supplied, Cypress will attempt to use the browser at that path.",
    cacheClear: "delete all cached binaries",
    cacheList: "list cached binary versions",
    cachePath: "print the path to the binary cache",
    ciBuildId: 'the unique identifier for a run on your CI provider. typically a "BUILD_ID" env var. this value is automatically detected for most CI providers',
    config: "sets configuration values. separate multiple values with a comma. overrides any value in cypress.json.",
    configFile: 'path to JSON file where configuration values are set. defaults to "cypress.json". pass "false" to disable.',
    detached: "runs Cypress application in detached mode",
    dev: "runs cypress in development and bypasses binary check",
    env: "sets environment variables. separate multiple values with a comma. overrides any value in cypress.json or cypress.env.json",
    exit: "keep the browser open after tests finish",
    forceInstall: "force install the Cypress binary",
    global: "force Cypress into global mode as if its globally installed",
    group: "a named group for recorded runs in the Cypress Dashboard",
    headed: "displays the browser instead of running headlessly (defaults to true for Firefox and Chromium-family browsers)",
    headless: "hide the browser instead of running headed (defaults to true for Electron)",
    key: "your secret Record Key. you can omit this if you set a CYPRESS_RECORD_KEY environment variable.",
    parallel: "enables concurrent runs and automatic load balancing of specs across multiple machines or processes",
    port: "runs Cypress on a specific port. overrides any value in cypress.json.",
    project: "path to the project",
    record: "records the run. sends test results, screenshots and videos to your Cypress Dashboard.",
    reporter: 'runs a specific mocha reporter. pass a path to use a custom reporter. defaults to "spec"',
    reporterOptions: 'options for the mocha reporter. defaults to "null"',
    spec: 'runs specific spec file(s). defaults to "all"',
    tag: "named tag(s) for recorded runs in the Cypress Dashboard",
    version: "prints Cypress version"
};
var text = function (description) {
    if (!descriptions[description]) {
        throw new Error("Could not find description for: " + description);
    }
    return descriptions[description];
};
var coerceFalse = function (arg) {
    return arg !== "false";
};
var runner = function () {
    return __awaiter(this, void 0, void 0, function () {
        var generatedReport, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, CypressApi.run(options)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, generateReport({
                            files: ["cypress/reports/mocha/*.json"],
                            inline: true,
                            saveJson: true
                        })];
                case 2:
                    generatedReport = _a.sent();
                    console.log("generated report: ", generatedReport);
                    return [4 /*yield*/, del(["cypress/reports/mocha/mochawesome_*.json"])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, slack_1.sendMessage("mochawesome-report")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, process_1.exit(0)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _a.sent();
                    process_1.logErrorExit1(e_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
};
commander_1.default.usage("<command> [options]");
// program
//   .version("0.0.1")
//   .description("An example CLI for watch cypress run in ci");
commander_1.default
    .command("help")
    .description("Shows CLI help and exits")
    .action(function () {
    commander_1.default.help();
});
commander_1.default
    .command("run")
    .usage("[options]")
    .description("Runs Cypress tests from the CLI without the GUI")
    .option("-b, --browser <browser-name-or-path>", text("browserRunMode"))
    .option("--ci-build-id <id>", text("ciBuildId"))
    .option("-c, --config <config>", text("config"))
    .option("-C, --config-file <config-file>", text("configFile"))
    .option("-e, --env <env>", text("env"))
    .option("--group <name>", text("group"))
    .option("-k, --key <record-key>", text("key"))
    .option("--headed", text("headed"))
    .option("--headless", text("headless"))
    .option("--no-exit", text("exit"))
    .option("--parallel", text("parallel"))
    .option("-p, --port <port>", text("port"))
    .option("-P, --project <project-path>", text("project"))
    .option("--record [bool]", text("record"), coerceFalse)
    .option("-r, --reporter <reporter>", text("reporter"))
    .option("-o, --reporter-options <reporter-options>", text("reporterOptions"))
    .option("-s, --spec <spec>", text("spec"))
    .option("-t, --tag <tag>", text("tag"))
    .option("--dev", text("dev"), coerceFalse)
    .action(function () {
    var fnArgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fnArgs[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var args, mergedOptions, generatedReport, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    args = process.argv;
                    mergedOptions = __assign(__assign({}, options), parseVariableOpts(fnArgs, args));
                    console.log("merged options", mergedOptions);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, CypressApi.run(mergedOptions)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, generateReport({
                            files: ["cypress/reports/mocha/*.json"],
                            inline: true,
                            saveJson: true
                        })];
                case 3:
                    generatedReport = _a.sent();
                    console.log("generated report: ", generatedReport);
                    return [4 /*yield*/, del(["cypress/reports/mocha/mochawesome_*.json"])];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, slack_1.sendMessage("mochawesome-report")];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    process_1.logErrorExit1(e_2);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
});
commander_1.default.parse(process.argv);
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
