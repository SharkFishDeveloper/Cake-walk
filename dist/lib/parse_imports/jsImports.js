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
exports.parseJsImportsDFS = exports.INITIAL_START_parseJsImports = void 0;
const cli_color_1 = require("cli-color");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jstsExtensions_1 = __importDefault(require("../extensions/jstsExtensions"));
function checkDependenciesInFile(importsData, proj_dependencies, regex, parent_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let file_path = parent_path;
        const file_content = fs_1.default.readFileSync(file_path, "utf-8");
        let match;
        while ((match = regex.exec(file_content)) !== null) {
            const imports = match[1];
            const from = match[2];
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
function INITIAL_START_parseJsImports(regex, proj_dependencies, parent_path, child_path, finalAns) {
    return __awaiter(this, void 0, void 0, function* () {
        let child_path_with_parent_path = path_1.default.join(process.cwd(), child_path);
        let importsInAFile = [];
        console.log((0, cli_color_1.bgMagentaBright)("###############################"));
        const initialValues = {
            half_parent_path: "Start",
            full_parent_path: "Initial parent full path",
            half_path_child: child_path,
            full_path_child: child_path_with_parent_path
        };
        finalAns["Start"] = [initialValues];
        //* Get all the imports for App.js
        yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_with_parent_path);
        const parent_full_path = path_1.default.join(process.cwd(), child_path);
        for (let i = 0; i < importsInAFile.length; i++) {
            const imp = importsInAFile[i];
            let extOfFile = null;
            let path_Child_Complete = path_1.default.join(path_1.default.dirname(parent_full_path), imp.from);
            if (!fs_1.default.existsSync(path_Child_Complete)) {
                for (const ext of jstsExtensions_1.default) {
                    let temp_path = `${path_Child_Complete}${ext}`;
                    extOfFile = ext;
                    if (fs_1.default.existsSync(path_Child_Complete)) {
                        path_Child_Complete = temp_path;
                    }
                }
            }
            const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
            console.log(`Visiting, ${i + 1}`, child_half_path);
            const DS = {
                half_parent_path: child_path,
                full_parent_path: parent_full_path,
                half_path_child: child_half_path,
                full_path_child: path_Child_Complete,
            };
            finalAns[child_path] = [DS];
            //*                                                       //Parent's full path //Parent's half path
            yield parseJsImportsDFS(regex, proj_dependencies, finalAns, path_Child_Complete, child_half_path);
        }
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, finalAns, parent_full_path, parent_half_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, parent_full_path);
        //* ADD IN DATA.S HERE
        console.log(importsInAFile);
        if (importsInAFile.length > 0) {
            for (const imp of importsInAFile) {
                let child_path = path_1.default.join(path_1.default.dirname(parent_full_path), imp.from);
                let pathChild_withExtension = "DNE";
                let extOfFile = null;
                if (!fs_1.default.existsSync(child_path)) {
                    for (const ext of jstsExtensions_1.default) {
                        let temp_path = `${child_path}${ext}`;
                        if (fs_1.default.existsSync(temp_path)) {
                            pathChild_withExtension = temp_path;
                            extOfFile = ext;
                            break;
                        }
                    }
                }
                const half_path_child = extOfFile === null ? imp.from : `${imp.from}${extOfFile}`;
                const DS = {
                    half_parent_path: parent_half_path,
                    full_parent_path: parent_full_path,
                    half_path_child: half_path_child,
                    full_path_child: pathChild_withExtension,
                };
                console.log((0, cli_color_1.green)(parent_half_path, "->", half_path_child));
                if (pathChild_withExtension !== "DNE") {
                    finalAns[half_path_child] = [DS];
                    console.log((0, cli_color_1.magentaBright)("V->", imp.from));
                    yield parseJsImportsDFS(regex, proj_dependencies, finalAns, pathChild_withExtension, half_path_child);
                }
            }
        }
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
