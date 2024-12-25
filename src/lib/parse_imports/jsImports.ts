import { bgBlack, blue, cyan, green, magenta, white, yellow } from "cli-color";
import fs from "fs";
import path from "path";
import TsJsextensions from "../extensions/jstsExtensions";
import JsImports from "../interfaces/JsTsimports";
import { Edge, Graph } from "../interfaces/Graph";
import { checkDependenciesInFile } from "../read_dependencies/read-dep-in-files";
import { createHtmlFile } from "../open-live/createHtmlFile";




export async function INITIAL_START_parseJsImports(
  regex: RegExp,
  proj_dependencies: string[],
  child_path: string, // starting file location eg- src/pages/App.js
  tag:string, // starting file name eg- App.js
  finalAns: ImportsMap
) {

  let child_path_with_parent_path = path.join(process.cwd(), child_path);

  
  let importsInAFile: JsImports[] = [];

  await checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_with_parent_path);
  
  const parent_full_path = path.join(process.cwd(), child_path);


  for (let i = 0; i < importsInAFile.length; i++) {
    const imp = importsInAFile[i];
    let extOfFile: string | null = null;
    const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
    let path_Child_Complete = path.join(path.dirname(parent_full_path), imp.from);

    if (!fs.existsSync(path_Child_Complete)) {
      for (const ext of TsJsextensions) {
        let temp_path = `${path_Child_Complete}${ext}`;
        extOfFile = ext;
        if (fs.existsSync(path_Child_Complete)) {
          path_Child_Complete = temp_path;
        }
      }
    }


    await parseJsImportsDFS(
      regex, 
      proj_dependencies, 
      finalAns,
      imp.imported,
      child_half_path,
      path_Child_Complete,
      child_path,
      parent_full_path,
      tag,
    );
    // break;
  }
  // await createHtmlFile(graph,tag);
  const graph = createGraph(edges);
  // const graph = {
  //   'App.js': [
  //     {
  //       child: './User/SignUP.jsx',
  //       import_name: 'SignUp',
  //       parent_path: './repo/Fundrz-client/src/App.js'
  //     }
  //   ],
  //   SignUp: [
  //     {
  //       child: '../UserContx/UserContext.js',
  //       import_name: 'UserContext',
  //       parent_path: './User/SignUP.jsx'
  //     },
  //     {
  //       child: '../IP.js',
  //       import_name: 'deployedIp',
  //       parent_path: './User/SignUP.jsx'
  //     }
  //   ]}
  console.log(graph)

  console.log("Start")
  printDependencyTree(graph);
  // printHierarchy(edges);
  // console.log("graph",graph)
}

export async function parseJsImportsDFS(
  regex: RegExp,
  proj_dependencies: string[],
  finalAns: ImportsMap,
  childName:string,
  child_half_path: string,
  child_full_path: string,
  node_half_path: string,
  node_full_path: string,
  parent_name: string,
) {
  let importsInAFile: JsImports[] = [];
  // console.log(parent_name,magenta("->"),childName,yellow("->"),node_half_path)
  edges.push({parent:parent_name,child:child_half_path,import_name:childName,parent_path:node_full_path,
    child_full_path:child_full_path,parent_half_path:node_half_path
  })

  // console.log(bgBlack(yellow("parent:",node_half_path , "child:",child_half_path,green("import_name:",white(childName)),"\n"),blue("parentName: ",parent_name),))


  await checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_full_path);

  if (importsInAFile.length > 0) {
    for (const imp of importsInAFile) {
      let child_path = path.join(path.dirname(child_full_path), imp.from);
      let pathChild_withExtension: string = "DNE";
      let extOfFile: string | null = null;

      if (!fs.existsSync(child_path)) {
        for (const ext of TsJsextensions) {
          let temp_path = `${child_path}${ext}`;
          if (fs.existsSync(temp_path)) {
            pathChild_withExtension = temp_path;
            extOfFile = ext;
            break;
          }
        }
      } else {
        pathChild_withExtension = child_path;
      }

      const half_path_child = extOfFile === null ? imp.from : `${imp.from}${extOfFile}`;

      if (pathChild_withExtension !== "DNE") {

        await parseJsImportsDFS(
          regex,
          proj_dependencies,
          finalAns,
          imp.imported,
          half_path_child,
          pathChild_withExtension,
          child_half_path,
          child_full_path,
          childName
        );
      }
    }
  } 
}



let edges:Edge[] = [];

const createGraph = (F: Edge[]): Graph => {
  const graph: Graph = {}; 

  edges.forEach(({ parent, child, import_name,parent_path,child_full_path,parent_half_path }) => {
    if (!graph[parent]) {
      graph[parent] = [];
    }

    const childExists = graph[parent].some(entry => entry.child === child);
    if (!childExists) {
      graph[parent].push({ child, import_name,parent_path,child_full_path,parent_half_path });
    }
  });

  return graph;
};



function printDependencyTree(graph) {
  const printedNodes = new Set();  // Track printed nodes to avoid repetition
  const nodeNumbers = new Map();  // Map to store the first occurrence import number of each node
  let counter = 1;  // Initialize counter to start numbering

  function traverse(node, depth = 0, isLast = true, parentPath = "") {
    // Check if node has already been printed (duplicate case)
    if (printedNodes.has(node)) {                         
      const nodeParent = "   ".repeat(depth) + (isLast ? "  └── " : "  ├── ");
      const currentParentPath = parentPath || "";
      // Print the duplicate node with its import number from the first occurrence
      console.log(`${"   ".repeat(depth)}${green(nodeParent)}${cyan(node)} ${yellow(`(${currentParentPath})`)} [Duplicate goto -> ${green(`(${nodeNumbers.get(node)})`)}]`);
      return;
    }
//└──→ " : "├──→ ");
    // Create prefix for the node 
    const prefix = "   ".repeat(depth) + (isLast ? "  └── " : "  ├── ");
    const children = graph[node] || [];

    // Determine the parent import path
    const currentParentPath = parentPath || ""; // Default to empty for top node
    console.log(`${"   ".repeat(depth)}${green(prefix)}${cyan(node)} ${yellow(`(${currentParentPath})`)} ${magenta(`(${counter++})`)}`);

    // Mark this node as printed and store the import number for duplicates
    printedNodes.add(node);
    nodeNumbers.set(node, counter - 1); // Store the import number of the first occurrence

    // Recursively print children
    children.forEach((child, index) => {
      const isChildLast = index === children.length - 1;
      traverse(child.import_name, depth + 1, isChildLast, child.child);
    });
  }

  // Traverse all top-level keys in the graph
  for (const key in graph) {
    if (!printedNodes.has(key)) {
      traverse(key, 0, true, graph[key][0].parent_half_path);
    }
  }
}
