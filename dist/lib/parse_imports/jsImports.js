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
exports.parseJsImports = void 0;
const cli_color_1 = require("cli-color");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function parseJsImports(file_content, regex, proj_dependencies, base_path, startfile) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsData = [];
        let match;
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];
            // Exclude imports where the "from" is in proj_dependencies
            if (!proj_dependencies.some(dep => from.includes(dep))) {
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
        yield normalizeJsImports(importsData, base_path, startfile, regex, proj_dependencies);
        return importsData;
    });
}
exports.parseJsImports = parseJsImports;
//? What if the file import has no extension behind ?
const extensions = ['.js', '.ts', '.jsx', '.tsx', '.css'];
let ans;
function normalizeJsImports(importsData, base_path, startfile, regex, proj_dependencies) {
    return __awaiter(this, void 0, void 0, function* () {
        let vis = [];
        let removedFilePath = path_1.default.dirname(base_path);
        // const finalImportPath = path.join(removedFilePath,importsData[0].from);
        // dfs(finalImportPath,regex,proj_dependencies);
        importsData.forEach((imp) => {
            const finalImportPath = path_1.default.join(removedFilePath, imp.from);
            if (fs_1.default.existsSync(finalImportPath)) {
                // Do dfs
                console.log((0, cli_color_1.magenta)("Exists->", finalImportPath));
                dfs(finalImportPath, regex, base_path, proj_dependencies);
            }
            else {
                console.log((0, cli_color_1.redBright)("DOES NOT Exists->", finalImportPath));
            }
            return;
        });
    });
}
function dfs(finalImportPath, regex, base_path, proj_dependencies) {
    return __awaiter(this, void 0, void 0, function* () {
        const file_content = fs_1.default.readFileSync(finalImportPath, "utf-8");
        let importsData = [];
        let match;
        console.log((0, cli_color_1.greenBright)("ADD IMPORTS OF VISIT->", finalImportPath));
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];
            // Exclude imports where the "from" is in proj_dependencies
            if (!proj_dependencies.some(dep => from.includes(dep))) {
                // console.log(yellow(`Cannot exclude ${from}`))
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
        importsData.forEach((item) => {
            const dependency_path = path_1.default.join(path_1.default.dirname(finalImportPath), item.from);
            for (let ext of extensions) {
                const dependencyPath = path_1.default.join(dependency_path + ext);
                if (fs_1.default.existsSync(dependencyPath)) {
                    console.log((0, cli_color_1.blue)(`File found: ${dependencyPath}`, path_1.default.relative(base_path, dependencyPath)));
                    dfs(dependencyPath, regex, base_path, proj_dependencies);
                }
            }
        });
        console.log((0, cli_color_1.green)("________"));
    });
}
