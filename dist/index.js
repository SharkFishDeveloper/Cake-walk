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
const doSomething_1 = require("./lib/crawler/doSomething");
// ./repo/Fundrz-client/App.js
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //? Add logic so it does not ask question again and agai
            // fs.rmSync('deepdive.yml', { force: true });
            if (!fs_1.default.existsSync('barrenland.yml')) {
                // console.log("DEONS not exists")
                //@ts-ignore
                const prompt_answer = yield inquirer_1.default.prompt(prompt_questions_js_1.default);
                let dependencies = yield (0, prompt_depedecy_list_1.readDependenciesFromPromt)(prompt_answer.language, prompt_answer.startPoint);
                const ymlData = {
                    codebase: [prompt_answer.language],
                    start: [
                        {
                            path: prompt_answer.startPoint,
                            tag: prompt_answer.startPointTag,
                        },
                    ],
                    pathVisibility: prompt_answer.ansFormat,
                    excludeFolders: [
                        'node_modules',
                        '.git',
                        '.gitignore',
                        'package-lock.json',
                        'package.json',
                        'public',
                        'README.md'
                    ],
                    exclude: [dependencies],
                };
                let yamlString = js_yaml_1.default.dump(ymlData, {
                    indent: 8,
                    lineWidth: 80,
                    noRefs: true,
                    skipInvalid: true,
                });
                yamlString = yamlString.replace(/^(\w+):\n/gm, '\n$1:\n');
                fs_1.default.writeFileSync('barrenland.yml', yamlString);
                console.log((0, cli_color_1.yellowBright)(`I made deepdive.yml file, please fill it and then continue. 
          Feel free to edit it! You can:
          - Add multiple starting points
          - Exclude any files or directories`));
            }
            else {
                // console.log("Exists")
                //* if yml is already present, then perform this FX
                yield handleParsedDataAfterPrompt();
            }
        }
        catch (error) {
            console.log((0, cli_color_1.red)(error));
        }
    });
}
function processDependencies(startFiles, all_dependencies, language) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const start of startFiles || []) {
            //@ts-ignore
            const dependencies = yield (0, prompt_depedecy_list_1.readDependenciesFromPromt)(language, start);
            // Ensure that 'react' and 'react-router-dom' are always added
            all_dependencies.push('react', 'react-router-dom', ...dependencies);
        }
        // Read the existing YAML file
        const yamlString = fs_1.default.readFileSync('barrenland.yml', 'utf-8');
        const parsedYaml = js_yaml_1.default.load(yamlString);
        // Step 3: Merge existing exclude data with new dependencies
        if (parsedYaml && typeof parsedYaml === 'object') {
            //@ts-ignore
            const existingExcludes = Array.isArray(parsedYaml['exclude'])
                ? parsedYaml['exclude']
                : [];
            // Ensure we merge without duplicates
            const combinedExcludes = [...new Set([...existingExcludes, ...all_dependencies])];
            //@ts-ignore
            parsedYaml['exclude'] = combinedExcludes;
        }
        // Convert updated object back to YAML
        const updatedYamlString = js_yaml_1.default.dump(parsedYaml);
        // Write the updated YAML string back to the file
        fs_1.default.writeFileSync('barrenland.yml', updatedYamlString);
        return;
    });
}
function handleParsedDataAfterPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync('barrenland.yml', 'utf8');
        const parsedData = js_yaml_1.default.load(fileContent);
        //@ts-ignore
        let dataOfYml = parsedData.start;
        let startFiles = dataOfYml === null || dataOfYml === void 0 ? void 0 : dataOfYml.map((item) => item.path);
        let tags = dataOfYml === null || dataOfYml === void 0 ? void 0 : dataOfYml.map((item) => item.tag);
        // return;
        //@ts-ignore
        let language = parsedData.codebase;
        //@ts-ignore
        let howToSeeDependencies = parsedData.pathVisibility;
        if (!howToSeeDependencies || howToSeeDependencies === null) {
            return console.log((0, cli_color_1.redBright)('Please fill how to see dependencies in Deepdive.yml ...'));
        }
        //@ts-ignore
        let excludeFolders = parsedData.excludeFolders;
        if (!excludeFolders || excludeFolders === null || excludeFolders.length === 0) {
            return console.log((0, cli_color_1.redBright)('Please fill the folders you want to  exclude, like node_modules ...'));
        }
        if (language === null ||
            !language ||
            !language[0] ||
            startFiles == null ||
            (startFiles === null || startFiles === void 0 ? void 0 : startFiles.length) === 0) {
            return console.log((0, cli_color_1.redBright)('Please fill properly in Deepdive.yml ...'));
        }
        let all_dependencies = [];
        //* < ------- >
        //* this function is just for reading the starting Files and all their dependencies
        yield processDependencies(startFiles, all_dependencies, language[0]);
        // console.log(all_dependencies)
        //* < ------- >
        // return;
        //@ts-ignore
        let proj_dependenciesdependencies = parsedData.exclude[0];
        // console.log(startFiles,tags,startFiles.length,startFiles[0])
        if (!startFiles ||
            startFiles.length === 0 ||
            startFiles.some((file) => file.trim() === '')) {
            return console.log((0, cli_color_1.redBright)('Please enter the start files in Deepdive.yml ...'));
        }
        if (!tags ||
            tags.length === 0 ||
            tags.some((file) => file.trim() === '') ||
            tags.length !== startFiles.length) {
            return console.log((0, cli_color_1.redBright)('Please enter the start tags in Deepdive.yml ...'));
        }
        if (proj_dependenciesdependencies === null ||
            proj_dependenciesdependencies.length === 0) {
            return console.log((0, cli_color_1.redBright)('Please fill all the dependencies in  Deepdive.yml ...'));
        }
        let finalAns = {};
        yield (0, doSomething_1.doSomething)(startFiles, tags, language, all_dependencies !== null && all_dependencies !== void 0 ? all_dependencies : [], finalAns, howToSeeDependencies, excludeFolders);
    });
}
start();
