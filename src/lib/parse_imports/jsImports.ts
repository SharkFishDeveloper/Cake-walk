import { bgBlue, bgMagentaBright,blueBright, green, magentaBright, yellow } from "cli-color";
import fs from "fs";
import path from "path";
import TsJsextensions from "../extensions/jstsExtensions";


interface JsImports {
  imported:string,
  from:string
}



function displayImportsMap(map: ImportsMap) {
  Object.keys(map).forEach(key => {
    console.log(yellow(`KEY: ${key}`));
    map[key].forEach((item, index) => {
      console.log(green(`  Key ${index + 1}:`));
      console.log(green(`    parent_path: ${item.parent_path}`));
      console.log(green(`    full_path_child: ${item.full_path_child}`));
      console.log(green(`    half_path_child: ${item.half_path_child}`));
    });
    console.log('---');
  });
}

async function checkDependenciesInFile(importsData:JsImports[],proj_dependencies:string[],
  regex:RegExp,
  parent_path:string
){
  let file_path = parent_path;

  // console.log(blueBright(bgBlue("<--<"),file_path.substring(43)))
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
  child_path:string, //* This is initial file path like ("../user.js"),
  finalAns:ImportsMap
) {
  let child_path_parent = path.join(process.cwd(),child_path); 

  let importsInAFile:JsImports[] = [] ;

  console.log(bgMagentaBright("###############################"))
  await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,child_path_parent);

  const initialValues = {
    parent_path:"Start",
    parent_full_path:path.join(process.cwd(),child_path),
    half_path_child:child_path,
    full_path_child:child_path_parent
  };

  // finalAns["Start"] = [initialValues];

  const parent_full_path = path.join(process.cwd(),child_path);

  for (let i = 0; i < importsInAFile.length; i++) {
    const imp = importsInAFile[i];
    const pathChild = path.join(process.cwd(), path.dirname(child_path), imp.from);

    const DS = {
      parent_path:child_path,
      parent_full_path:parent_full_path,
      half_path_child:imp.from,
      full_path_child:pathChild,
    };
    
    console.log(magentaBright(child_path),DS)
    // finalAns[child_path] = [DS];

    await parseJsImportsDFS(regex, proj_dependencies, finalAns,pathChild,child_path,parent_full_path);

  }
  // displayImportsMap(finalAns);
  // console.log(finalAns)
}

export async function parseJsImportsDFS(
  regex: RegExp,
  proj_dependencies: string[],
  finalAns:ImportsMap,
  parent_path:string,
  child_path:string,
  parent_full_path:string
) {
  let importsInAFile:JsImports[] = [];

  let path_parent:string = "" ; //* Parent with extension

  if(fs.existsSync(parent_path)){
    path_parent = parent_path;
    await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,path_parent);
  }else{
    for (const ext of TsJsextensions) {
      let pathChild = `${parent_path}${ext}`;
      if(fs.existsSync(pathChild)){
        path_parent= pathChild;
        await checkDependenciesInFile(importsInAFile,proj_dependencies,regex,pathChild);
      }else{
      }
    }
  }
  //* ADD IN DATA.S HERE

  if(importsInAFile.length > 0){
    for (const imp of importsInAFile) {
        let child_path = path.join(path.dirname(path_parent), imp.from);
        let parent_full_path = path.join(process.cwd(),path_parent);

        const DS = {
          parent_path:path_parent,
          parent_full_path:parent_full_path,
          full_path_child:child_path,
          half_path_child:imp.from
        };
        
        // console.log(magentaBright(child_path),DS)
        // finalAns[imp.from] = [DS];
        console.log(blueBright(imp.from),DS)
        await parseJsImportsDFS(regex, proj_dependencies, finalAns,child_path,imp.from,parent_full_path);
    }
  }
}
