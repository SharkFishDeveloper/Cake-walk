import { blue, green, greenBright, magenta, red, redBright, yellow } from "cli-color";
import fs from "fs";
import path from "path";


export async function parseJsImports(
  file_content: string,
  regex: RegExp,
  proj_dependencies: string[],
  base_path:string,
  startfile:string,
) {
  let importsData = [];
  let match;
  while ((match = regex.exec(file_content)) !== null) {
    const imports = match[1];
    const from = match[2];

    // Exclude imports where the "from" is in proj_dependencies
    if (!proj_dependencies.some(dep => from.includes(dep))) {
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
  await normalizeJsImports(importsData,base_path,startfile,regex,proj_dependencies)
  return importsData;
}



//? What if the file import has no extension behind ?

const extensions = ['.js', '.ts', '.jsx', '.tsx', '.css'];
interface JsImports {
  imported:string,
  from:string
}

let ans:{};

async function normalizeJsImports(importsData:JsImports[],base_path:string,startfile:string,regex: RegExp,proj_dependencies:string[]){
  let vis=[];
  let removedFilePath = path.dirname(base_path);
  // const finalImportPath = path.join(removedFilePath,importsData[0].from);
  // dfs(finalImportPath,regex,proj_dependencies);
  importsData.forEach((imp)=>{
    const finalImportPath = path.join(removedFilePath,imp.from);
    if(fs.existsSync(finalImportPath)){
      // Do dfs
      console.log(magenta("Exists->",finalImportPath))
      dfs(finalImportPath,regex,base_path,proj_dependencies);    
    }else{
      console.log(redBright("DOES NOT Exists->",finalImportPath))
    }
    return;
  })
}



async function dfs(finalImportPath:string,regex: RegExp,base_path:string,proj_dependencies:string[]) {
  const file_content = fs.readFileSync(finalImportPath,"utf-8");
  let importsData:JsImports[] = [];
  let match;
  console.log(greenBright("ADD IMPORTS OF VISIT->",finalImportPath))

  while ((match = regex.exec(file_content)) !== null) {
    const imports = match[1];
    const from = match[2];

    // Exclude imports where the "from" is in proj_dependencies
    if (!proj_dependencies.some(dep => from.includes(dep))) {
      // console.log(yellow(`Cannot exclude ${from}`))
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
  importsData.forEach((item)=>{
    const dependency_path = path.join(path.dirname(finalImportPath),item.from);
    for (let ext of extensions) {
      const dependencyPath = path.join(dependency_path + ext);
      
      if (fs.existsSync(dependencyPath)) {
        console.log(blue(`File found: ${dependencyPath}`,path.relative(base_path,dependencyPath)));
        dfs(dependencyPath,regex,base_path,proj_dependencies);
      }
    }
  })
  console.log(green("________"))
}