import { bgMagentaBright, green, magentaBright } from "cli-color";
import fs from "fs";
import path from "path";
import TsJsextensions from "../extensions/jstsExtensions";
import JsImports from "../interfaces/JsTsimports";



async function checkDependenciesInFile(importsData:JsImports[],proj_dependencies:string[],
  regex:RegExp,
  parent_path:string
){
  let file_path = parent_path;
  
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
  parent_path:string,
  child_path:string,
  finalAns:ImportsMap
) {
  let child_path_with_parent_path = path.join(process.cwd(),child_path);

  let importsInAFile:JsImports[] = [] ;

  console.log(bgMagentaBright("###############################"))

  const initialValues = {
    half_parent_path:"Start",
    full_parent_path:"Initial parent full path",
    half_path_child:child_path,
    full_path_child:child_path_with_parent_path
  };

  finalAns["Start"] = [initialValues];

  //* Get all the imports for App.js
  await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,child_path_with_parent_path);

  const parent_full_path = path.join(process.cwd(),child_path);

  for (let i = 0; i < importsInAFile.length; i++) {
    const imp = importsInAFile[i];
    let extOfFile:string|null = null;
    let path_Child_Complete = path.join(path.dirname(parent_full_path), imp.from);

    if(!fs.existsSync(path_Child_Complete)){
      for (const ext of TsJsextensions) {
        let temp_path = `${path_Child_Complete}${ext}`;
        extOfFile = ext;
        if(fs.existsSync(path_Child_Complete)){
          path_Child_Complete = temp_path;
        }
      }
    }
    const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
    console.log(`Visiting, ${i+1}`,child_half_path)
      
    const DS = {
      half_parent_path:child_path,
      full_parent_path:parent_full_path,
      half_path_child :child_half_path,
      full_path_child :path_Child_Complete,
    };

    finalAns[child_path] = [DS];
    //*                                                       //Parent's full path //Parent's half path
    await parseJsImportsDFS(regex, proj_dependencies, finalAns, path_Child_Complete, child_half_path);
  }
}

export async function parseJsImportsDFS(
  regex: RegExp,
  proj_dependencies: string[],
  finalAns:ImportsMap,
  parent_full_path:string,
  parent_half_path:string
) {

  let importsInAFile:JsImports[] = [];

  await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,parent_full_path);
  //* ADD IN DATA.S HERE
  console.log(importsInAFile)
  if(importsInAFile.length > 0){
    for (const imp of importsInAFile) {
        let child_path = path.join(path.dirname(parent_full_path), imp.from);
        let pathChild_withExtension :string = "DNE";
        let extOfFile : string|null = null;
        if(!fs.existsSync(child_path)){
          for (const ext of TsJsextensions) {
            let temp_path = `${child_path}${ext}`;
            if(fs.existsSync(temp_path)){
              pathChild_withExtension = temp_path;
              extOfFile = ext;
              break;
            }
          }
        }          
        const half_path_child =  extOfFile === null ? imp.from : `${imp.from}${extOfFile}`;
        const DS = {
          half_parent_path: parent_half_path,
          full_parent_path: parent_full_path,
          half_path_child : half_path_child,
          full_path_child : pathChild_withExtension,
        };
        console.log(green(parent_half_path,"->",half_path_child))
        if(pathChild_withExtension!=="DNE"){
        finalAns[half_path_child] = [DS];
        console.log(magentaBright("V->",imp.from))
        await parseJsImportsDFS(regex,proj_dependencies,finalAns,pathChild_withExtension,half_path_child);
        }
      }
    }
}
