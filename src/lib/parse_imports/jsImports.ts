import { bgBlue, bgMagentaBright,blueBright, green } from "cli-color";
import fs from "fs";
import path from "path";
import TsJsextensions from "../extensions/jstsExtensions";


interface JsImports {
  imported:string,
  from:string
}


async function checkDependenciesInFile(importsData:JsImports[],proj_dependencies:string[],
  regex:RegExp,
  parent_path:string
){
  let file_path = parent_path;

  console.log(blueBright(bgBlue("<--<"),file_path.substring(43)))
  const file_content = fs.readFileSync(file_path,"utf-8");
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
      } else {
        importsData.push({ imported: imports, from });
      }
    }
  }
}


export async function INITIAL_START_parseJsImports(
  regex: RegExp,
  proj_dependencies: string[],
  parent_path:string,//* FOR INITIAL PATH IT SHOULD BE "<START>"
  child_path:string, //* This is initial file path like ("../user.js")
) {

  let child_path_parent = path.join(process.cwd(),child_path); 
  let importsInAFile:JsImports[] = [] ;
  console.log(bgMagentaBright("###############################"))
  await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,child_path_parent);

  for (let i = 0; i < importsInAFile.length; i++) {
    const imp = importsInAFile[i];
    const pathChild = path.join(process.cwd(), path.dirname(child_path), imp.from);
    await parseJsImportsDFS(regex, proj_dependencies, pathChild);
  }

}

export async function parseJsImportsDFS(
  regex: RegExp,
  proj_dependencies: string[],
  parent_path:string,
) {
  let importsInAFile:JsImports[] = [];

  if(fs.existsSync(parent_path)){
    await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,parent_path);
  }else{
    for (const ext of TsJsextensions) {
      let pathChild = `${parent_path}${ext}`;
      if(fs.existsSync(pathChild)){
        console.log(pathChild)
        await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,pathChild);
      }else{
      }
    }
  }

  if(importsInAFile.length > 0){
    for (const imp of importsInAFile) {
      console.log("|->", "P->", green(parent_path), imp.from);
      let child_path = path.join(path.dirname(parent_path), imp.from);
        await parseJsImportsDFS(regex, proj_dependencies, child_path);
    }
  }
}
