"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var TestStatus_1 = require("../../constants/TestStatus");
var webhook_1 = require("@slack/webhook");
var getTestReportStatus_1 = require("../../utils/getTestReportStatus");
var messageConstructors_1 = require("./messageConstructors");
var dotenv_1 = require("dotenv");
dotenv_1.config();
// add webhook url in env
var SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL_ME;
console.log("the webhook url is", SLACK_WEBHOOK_URL);
function sendMessage(_reportDir) {
    return __awaiter(this, void 0, void 0, function () {
        var reportParsed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reportParsed = getTestReportStatus_1.reportParser(_reportDir);
                    return [4 /*yield*/, constructMessage(reportParsed)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendMessage = sendMessage;
function constructMessage(parsedReport) {
    return __awaiter(this, void 0, void 0, function () {
        var _status, sendArgs, webhookInitialArguments, webhook, reports, _a, sendArguments, e_1, sendArguments, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _status = parsedReport.status;
                    sendArgs = {};
                    webhookInitialArguments = messageConstructors_1.webhookInitialArgs({}, _status);
                    webhook = new webhook_1.IncomingWebhook(SLACK_WEBHOOK_URL !== null && SLACK_WEBHOOK_URL !== void 0 ? SLACK_WEBHOOK_URL : "", webhookInitialArguments);
                    reports = attachmentReports(parsedReport);
                    _a = _status;
                    switch (_a) {
                        case TestStatus_1.TestStatus.error: return [3 /*break*/, 1];
                        case TestStatus_1.TestStatus.failed: return [3 /*break*/, 6];
                        case TestStatus_1.TestStatus.passed: return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 1:
                    sendArguments = webhookSendArgs(sendArgs, [reports]);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, webhook.send(sendArguments)];
                case 3: return [2 /*return*/, _b.sent()];
                case 4:
                    e_1 = _b.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 13];
                case 6:
                    sendArguments = webhookSendArgs(sendArgs, [reports]);
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 9, , 10]);
                    return [4 /*yield*/, webhook.send(sendArguments)];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 9:
                    e_2 = _b.sent();
                    console.log(e_2);
                    return [3 /*break*/, 10];
                case 10: return [3 /*break*/, 13];
                case 11: 
                // we don not send report on pass by now
                return [3 /*break*/, 13];
                case 12:
                    {
                        throw new Error("An error occurred getting the status of the test run");
                    }
                    _b.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.constructMessage = constructMessage;
function webhookSendArgs(argsWebhookSend, messageAttachments) {
    var _a;
    argsWebhookSend = {
        attachments: messageAttachments,
        blocks: [
            {
                type: 'section', text: {
                    type: 'mrkdwn',
                    text: ":fire: look like you better check your BDD tests :triumph: on [github](https://github.com/" + process.env.TRAVIS_REPO_SLUG + ")"
                }
            },
            { type: 'divider' },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: "*check build #" + process.env.TRAVIS_BUILD_NUMBER + "* :point_right:",
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: true,
                        text: "#" + process.env.TRAVIS_BUILD_NUMBER
                    },
                    url: "" + ((_a = process.env.TRAVIS_BUILD_WEB_URL) !== null && _a !== void 0 ? _a : '')
                }
            },
            {
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: "*check job #" + process.env.TRAVIS_JOB_NUMBER + "* :point_right:",
                },
                accessory: {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        emoji: false,
                        text: "#" + process.env.TRAVIS_JOB_NUMBER
                    },
                    url: "" + process.env.TRAVIS_JOB_WEB_URL
                }
            },
            { type: 'divider' }
        ]
    };
    return argsWebhookSend;
}
exports.webhookSendArgs = webhookSendArgs;
function attachmentReports(parsedReport) {
    var _status = parsedReport.status, totalPasses = parsedReport.totalPasses, totalTests = parsedReport.totalTests, totalFailures = parsedReport.totalFailures;
    switch (_status) {
        case TestStatus_1.TestStatus.passed: {
            return {
                color: "#36a64f",
                // fallback: `Report available at ${reportHTMLUrl}`,
                text: "Total Passed:  " + totalPasses
            };
        }
        case TestStatus_1.TestStatus.failed: {
            return {
                color: "#ff0000",
                // fallback: `Report available at ${reportHTMLUrl}`,
                title: "Total Failed: " + totalFailures,
                text: "Total Tests: " + totalTests + "\nTotal Passed:  " + totalPasses + " ",
            };
        }
        case TestStatus_1.TestStatus.error: {
            return {
                color: "#ff0000",
                // fallback: `Build Log available at ${CI_BUILD_URL}`,
                text: "Total Passed:  " + totalPasses + " "
            };
        }
        default: {
            break;
        }
    }
    return {};
}
exports.attachmentReports = attachmentReports;
