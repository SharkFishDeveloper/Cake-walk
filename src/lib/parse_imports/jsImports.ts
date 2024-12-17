import { bgBlack, blue, blueBright, cyan, green, magenta, magentaBright, red, yellow } from "cli-color";
import fs from "fs";
import path from "path";
import TsJsextensions from "../extensions/jstsExtensions";
import JsImports from "../interfaces/JsTsimports";



async function checkDependenciesInFile(importsData: JsImports[], proj_dependencies: string[],
  regex: RegExp,
  parent_path: string
) {
  let file_path = parent_path;

  const file_content = fs.readFileSync(file_path, "utf-8");
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
  parent_path: string,
  child_path: string,
  finalAns: ImportsMap
) {
  let child_path_with_parent_path = path.join(process.cwd(), child_path);

  let importsInAFile: JsImports[] = [];

  const initialValues = {
    half_parent_path: "Start",
    full_parent_path: "Initial parent full path",
    half_path_child: child_path,
    full_path_child: child_path_with_parent_path
  };
  if (!finalAns["Start"]) {
    finalAns["Start"] = [];
  }
  console.log("V->",initialValues)
  finalAns["Start"].push(initialValues);

  await checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_path_with_parent_path);

  const parent_full_path = path.join(process.cwd(), child_path);

  for (let i = 0; i < importsInAFile.length; i++) {
    if(i!=9)continue;
    const imp = importsInAFile[i];
    let extOfFile: string | null = null;
    const child_half_path = extOfFile == null ? imp.from : `${imp.from}${extOfFile}`;
    console.log(`Visiting, ${i}`, magentaBright(child_path), child_half_path)

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
    const DS = {
      half_parent_path: child_path,
      full_parent_path: parent_full_path,
      half_path_child: child_half_path,
      full_path_child: path_Child_Complete,
    };
    if (!finalAns[child_path]) {
      finalAns[child_path] = [];
    }
    finalAns[child_path].push(DS)
    await parseJsImportsDFS(regex, proj_dependencies, finalAns,
      child_half_path,
      path_Child_Complete,
      child_path,
      parent_full_path,
    );
  }
}

export async function parseJsImportsDFS(
  regex: RegExp,
  proj_dependencies: string[],
  finalAns: ImportsMap,
  child_half_path: string,
  child_full_path: string,
  node_half_path: string,
  node_full_path: string
) {
  let importsInAFile: JsImports[] = [];

  console.log(bgBlack(yellow(node_half_path , child_half_path)))

  await checkDependenciesInFile(importsInAFile, proj_dependencies, regex, child_full_path);

  if (importsInAFile.length > 0) {
    // console.log(yellow(`[FOUND IMPORTS]`), `Count:`, importsInAFile.length);
    for (const imp of importsInAFile) {
      // console.log(blue(`[IMPORT DETAILS]`), imp.from);
      
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
      // console.log(
      //   magentaBright(`[CHILD NODE RESOLVED]`),
      //   `Half Path:`, half_path_child
      // );

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

        // console.log(
        //   green(`[ADDED TO FINAL RESULT]`),
        //   magenta(`Child:`), half_path_child,
        //   `| Parent:`, node_half_path
        // );

        await parseJsImportsDFS(
          regex,
          proj_dependencies,
          finalAns,
          half_path_child,
          pathChild_withExtension,
          child_half_path,
          child_full_path
        );
      }
    }
  } else {
    // console.log(red(`[NO IMPORTS FOUND]`), `Child:`, child_half_path);

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

    // console.log(
    //   green(`[LEAF NODE]`),
    //   `Child Node:`, child_half_path,
    //   `| Marked as Null`
    // );
  }
}