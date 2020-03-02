"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
function getFiles(dir, ext, fileList) {
    if (!fs.existsSync(dir) && path.basename(dir) === "mochareports") {
        return fileList;
    }
    else if (!fs.existsSync(dir)) {
        return fileList;
    }
    else {
        var files = fs.readdirSync(dir);
        files.forEach(function (file) {
            var filePath = dir + "/" + file;
            if (fs.statSync(filePath).isDirectory()) {
                getFiles(filePath, ext, fileList);
            }
            else if (path.extname(file) === ext) {
                fileList.push(filePath);
            }
        });
        return fileList;
    }
}
exports.getFiles = getFiles;
