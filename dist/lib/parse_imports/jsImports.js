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
function displayImportsMap(map) {
    Object.keys(map).forEach(key => {
        console.log((0, cli_color_1.yellow)(`KEY: ${key}`));
        map[key].forEach((item, index) => {
            console.log((0, cli_color_1.green)(`  Key ${index + 1}:`));
            console.log((0, cli_color_1.green)(`    parent_path: ${item.parent_path}`));
            console.log((0, cli_color_1.green)(`    full_path_child: ${item.full_path_child}`));
            console.log((0, cli_color_1.green)(`    half_path_child: ${item.half_path_child}`));
        });
        console.log('---');
    });
}
function checkDependenciesInFile(importsData, proj_dependencies, regex, parent_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let file_path = parent_path;
        // console.log(blueBright(bgBlue("<--<"),file_path.substring(43)))
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
function INITIAL_START_parseJsImports(regex, proj_dependencies, parent_path, //* FOR INITIAL PATH IT SHOULD BE "<START>"
child_path, //* This is initial file path like ("../user.js"),
finalAns) {
    return __awaiter(this, void 0, void 0, function* () {
        let child_path_parent = path_1.default.join(process.cwd(), child_path);
        let importsInAFile = [];
        console.log((0, cli_color_1.bgMagentaBright)("###############################"));
        yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_parent);
        const initialValues = {
            parent_path: "Start",
            parent_full_path: path_1.default.join(process.cwd(), child_path),
            half_path_child: child_path,
            full_path_child: child_path_parent
        };
        // finalAns["Start"] = [initialValues];
        const parent_full_path = path_1.default.join(process.cwd(), child_path);
        for (let i = 0; i < importsInAFile.length; i++) {
            const imp = importsInAFile[i];
            const pathChild = path_1.default.join(process.cwd(), path_1.default.dirname(child_path), imp.from);
            const DS = {
                parent_path: child_path,
                parent_full_path: parent_full_path,
                half_path_child: imp.from,
                full_path_child: pathChild,
            };
            console.log((0, cli_color_1.magentaBright)(child_path), DS);
            // finalAns[child_path] = [DS];
            yield parseJsImportsDFS(regex, proj_dependencies, finalAns, pathChild, child_path, parent_full_path);
        }
        // displayImportsMap(finalAns);
        // console.log(finalAns)
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, finalAns, parent_path, child_path, parent_full_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        let path_parent = ""; //* Parent with extension
        if (fs_1.default.existsSync(parent_path)) {
            path_parent = parent_path;
            yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, parent_path);
        }
        else {
            for (const ext of jstsExtensions_1.default) {
                let pathChild = `${parent_path}${ext}`;
                if (fs_1.default.existsSync(pathChild)) {
                    path_parent = pathChild;
                    yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, pathChild);
                }
                else {
                }
            }
        }
        //* ADD IN DATA.S HERE
        if (importsInAFile.length > 0) {
            for (const imp of importsInAFile) {
                let child_path = path_1.default.join(path_1.default.dirname(path_parent), imp.from);
                let parent_full_path = path_1.default.join(process.cwd(), path_parent);
                const DS = {
                    parent_path: path_parent,
                    parent_full_path: parent_full_path,
                    full_path_child: child_path,
                    half_path_child: imp.from
                };
                // console.log(magentaBright(child_path),DS)
                // finalAns[imp.from] = [DS];
                console.log((0, cli_color_1.blueBright)(imp.from), DS);
                yield parseJsImportsDFS(regex, proj_dependencies, finalAns, child_path, imp.from, parent_full_path);
            }
        }
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
