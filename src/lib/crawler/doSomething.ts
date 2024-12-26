import jsRegex from '../regex/javascript';
import { INITIAL_START_parseJsImports } from '../parse_imports/jsImports';
import { blueBright, cyanBright, greenBright, magentaBright, red, redBright, whiteBright } from 'cli-color';
import { getFilesInDirectory } from '../util/readDir';
import fs from "fs";

let regex: RegExp;
let proj_dependencies: string[];

export async function doSomething(
  startfileArray: string[],
  tags: string[],
  language: string,
  dependencies: string[],
  finalAns: ImportsMap,
  howToSeeDependencies: string,
  excludeFolders: string[]
) {
  proj_dependencies = dependencies;

  //* add multiple switch statements for importing a particular language's REGEX
  switch (language[0]) {
    case 'Typescript':
    case 'Javascript':
    case 'NextJs':
    case 'ReactJs':
      regex = jsRegex;

      for (let i = 0; i < startfileArray.length; i++) {
        const stat = await fs.promises.lstat(startfileArray[i]);
       try {
        if (stat.isDirectory()) {
          console.log(whiteBright("Processed :--> ", tags[i], "\n"));
          const filesArray = await getFilesInDirectory(startfileArray[i],tags[i],excludeFolders);
          for (let j = 0; j < filesArray.length; j++) {
            // console.log(greenBright("<--Next-->",filesArray[j].name));
           
            await readImports(filesArray[j].short_path, filesArray[j].name, "./repo", "repo" ,finalAns, howToSeeDependencies);

          }
        }
        else if (stat.isFile()) {
          console.log(whiteBright("Processed :--> ", tags[i], "\n"));
          await readImports(startfileArray[i], tags[i],"","" ,finalAns, howToSeeDependencies);
          // console.log(greenBright("<--Next-->"));
        }
       } catch (error) {
        console.log(red('An error occurred during file processing.',error))
       }finally{
        console.log(blueBright("<--Finished-->","\n"));
       }
      }
    // try {
    //   for (let i = 0; i < startfileArray.length; i++) {
    //     console.log(blueBright("Processed file:--> ", tags[i], "\n"));
    //     console.log("Start");
    //     await readImports(startfileArray[i], tags[i], finalAns, howToSeeDependencies);
    //   }

    //   console.log(greenBright("<--Finished-->"));

    // } catch (error) {
    //   console.error('An error occurred during file processing.');
    //   console.error(error);
    // }
  }
}

export async function readImports(
  startfile: string,
  tag: string,
  dirLocation: string,
  dirTag: string,
  finalAns: ImportsMap,
  howToSeeDependencies: string
) {
  try {
    await INITIAL_START_parseJsImports(
      regex,
      proj_dependencies,
      startfile,
      tag,
      dirLocation,
      dirTag,
      finalAns,
      howToSeeDependencies
    );
  } catch (error) {
    console.log(redBright(error));
  }
}
