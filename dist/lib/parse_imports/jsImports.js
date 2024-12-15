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
        console.log((0, cli_color_1.blueBright)((0, cli_color_1.bgBlue)("<--<"), file_path.substring(43)));
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
child_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let child_path_parent = path_1.default.join(process.cwd(), child_path);
        let importsInAFile = [];
        console.log((0, cli_color_1.bgMagentaBright)("###############################"));
        yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_parent);
        for (let i = 0; i < importsInAFile.length; i++) {
            const imp = importsInAFile[i];
            const pathChild = path_1.default.join(process.cwd(), path_1.default.dirname(child_path), imp.from);
            yield parseJsImportsDFS(regex, proj_dependencies, pathChild);
        }
        // importsInAFile.forEach(async(imp,i)=>{
        //   const pathChild = path.join(process.cwd(),path.dirname(child_path),imp.from);
        //   await parseJsImportsDFS(regex,proj_dependencies,pathChild);
        // })
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, parent_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        if (fs_1.default.existsSync(parent_path)) {
            yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, parent_path);
        }
        else {
            for (const ext of jstsExtensions_1.default) {
                let pathChild = `${parent_path}${ext}`;
                if (fs_1.default.existsSync(pathChild)) {
                    console.log(pathChild);
                    yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, pathChild);
                }
                else {
                }
            }
        }
        if (importsInAFile.length > 0) {
            for (const imp of importsInAFile) {
                console.log("|->", "P->", (0, cli_color_1.green)(parent_path), imp.from);
                let child_path = path_1.default.join(path_1.default.dirname(parent_path), imp.from);
                yield parseJsImportsDFS(regex, proj_dependencies, child_path);
            }
        }
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
// for (const imp of importsInAFile) {
//     console.log("|->", "P->", green(parent_path), imp.from);
//     let child_path = path.join(path.dirname(parent_path), imp.from);
//     if(fs.existsSync(child_path)){
//       await parseJsImportsDFS(regex, proj_dependencies, child_path);
//     }
//     else{
//       for (const ext of TsJsextensions) {
//         let pathChild = `${child_path}${ext}`;
//         if(fs.existsSync(pathChild)){
//           child_path = path.join(child_path,ext);
//           console.log(child_path)
//           await parseJsImportsDFS(regex,proj_dependencies,pathChild)
//           return;
//         }else{
//         }
//       }
//     }
//  }
