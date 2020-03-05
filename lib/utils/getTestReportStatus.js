"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TestStatus_1 = require("../constants/TestStatus");
var fs = __importStar(require("fs"));
var getFiles_1 = require("./getFiles");
function reportParser(reportDir) {
    var reportFile = getFiles_1.getFiles(reportDir, ".json", []);
    var status = TestStatus_1.TestStatus.error;
    if (reportFile.length === 0) {
        throw new Error("Cannot find json test report @ " + reportDir);
    }
    else if (reportFile.length >= 2) {
        throw new Error("Multiple json reports found, please run mochawesome-merge to provide a single report");
    }
    else {
        var rawData = fs.readFileSync(reportFile[0]);
        var parsedData = JSON.parse(rawData.toString());
        var reportStats = parsedData.stats;
        var totalSuites = reportStats.suites;
        var totalTests = reportStats.tests;
        var totalPasses = reportStats.passes;
        var totalFailures = reportStats.failures;
        var totalDuration = reportStats.duration;
        if (totalTests === undefined || totalTests === 0) {
            status = TestStatus_1.TestStatus.error;
        }
        else if (totalFailures > 0 || totalPasses === 0) {
            status = TestStatus_1.TestStatus.failed;
        }
        else if (totalFailures === 0) {
            status = TestStatus_1.TestStatus.passed;
        }
        console.log("parsed data", parsedData);
        var result = {
            totalSuites: totalSuites,
            totalTests: totalTests,
            totalPasses: totalPasses,
            totalFailures: totalFailures,
            totalDuration: totalDuration,
            reportFile: reportFile,
            status: status
        };
        console.log("parsed", result);
        return result;
    }
}
exports.reportParser = reportParser;
