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
const createHtmlFile_1 = require("../open-live/createHtmlFile");
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
        // let child_path_with_parent_path = path.join(process.cwd(), child_path);
        // let importsInAFile: JsImports[] = [];
        // const initialValues = {
        //   half_parent_path: "Start",
        //   full_parent_path: "Initial parent full path",
        //   half_path_child: child_path,
        //   full_path_child: child_path_with_parent_path
        // };
        // if (!finalAns["Start"]) {
        //   finalAns["Start"] = [];
        // }
        // console.log("V->",initialValues)
        // finalAns["Start"].push(initialValues);
        // await checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_with_parent_path);
        // const parent_full_path = path.join(process.cwd(), child_path);
        // for (let i = 0; i < importsInAFile.length; i++) {
        //   // if(i!=9)continue;
        //   const imp = importsInAFile[i];
        //   let extOfFile: string | null = null;
        //   const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
        //   console.log(`Visiting, ${i}`, magentaBright(child_path), child_half_path)
        //   let path_Child_Complete = path.join(path.dirname(parent_full_path), imp.from);
        //   if (!fs.existsSync(path_Child_Complete)) {
        //     for (const ext of TsJsextensions) {
        //       let temp_path = `${path_Child_Complete}${ext}`;
        //       extOfFile = ext;
        //       if (fs.existsSync(path_Child_Complete)) {
        //         path_Child_Complete = temp_path;
        //       }
        //     }
        //   }
        //   const DS = {
        //     half_parent_path: child_path,
        //     full_parent_path: parent_full_path,
        //     half_path_child: child_half_path,
        //     full_path_child: path_Child_Complete,
        //   };
        //   if (!finalAns[child_path]) {
        //     finalAns[child_path] = [];
        //   }
        //   finalAns[child_path].push(DS)
        //   await parseJsImportsDFS(regex, proj_dependencies, finalAns,
        //     imp.imported,
        //     child_half_path,
        //     path_Child_Complete,
        //     child_path,
        //     parent_full_path,
        //   );
        // }
        let edgesA = [
            { parent: 'a', child: 'b', import_name: 'edge1' },
            { parent: 'b', child: 'c', import_name: 'edge2' },
            { parent: 'c', child: 'd', import_name: 'edge2' },
            { parent: 'd', child: 'e', import_name: 'edge2' },
            { parent: 'a', child: 'f', import_name: 'edge2' },
            { parent: 'f', child: 'c', import_name: 'edge2' },
        ];
        const graph = createGraph(edgesA);
        (0, createHtmlFile_1.createHtmlFile)(graph);
        console.log(graph);
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, finalAns, childName, child_half_path, child_full_path, node_half_path, node_full_path) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        edges.push({ parent: node_half_path, child: child_half_path, import_name: childName });
        // console.log(bgBlack(yellow(node_half_path , child_half_path,green("Imported",white(childName)),"\n")))
        yield checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_full_path);
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
                    const DS = {
                        half_parent_path: node_half_path,
                        full_parent_path: node_full_path,
                        half_path_child: half_path_child,
                        full_path_child: pathChild_withExtension,
                    };
                    if (!finalAns[child_half_path]) {
                        finalAns[child_half_path] = [];
                    }
                    finalAns[child_half_path].push(DS);
                    yield parseJsImportsDFS(regex, proj_dependencies, finalAns, imp.imported, half_path_child, pathChild_withExtension, child_half_path, child_full_path);
                }
            }
        }
        else {
            const DS = {
                half_parent_path: node_half_path,
                full_parent_path: node_full_path,
                half_path_child: "Null",
                full_path_child: "Null",
            };
            if (!finalAns[child_half_path]) {
                finalAns[child_half_path] = [];
            }
            finalAns[child_half_path].push(DS);
        }
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
let edges = [];
const createGraph = (edges) => {
    const graph = {};
    edges.forEach(({ parent, child }) => {
        // Initialize the graph's parent node if it doesn't exist yet
        if (!graph[parent]) {
            graph[parent] = [];
        }
        // Only add the child node if it's not already in the parent's list
        if (!graph[parent].includes(child)) {
            graph[parent].push(child);
        }
    });
    return graph;
};
