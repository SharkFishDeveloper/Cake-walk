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
const path_1 = __importDefault(require("path"));
const javascript_1 = __importDefault(require("../regex/javascript"));
const fs_1 = __importDefault(require("fs"));
const jsImports_1 = require("../parse_imports/jsImports");
const cli_color_1 = require("cli-color");
let regex;
let proj_dependencies;
function doSomething(startfile, language, dependencies) {
    return __awaiter(this, void 0, void 0, function* () {
        proj_dependencies = dependencies;
        switch (language[0]) {
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
                regex = javascript_1.default;
        }
        readImports(startfile);
    });
}
exports.doSomething = doSomething;
function readImports(startfile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const base_path = path_1.default.join(process.cwd(), startfile);
            const file_content = fs_1.default.readFileSync(base_path, 'utf-8');
            let importsData = [];
            //* make diff functions for diff languages that do all the work of checking path and dependency, use a switch statement
            //* < ----- >
            importsData = yield (0, jsImports_1.parseJsImports)(file_content, regex, proj_dependencies);
            //* < ----- >
        }
        catch (error) {
            console.log((0, cli_color_1.redBright)(error));
        }
    });
}
exports.readImports = readImports;
