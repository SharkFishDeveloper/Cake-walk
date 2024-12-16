import jsRegex from '../regex/javascript';
import { INITIAL_START_parseJsImports } from '../parse_imports/jsImports';
import cliColor, { bgWhite } from "cli-color";
import { redBright } from 'cli-color';
import clc from "cli-color"

let regex: RegExp;
let proj_dependencies: string[];

export async function doSomething(
  startfileArray: string[],
  language: string,
  dependencies: string[],
  finalAns:ImportsMap
) {
  proj_dependencies = dependencies;

  //* add multiple switch statements for importing a particular language's REGEX
  switch (language[0]) {
    case 'Typescript':
    case 'Javascript':
    case 'NextJs':
    case 'ReactJs':
      regex = jsRegex;
  }
  for(const startfile of startfileArray){
    await readImports(startfile,finalAns);
  }
}




export async function readImports(startfile: string,finalAns:ImportsMap) {
  try {
    await INITIAL_START_parseJsImports( regex, proj_dependencies,"START",startfile,finalAns);
    // console.log(cliColor.bold.green("Dependency Tree:"));
    printImportsMap(finalAns);
    // console.log("finalAns",finalAns)
  } catch (error) {
    console.log(redBright(error));
  }
}


function printImportsMap(data: ImportsMap) {
  for (const [childPath, entries] of Object.entries(data)) {
    console.log(clc.bold.blue(`Child Path: ${childPath}`));
    
    entries.forEach((entry, index) => {
      console.log(clc.green(`  Entry ${index + 1}:`));
      console.log(clc.cyan(`    Half Parent Path: ${entry.half_parent_path}`));
      console.log(clc.cyan(`    Full Parent Path: ${entry.full_parent_path}`));
      console.log(clc.yellow(`    Half Path Child: ${entry.half_path_child}`));
      console.log(clc.yellow(`    Full Path Child: ${entry.full_path_child}`));
      console.log(''); // Empty line for separation
    });
  }
}