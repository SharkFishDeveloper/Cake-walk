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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jstsExtensions_1 = __importDefault(require("../extensions/jstsExtensions"));
const read_dep_in_files_1 = require("../read_dependencies/read-dep-in-files");
const createHtmlFile_1 = require("../open-live/createHtmlFile");
function INITIAL_START_parseJsImports(regex, proj_dependencies, child_path, // starting file location eg- src/pages/App.js
tag, // starting file name eg- App.js
finalAns) {
    return __awaiter(this, void 0, void 0, function* () {
        let child_path_with_parent_path = path_1.default.join(process.cwd(), child_path);
        let importsInAFile = [];
        yield (0, read_dep_in_files_1.checkDependenciesInFile)(importsInAFile, proj_dependencies, regex, child_path_with_parent_path);
        const parent_full_path = path_1.default.join(process.cwd(), child_path);
        // adapt this for multiple starting files
        edges.push({ parent: "Start", child: child_path, import_name: "App.js", parent_path: "Start" });
        for (let i = 0; i < importsInAFile.length; i++) {
            const imp = importsInAFile[i];
            let extOfFile = null;
            const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
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
            yield parseJsImportsDFS(regex, proj_dependencies, finalAns, imp.imported, child_half_path, path_Child_Complete, child_path, parent_full_path, tag);
            break;
        }
        const graph = createGraph(edges);
        // let edgesA: Edge[] = [
        //   { parent: 'a', child: 'b', import_name: 'edge1' },
        //   { parent: 'b', child: 'c', import_name: 'edge2' },
        //   { parent: 'c', child: 'd', import_name: 'edge3' },
        //   { parent: 'd', child: 'e', import_name: 'edge4' },
        //   { parent: 'a', child: 'f', import_name: 'edge5' }
        // ];
        yield (0, createHtmlFile_1.createHtmlFile)(graph, "Start");
        console.log("graph", graph);
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, finalAns, childName, child_half_path, child_full_path, node_half_path, node_full_path, parent_name) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        // console.log(node_half_path,magenta("->"),parent_name,yellow("->"),child_half_path,childName)
        edges.push({ parent: node_half_path, child: child_half_path, import_name: childName, parent_path: parent_name });
        // console.log(bgBlack(yellow("parent:",node_half_path , "child:",child_half_path,green("import_name:",white(childName)),"\n"),blue("parentName: ",parent_name),))
        yield (0, read_dep_in_files_1.checkDependenciesInFile)(importsInAFile, proj_dependencies, regex, child_full_path);
        if (importsInAFile.length > 0) {
            for (const imp of importsInAFile) {
                let child_path = path_1.default.join(path_1.default.dirname(child_full_path), imp.from);
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
                else {
                    pathChild_withExtension = child_path;
                }
                const half_path_child = extOfFile === null ? imp.from : `${imp.from}${extOfFile}`;
                if (pathChild_withExtension !== "DNE") {
                    yield parseJsImportsDFS(regex, proj_dependencies, finalAns, imp.imported, half_path_child, pathChild_withExtension, child_half_path, child_full_path, childName);
                }
            }
        }
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
let edges = [];
const createGraph = (F) => {
    const graph = {};
    edges.forEach(({ parent, child, import_name, parent_path }) => {
        if (!graph[parent]) {
            graph[parent] = [];
        }
        const childExists = graph[parent].some(entry => entry.child === child);
        if (!childExists) {
            graph[parent].push({ child, import_name, parent_path });
        }
    });
    return graph;
};
