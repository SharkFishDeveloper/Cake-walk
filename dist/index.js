#!/usr/bin/env node
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
const cli_color_1 = require("cli-color");
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const inquirer_1 = __importDefault(require("inquirer"));
const prompt_questions_js_1 = __importDefault(require("./lib/util/prompt_questions.js"));
const prompt_depedecy_list_1 = require("./lib/util/prompt_depedecy_list");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //? Add logic so it does not ask question again and agai
            if (!fs_1.default.existsSync('deepdive.yml')) {
                //@ts-ignore
                const prompt_answer = yield inquirer_1.default.prompt(prompt_questions_js_1.default);
                let dependencies = yield (0, prompt_depedecy_list_1.readDependenciesFromPromt)(prompt_answer.language);
                const ymlData = {
                    codebase: [prompt_answer.language],
                    start: [prompt_answer.startPoint],
                    dependencies: [dependencies],
                    // exclude:["//eg. files or folders which you want to exclude"],
                    // components: '',
                };
                let yamlString = js_yaml_1.default.dump(ymlData, {
                    indent: 8,
                    lineWidth: 80,
                    noRefs: true,
                    skipInvalid: true,
                });
                yamlString = yamlString.replace(/^(\w+):\n/gm, '\n$1:\n');
                fs_1.default.writeFileSync('deepdive.yml', yamlString);
                console.log((0, cli_color_1.yellowBright)(`I made deepdive.yml file, please fill it and then continue. 
          Feel free to edit it! You can:
          - Add multiple starting points
          - Exclude any files or directories`));
            }
            else {
                handleParsedDataAfterPrompt();
            }
        }
        catch (error) {
            console.log((0, cli_color_1.red)(error));
        }
    });
}
function handleParsedDataAfterPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync('deepdive.yml', 'utf8');
        const parsedData = js_yaml_1.default.load(fileContent);
        //@ts-ignore
        let startFiles = parsedData.start;
        if (startFiles === null || startFiles.length === 0) {
            return console.log((0, cli_color_1.redBright)('Please enter the start files in Deepdive.yml ...'));
        }
    });
}
start();
