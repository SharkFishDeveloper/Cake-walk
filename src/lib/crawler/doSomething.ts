import jsRegex from '../regex/javascript';
import { INITIAL_START_parseJsImports } from '../parse_imports/jsImports';
import { blueBright, greenBright, redBright } from 'cli-color';
// import { createSpinner} from 'nanospinner';

let regex: RegExp;
let proj_dependencies: string[];


export async function doSomething(
  startfileArray: string[],
  tags:string[],
  language: string,
  dependencies: string[],
  finalAns: ImportsMap,
  howToSeeDependencies: string
) {
  proj_dependencies = dependencies;

  //* add multiple switch statements for importing a particular language's REGEX
  switch (language[0]) {
    case 'Typescript':
    case 'Javascript':
    case 'NextJs':
    case 'ReactJs':
      regex = jsRegex;
      
      // const spinner = createSpinner().start();
      try {
        for (let i = 0; i < startfileArray.length; i++) {
          console.log(blueBright("Processed file:--> ", tags[i], "\n"));
          console.log("Start");
          await readImports(startfileArray[i], tags[i], finalAns, howToSeeDependencies);
        }
      
        console.log(greenBright("<--Finished-->"));
        
      } catch (error) {
        console.error('An error occurred during file processing.');
        console.error(error);
      }
  }
}


export async function readImports(startfile: string,tag:string,finalAns: ImportsMap,howToSeeDependencies: string) {
  try {
    await INITIAL_START_parseJsImports(
      regex,
      proj_dependencies,
      startfile,
      tag,
      finalAns,
      howToSeeDependencies
    );
  } catch (error) {
    console.log(redBright(error));
  }
}
