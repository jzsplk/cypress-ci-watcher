"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestStatus_1 = require("../../constants/TestStatus");
function webhookInitialArgs(initialArgs, _status) {
    var statusText;
    switch (_status) {
        case TestStatus_1.TestStatus.passed: {
            statusText = "test run passed";
            break;
        }
        case TestStatus_1.TestStatus.failed: {
            statusText = "test run failed";
            break;
        }
        case TestStatus_1.TestStatus.error: {
            statusText = "test build failed";
            break;
        }
        default: {
            statusText = "test status unknown";
            break;
        }
    }
    return (initialArgs = {
        text: "" + statusText
    });
}
exports.webhookInitialArgs = webhookInitialArgs;
