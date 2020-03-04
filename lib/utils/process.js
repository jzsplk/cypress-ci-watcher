"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = __importDefault(require("./logger"));
function exit(code) {
    process.exit(code);
}
exports.exit = exit;
;
function logErrorExit1(err) {
    logger_1.default.error(err.message);
    process.exit(1);
}
exports.logErrorExit1 = logErrorExit1;
;
