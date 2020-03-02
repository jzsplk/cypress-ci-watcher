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
var slack_1 = require("../src/slack/utils/slack");
var lodash_1 = require("lodash");
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
// const program = require('commander');
var commander_1 = __importDefault(require("commander"));
var marge = require("mochawesome-report-generator");
var merge = require("mochawesome-merge").merge;
var del = require("del");
var yargs = require("yargs");
clear();
console.log(chalk.red(figlet.textSync('cypress-ci-watcher', { horizontalLayout: 'full' })));
commander_1.default
    .version('0.0.2')
    .description("An example CLI for watch cypress run in ci")
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq', 'Add bbq sauce')
    .option('-c, --cheese <type>', 'Add the specified type of cheese [marble]')
    .option('-C, --no-cheese', 'You do not want any cheese')
    .command('run')
    .action(function () { return runner(); })
    .parse(process.argv);
console.log('you ordered a pizza with:');
if (commander_1.default.peppers)
    console.log('  - peppers');
if (commander_1.default.pineapple)
    console.log('  - pineapple');
if (commander_1.default.bbq)
    console.log('  - bbq');
var cheese = true === commander_1.default.cheese ? 'marble' : commander_1.default.cheese || 'no';
console.log('  - %s cheese', cheese);
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
// cypress run below
function generateReport(options) {
    return merge(options).then(function (report) { return marge.create(report, options); });
}
var parsedArgs = lodash_1.omit(yargs.parse(process.argv.slice(2)), "_", "$0");
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
var runner = function () {
    return __awaiter(this, void 0, void 0, function () {
        var generatedReport, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
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
                    return [3 /*break*/, 6];
                case 5:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
