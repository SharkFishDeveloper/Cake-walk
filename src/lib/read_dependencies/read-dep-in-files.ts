import JsImports from '../interfaces/JsTsimports';
import fs from 'fs';

export async function checkDependenciesInFile(
  importsData: JsImports[],
  proj_dependencies: string[],
  regex: RegExp,
  parent_path: string
) {
  let file_path = parent_path;

  const file_content = fs.readFileSync(file_path, 'utf-8');
  if(!file_content || file_content.length === 0) {
    return;
  }
  let match;
  while ((match = regex.exec(file_content)) !== null) {
    const imports = match[1];
    const from = match[2];

    if(!imports || !from|| imports.length === 0 || from.length === 0) {
      return;
    }


    if(proj_dependencies.length > 0){
      if (!proj_dependencies.some((dep) => from.startsWith(dep))) {
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
    }else{
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
