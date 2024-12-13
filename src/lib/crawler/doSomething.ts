import path from 'path';
import jsRegex from '../regex/javascript';
import fs from 'fs';
import { parseJsImports } from '../parse_imports/jsImports';
import { redBright } from 'cli-color';

let regex: RegExp;
let proj_dependencies: string[];
export async function doSomething(
  startfile: string,
  language: string,
  dependencies: string[]
) {
  proj_dependencies = dependencies;

  switch (language[0]) {
    case 'Typescript':
    case 'Javascript':
    case 'NextJs':
    case 'ReactJs':
      regex = jsRegex;
  }
  readImports(startfile);
}

export async function readImports(startfile: string) {
  try {
    const base_path = path.join(process.cwd(), startfile);
    const file_content = fs.readFileSync(base_path, 'utf-8');
    let importsData = [];

    //* make diff functions for diff languages that do all the work of checking path and dependency, use a switch statement
    //* < ----- >
    importsData = await parseJsImports(file_content, regex, proj_dependencies,base_path,startfile);
    //* < ----- >
  } catch (error) {
    console.log(redBright(error));
  }
}
