import jsRegex from '../regex/javascript';
import { INITIAL_START_parseJsImports } from '../parse_imports/jsImports';
import { redBright } from 'cli-color';

let regex: RegExp;
let proj_dependencies: string[];

export async function doSomething(
  startfileArray: string[],
  language: string,
  dependencies: string[],
  finalAns: ImportsMap
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
  for (const startfile of startfileArray) {
    await readImports(startfile, finalAns);
  }
}

export async function readImports(startfile: string, finalAns: ImportsMap) {
  try {
    await INITIAL_START_parseJsImports(
      regex,
      proj_dependencies,
      'START',
      startfile,
      finalAns
    );
  } catch (error) {
    console.log(redBright(error));
  }
}
