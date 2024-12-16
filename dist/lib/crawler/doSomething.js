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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readImports = exports.doSomething = void 0;
const javascript_1 = __importDefault(require("../regex/javascript"));
const jsImports_1 = require("../parse_imports/jsImports");
const cli_color_1 = __importDefault(require("cli-color"));
const cli_color_2 = require("cli-color");
const cli_color_3 = __importDefault(require("cli-color"));
let regex;
let proj_dependencies;
function doSomething(startfileArray, language, dependencies, finalAns) {
    return __awaiter(this, void 0, void 0, function* () {
        proj_dependencies = dependencies;
        //* add multiple switch statements for importing a particular language's REGEX
        switch (language[0]) {
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
                regex = javascript_1.default;
        }
        for (const startfile of startfileArray) {
            yield readImports(startfile, finalAns);
        }
    });
}
exports.doSomething = doSomething;
function readImports(startfile, finalAns) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, jsImports_1.INITIAL_START_parseJsImports)(regex, proj_dependencies, "START", startfile, finalAns);
            console.log(cli_color_1.default.bold.green("Dependency Tree:"));
            printImportsMap(finalAns);
            // console.log("finalAns",finalAns)
        }
        catch (error) {
            console.log((0, cli_color_2.redBright)(error));
        }
    });
}
exports.readImports = readImports;
function printImportsMap(data) {
    for (const [childPath, entries] of Object.entries(data)) {
        console.log(cli_color_3.default.bold.blue(`Child Path: ${childPath}`));
        entries.forEach((entry, index) => {
            console.log(cli_color_3.default.green(`  Entry ${index + 1}:`));
            console.log(cli_color_3.default.cyan(`    Half Parent Path: ${entry.half_parent_path}`));
            console.log(cli_color_3.default.cyan(`    Full Parent Path: ${entry.full_parent_path}`));
            console.log(cli_color_3.default.yellow(`    Half Path Child: ${entry.half_path_child}`));
            console.log(cli_color_3.default.yellow(`    Full Path Child: ${entry.full_path_child}`));
            console.log(''); // Empty line for separation
        });
    }
}
