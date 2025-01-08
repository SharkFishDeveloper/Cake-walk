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
const cli_color_1 = require("cli-color");
const readDir_1 = require("../util/readDir");
const fs_1 = __importDefault(require("fs"));
let regex;
let proj_dependencies;
function doSomething(startfileArray, tags, language, dependencies, finalAns, howToSeeDependencies, excludeFolders) {
    return __awaiter(this, void 0, void 0, function* () {
        proj_dependencies = dependencies;
        //* add multiple switch statements for importing a particular language's REGEX
        switch (language[0]) {
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
                regex = javascript_1.default;
                for (let i = 0; i < startfileArray.length; i++) {
                    const stat = yield fs_1.default.promises.lstat(startfileArray[i]);
                    try {
                        if (stat.isDirectory()) {
                            console.log((0, cli_color_1.whiteBright)("Processed :--> ", tags[i], "\n"));
                            const filesArray = yield (0, readDir_1.getFilesInDirectory)(startfileArray[i], tags[i], excludeFolders);
                            for (let j = 0; j < filesArray.length; j++) {
                                yield readImports(filesArray[j].short_path, filesArray[j].name, finalAns, howToSeeDependencies, excludeFolders);
                            }
                        }
                        else if (stat.isFile()) {
                            console.log((0, cli_color_1.whiteBright)("Processed :--> ", tags[i], "\n"));
                            yield readImports(startfileArray[i], tags[i], finalAns, howToSeeDependencies, excludeFolders);
                            // console.log(greenBright("<--Next-->"));
                        }
                    }
                    catch (error) {
                        console.log((0, cli_color_1.red)('An error occurred during file processing.', error));
                    }
                    finally {
                        console.log((0, cli_color_1.blueBright)("<--Finished-->", "\n"));
                    }
                }
            // try {
            //   for (let i = 0; i < startfileArray.length; i++) {
            //     console.log(blueBright("Processed file:--> ", tags[i], "\n"));
            //     console.log("Start");
            //     await readImports(startfileArray[i], tags[i], finalAns, howToSeeDependencies);
            //   }
            //   console.log(greenBright("<--Finished-->"));
            // } catch (error) {
            //   console.error('An error occurred during file processing.');
            //   console.error(error);
            // }
        }
    });
}
exports.doSomething = doSomething;
function readImports(startfile, tag, finalAns, howToSeeDependencies, excludeFolders) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, jsImports_1.INITIAL_START_parseJsImports)(regex, proj_dependencies, startfile, tag, finalAns, howToSeeDependencies, excludeFolders);
        }
        catch (error) {
            console.log((0, cli_color_1.redBright)(error));
        }
    });
}
exports.readImports = readImports;
