"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.parseJsImportsDFS = exports.INITIAL_START_parseJsImports = void 0;
const cli_color_1 = __importStar(require("cli-color"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jstsExtensions_1 = __importDefault(require("../extensions/jstsExtensions"));
function checkDependenciesInFile(importsData, proj_dependencies, regex, parent_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let file_path = parent_path;
        if (!fs_1.default.existsSync(file_path)) {
            for (const ext of jstsExtensions_1.default) {
                const pathChild = path_1.default.join(file_path, ext);
                if (fs_1.default.existsSync(pathChild)) {
                    file_path = path_1.default.join(file_path, ext);
                    console.log((0, cli_color_1.yellowBright)("EX->", pathChild));
                    return;
                }
                else {
                    console.log((0, cli_color_1.red)("DNE", pathChild));
                }
            }
        }
        const file_content = fs_1.default.readFileSync(file_path, "utf-8");
        let match;
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];
            // Exclude imports where the "from" is in proj_dependencies
            if (!proj_dependencies.some(dep => from.startsWith(dep))) {
                if (imports.startsWith('{')) {
                    const importsList = imports
                        .replace(/[{}]/g, '')
                        .split(',')
                        .map((item) => item.trim());
                    importsList.forEach((imp) => {
                        importsData.push({ imported: imp, from });
                    });
                }
                else {
                    importsData.push({ imported: imports, from });
                }
            }
        }
    });
}
function INITIAL_START_parseJsImports(regex, proj_dependencies, parent_path, //* FOR INITIAL PATH IT SHOULD BE "<START>"
child_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let child_path_parent = path_1.default.join(process.cwd(), child_path);
        let importsInAFile = [];
        console.log(cli_color_1.default.magentaBright(parent_path, "<<<>>>"));
        checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_parent);
        importsInAFile.forEach((imp, i) => {
            const pathChild = path_1.default.join(process.cwd(), path_1.default.dirname(child_path), imp.from);
            // console.log(i+1,imp.from,pathChild)
            console.log(i + 1);
            parseJsImportsDFS(regex, proj_dependencies, pathChild);
        });
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, parent_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        checkDependenciesInFile(importsInAFile, proj_dependencies, regex, parent_path);
        console.log(cli_color_1.default.magentaBright("parent_path", "------", parent_path, "------"));
        importsInAFile.map((imp) => {
            console.log(cli_color_1.default.yellowBright("CHILD", imp.imported, imp.from));
        });
        console.log("\n");
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
