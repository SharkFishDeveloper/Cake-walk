import { bgBlack, blue, green, magenta, white, yellow } from "cli-color";
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

  // adapt this for multiple starting files
  edges.push({parent:"Start",child: child_path,import_name:"App.js",parent_path:"Start"})


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
  await createHtmlFile(graph,"Start");
  console.log("graph",graph)
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
  // console.log(node_half_path,magenta("->"),parent_name,yellow("->"),child_half_path,childName)
  edges.push({parent:node_half_path,child:child_half_path,import_name:childName,parent_path:parent_name})

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

  edges.forEach(({ parent, child, import_name,parent_path }) => {
    if (!graph[parent]) {
      graph[parent] = [];
    }

    const childExists = graph[parent].some(entry => entry.child === child);
    if (!childExists) {
      graph[parent].push({ child, import_name,parent_path });
    }
  });

  return graph;
};

