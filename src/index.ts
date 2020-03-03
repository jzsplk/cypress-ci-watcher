#!/usr/bin/env node
/// <reference path='../node_modules/cypress/types/cypress-npm-api.d.ts'/>
import * as CypressApi from "cypress";
import { sendMessage } from "./slack/utils/slack";
import { omit } from "lodash";
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
import program from "commander";
const marge = require("mochawesome-report-generator");
const { merge } = require("mochawesome-merge");
const del = require("del");
const yargs = require("yargs");

clear();
console.log(
  chalk.red(figlet.textSync("cypress-ci-watcher", { horizontalLayout: "full" }))
);

// cypress run below
function generateReport(options: any) {
  return merge(options).then((report: any) => marge.create(report, options));
}

const parsedArgs = omit(yargs.parse(process.argv.slice(2)), "_", "$0");
const options = {
  reporter: "cypress-multi-reporters",
  reporterOptions: {
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
  },
  ...parsedArgs
};

const runner = async function() {
  try {
    await CypressApi.run(options);

    const generatedReport = await generateReport({
      files: ["cypress/reports/mocha/*.json"],
      inline: true,
      saveJson: true
    });

    console.log("generated report: ", generatedReport);

    await del(["cypress/reports/mocha/mochawesome_*.json"]);

    await sendMessage("mochawesome-report");
  } catch (e) {
    console.log(e);
  }
};

program
  .version("0.0.1")
  .description("An example CLI for watch cypress run in ci")
  .option("-S, --spec", "You decide which folder to run test")
  .option("-e, --env", "Special env")
  .parse(process.argv);

const spec = program.spec;
const env = program.env;
console.log(`you start cypress run: --spec ${spec}`);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

runner();
