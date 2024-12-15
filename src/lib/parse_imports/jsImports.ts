import clc, { blue, green, greenBright, magenta, magentaBright, red, redBright, yellow, yellowBright } from "cli-color";
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

  if(!fs.existsSync(file_path)){
    for (const ext of TsJsextensions) {
      const pathChild = path.join(file_path,ext);
      if(fs.existsSync(pathChild)){
        file_path = path.join(file_path,ext);
        console.log(yellowBright("EX->",pathChild))
        return;
      }else{
        console.log(red("DNE",pathChild))
      }
    }
  }
  const file_content = fs.readFileSync(file_path,"utf-8");
  let match;
  while ((match = regex.exec(file_content)) !== null) {
    const imports = match[1];
    const from = match[2];

    // Exclude imports where the "from" is in proj_dependencies
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
  console.log(clc.magentaBright(parent_path,"<<<>>>"))
  checkDependenciesInFile(importsInAFile,proj_dependencies,regex,child_path_parent);

  
  importsInAFile.forEach((imp,i)=>{
    const pathChild = path.join(process.cwd(),path.dirname(child_path),imp.from);
    // console.log(i+1,imp.from,pathChild)
    console.log(i+1)
    parseJsImportsDFS(regex,proj_dependencies,pathChild);
  })

}

export async function parseJsImportsDFS(
  regex: RegExp,
  proj_dependencies: string[],
  parent_path:string,//* FOR INITIAL PATH IT SHOULD BE "<START>"
) {
  let importsInAFile:JsImports[] = [];
  checkDependenciesInFile(importsInAFile,proj_dependencies,regex,parent_path);
  console.log(clc.magentaBright("parent_path","------",parent_path,"------"))
  importsInAFile.map((imp)=>{
    console.log(clc.yellowBright("CHILD",imp.imported,imp.from));
  })
  console.log("\n")
}

