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
const read_dep_in_files_1 = require("../read_dependencies/read-dep-in-files");
function INITIAL_START_parseJsImports(regex, proj_dependencies, child_path, // starting file location eg- src/pages/App.js
tag, dirLocation, dirTag, finalAns, howToSeeDependencies) {
    return __awaiter(this, void 0, void 0, function* () {
        let edges = [];
        let child_path_with_parent_path = path_1.default.join(process.cwd(), child_path);
        let importsInAFile = [];
        yield (0, read_dep_in_files_1.checkDependenciesInFile)(importsInAFile, proj_dependencies, regex, child_path_with_parent_path);
        let refinedImports = [];
        const parent_full_path = path_1.default.join(process.cwd(), child_path);
        for (let i = 0; i < importsInAFile.length; i++) {
            const imp = importsInAFile[i];
            let extOfFile = null;
            const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
            let path_Child_Complete = path_1.default.join(path_1.default.dirname(parent_full_path), imp.from);
            if (!fs_1.default.existsSync(path_Child_Complete)) {
                for (const ext of jstsExtensions_1.default) {
                    let temp_path = `${path_Child_Complete}${ext}`;
                    extOfFile = ext;
                    if (fs_1.default.existsSync(temp_path)) {
                        path_Child_Complete = temp_path;
                        break;
                    }
                }
            }
            if (fs_1.default.existsSync(path_Child_Complete)) {
                refinedImports.push(path_Child_Complete);
                yield parseJsImportsDFS(regex, proj_dependencies, finalAns, imp.imported, child_half_path, path_Child_Complete, child_path, parent_full_path, tag, edges);
            }
            // break;
        }
        // await createHtmlFile(graph,tag);
        const graph = createGraph(edges);
        if (refinedImports.length > 0) {
            // console.log(greenBright("Start",importsInAFile.length,importsInAFile.map((imp)=>{
            //   console.log(imp.from)
            // })));
            console.log((0, cli_color_1.greenBright)("Start"));
            printDependencyTree(graph, howToSeeDependencies);
            console.log("\n");
        }
    });
}
exports.INITIAL_START_parseJsImports = INITIAL_START_parseJsImports;
function parseJsImportsDFS(regex, proj_dependencies, finalAns, childName, child_half_path, child_full_path, node_half_path, node_full_path, parent_name, edges) {
    return __awaiter(this, void 0, void 0, function* () {
        let importsInAFile = [];
        // console.log(parent_name,magenta("->"),childName,yellow("->"),node_half_path)
        edges.push({
            parent: parent_name,
            child: child_half_path,
            import_name: childName,
            parent_path: node_full_path,
            child_full_path: child_full_path,
            parent_half_path: node_half_path,
        });
        // console.log(bgBlack(yellow("parent:",node_half_path , "child:",child_half_path,green("import_name:",white(childName)),"\n"),blue("parentName: ",parent_name),))
        yield (0, read_dep_in_files_1.checkDependenciesInFile)(importsInAFile, proj_dependencies, regex, child_full_path);
        if (importsInAFile.length > 0) {
            for (const imp of importsInAFile) {
                let child_path = path_1.default.join(path_1.default.dirname(child_full_path), imp.from);
                let pathChild_withExtension = 'DNE';
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
                if (pathChild_withExtension !== 'DNE') {
                    yield parseJsImportsDFS(regex, proj_dependencies, finalAns, imp.imported, half_path_child, pathChild_withExtension, child_half_path, child_full_path, childName, edges);
                }
            }
        }
    });
}
exports.parseJsImportsDFS = parseJsImportsDFS;
const createGraph = (edges) => {
    const graph = {};
    edges.forEach(({ parent, child, import_name, parent_path, child_full_path, parent_half_path, }) => {
        if (!graph[parent]) {
            graph[parent] = [];
        }
        const childExists = graph[parent].some((entry) => entry.child === child);
        if (!childExists) {
            graph[parent].push({
                child,
                import_name,
                parent_path,
                child_full_path,
                parent_half_path,
            });
        }
    });
    return graph;
};
function printDependencyTree(graph, howToSeeDependencies) {
    const printedNodes = new Set(); // Track printed nodes to avoid repetition
    const nodeNumbers = new Map(); // Map to store the first occurrence import number of each node
    let counter = 1; // Initialize counter to start numbering
    function traverse(node, depth = 0, isLast = true, parentPath = '') {
        // Check if node has already been printed (duplicate case)
        if (printedNodes.has(node)) {
            const nodeParent = '   '.repeat(depth) + (isLast ? '    └── ' : '    ├── ');
            const currentParentPath = parentPath || '';
            // Print the duplicate node with its import number from the first occurrence
            console.log(`${'   '.repeat(depth)}${(0, cli_color_1.green)(nodeParent)}${(0, cli_color_1.cyan)(node)} ${(0, cli_color_1.yellow)(`(${currentParentPath})`)} ${graph[node] ? `[Duplicate goto -> ${(0, cli_color_1.green)(`(${nodeNumbers.get(node)})`)}]` : ''}`);
            return;
        }
        //└──→ " : "├──→ ");
        // Create prefix for the node
        const prefix = '   '.repeat(depth) + (isLast ? '    └── ' : '    ├── ');
        const children = graph[node] || [];
        // Determine the parent import path
        const currentParentPath = parentPath || ''; // Default to empty for top node
        console.log(`${'   '.repeat(depth)}${(0, cli_color_1.green)(prefix)}${(0, cli_color_1.cyan)(node)} ${(0, cli_color_1.yellow)(`(${currentParentPath})`)} ${(0, cli_color_1.magenta)(`(${counter++})`)}`);
        // Mark this node as printed and store the import number for duplicates
        printedNodes.add(node);
        nodeNumbers.set(node, counter - 1); // Store the import number of the first occurrence
        // Recursively print children
        children.forEach((child, index) => {
            const isChildLast = index === children.length - 1;
            traverse(child.import_name, depth + 1, isChildLast, howToSeeDependencies === 'half' ? child.child : child.child_full_path);
        });
    }
    // Traverse all top-level keys in the graph
    for (const key in graph) {
        if (!printedNodes.has(key)) {
            // console.log(graph[key][0], graph[key][0].parent_half_path,)
            traverse(key, 0, true, howToSeeDependencies === 'half'
                ? graph[key][0].parent_half_path
                : graph[key][0].parent_path);
        }
    }
}
