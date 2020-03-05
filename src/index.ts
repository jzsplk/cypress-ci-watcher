#!/usr/bin/env node
/// <reference path='../node_modules/cypress/types/cypress-npm-api.d.ts'/>
import * as CypressApi from "cypress";
import { sendMessage } from "./slack/utils/slack";
import _ from "lodash";
import { parseOpts } from "./utils/parseOpts";
import { exit, logErrorExit1 } from "./utils/process";
import logger from "./utils/logger";
const chalk = require("chalk");
const clear = require("clear");
const figlet = require("figlet");
const path = require("path");
import program from "commander";
const marge = require("mochawesome-report-generator");
const { merge } = require("mochawesome-merge");
const del = require("del");
const yargs = require("yargs");

// clear();
console.log(
  chalk.red(figlet.textSync("cypress-ci-watcher", { horizontalLayout: "full" }))
);

// cypress run below
function generateReport(options: any) {
  return merge(options).then((report: any) => marge.create(report, options));
}

const parsedArgs = _.omit(yargs.parse(process.argv.slice(2)), "_", "$0");
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

const spaceDelimitedArgsMsg = (flag: any, args: any) => {
  let msg = `

	  "${args.join(" ")}"

	  This will work, but it's not recommended.

	  If you are trying to pass multiple arguments, separate them with commas instead:
		cypress run --${flag} arg1,arg2,arg3
	`;

  if (flag === "spec") {
    msg += `
	  The most common cause of this warning is using an unescaped glob pattern. If you are
	  trying to pass a glob pattern, escape it using quotes:
		cypress run --spec "**/*.spec.js"
	  `;
  }

  logger.log();
  // logger.warn(stripIndent(msg))
  logger.log();
};

const parseVariableOpts = (
  fnArgs: [any, any],
  args: _.List<unknown> | null | undefined
) => {
  const [opts, unknownArgs] = fnArgs;

  if (unknownArgs && unknownArgs.length && (opts.spec || opts.tag)) {
    // this will capture space-delimited args after
    // flags that could have possible multiple args
    // but before the next option
    // --spec spec1 spec2 or --tag foo bar

    const multiArgFlags = _.compact([
      opts.spec ? "spec" : opts.spec,
      opts.tag ? "tag" : opts.tag
    ]);

    _.forEach(multiArgFlags, flag => {
      const argIndex = _.indexOf(args, `--${flag}`) + 2;
      const nextOptOffset = _.findIndex(_.slice(args, argIndex), (arg: any) => {
        return _.startsWith(arg, "--");
      });
      const endIndex =
        nextOptOffset !== -1 ? argIndex + nextOptOffset : args?.length ?? 0;

      const maybeArgs = _.slice(args, argIndex, endIndex);
      const extraArgs = _.intersection(maybeArgs, unknownArgs);

      if (extraArgs.length) {
        opts[flag] = [opts[flag]].concat(extraArgs);
        spaceDelimitedArgsMsg(flag, opts[flag]);
        opts[flag] = opts[flag].join(",");
      }
    });
  }

  // debug('variable-length opts parsed %o', { args, opts })

  return parseOpts(opts);
};

const descriptions = {
  browserOpenMode:
    "path to a custom browser to be added to the list of available browsers in Cypress",
  browserRunMode:
    "runs Cypress in the browser with the given name. if a filesystem path is supplied, Cypress will attempt to use the browser at that path.",
  cacheClear: "delete all cached binaries",
  cacheList: "list cached binary versions",
  cachePath: "print the path to the binary cache",
  ciBuildId:
    'the unique identifier for a run on your CI provider. typically a "BUILD_ID" env var. this value is automatically detected for most CI providers',
  config:
    "sets configuration values. separate multiple values with a comma. overrides any value in cypress.json.",
  configFile:
    'path to JSON file where configuration values are set. defaults to "cypress.json". pass "false" to disable.',
  detached: "runs Cypress application in detached mode",
  dev: "runs cypress in development and bypasses binary check",
  env:
    "sets environment variables. separate multiple values with a comma. overrides any value in cypress.json or cypress.env.json",
  exit: "keep the browser open after tests finish",
  forceInstall: "force install the Cypress binary",
  global: "force Cypress into global mode as if its globally installed",
  group: "a named group for recorded runs in the Cypress Dashboard",
  headed:
    "displays the browser instead of running headlessly (defaults to true for Firefox and Chromium-family browsers)",
  headless:
    "hide the browser instead of running headed (defaults to true for Electron)",
  key:
    "your secret Record Key. you can omit this if you set a CYPRESS_RECORD_KEY environment variable.",
  parallel:
    "enables concurrent runs and automatic load balancing of specs across multiple machines or processes",
  port: "runs Cypress on a specific port. overrides any value in cypress.json.",
  project: "path to the project",
  record:
    "records the run. sends test results, screenshots and videos to your Cypress Dashboard.",
  reporter:
    'runs a specific mocha reporter. pass a path to use a custom reporter. defaults to "spec"',
  reporterOptions: 'options for the mocha reporter. defaults to "null"',
  spec: 'runs specific spec file(s). defaults to "all"',
  tag: "named tag(s) for recorded runs in the Cypress Dashboard",
  version: "prints Cypress version"
};

// helpers
type Description = typeof descriptions;
type KeyOfDescriptiion = keyof Description;

const text = (description: KeyOfDescriptiion) => {
  if (!descriptions[description]) {
    throw new Error(`Could not find description for: ${description}`);
  }

  return descriptions[description];
};

const coerceFalse = (arg: string) => {
  return arg !== "false";
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

    await exit(0);
  } catch (e) {
    logErrorExit1(e);
  }
};

program.usage("<command> [options]");

// program
//   .version("0.0.1")
//   .description("An example CLI for watch cypress run in ci");

program
  .command("help")
  .description("Shows CLI help and exits")
  .action(() => {
    program.help();
  });

program
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
  .action(async (...fnArgs: [any, any]) => {
    // debug('running Cypress with args %o', fnArgs)
    const args = process.argv;
    const mergedOptions = { ...options, ...parseVariableOpts(fnArgs, args) };
    console.log("merged options", mergedOptions);
    try {
      await CypressApi.run(mergedOptions);

      const generatedReport = await generateReport({
        files: ["cypress/reports/mocha/*.json"],
        inline: true,
        saveJson: true
      });

      console.log("generated report: ", generatedReport);

      await del(["cypress/reports/mocha/mochawesome_*.json"]);

      await sendMessage("mochawesome-report");

      await exit(0);
    } catch (e) {
      logErrorExit1(e);
    }
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
