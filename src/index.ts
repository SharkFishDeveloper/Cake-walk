#!/usr/bin/env node

import { red, redBright, yellowBright } from 'cli-color';
import fs from 'fs';
import yaml from 'js-yaml';
import inquirer from 'inquirer';
import questions from './lib/util/prompt_questions.js';
import { readDependenciesFromPromt } from './lib/util/prompt_depedecy_list';
import { doSomething } from './lib/crawler/doSomething';
// ./repo/Fundrz-client/App.js
async function start() {
  try {
    //? Add logic so it does not ask question again and agai
    // fs.rmSync('deepdive.yml', { force: true });
    if (!fs.existsSync('deepdive.yml')) {
      //@ts-ignore
      const prompt_answer = await inquirer.prompt(questions);

      let dependencies = await readDependenciesFromPromt(
        prompt_answer.language,
        prompt_answer.startPoint
      );
      const ymlData = {
        codebase: [prompt_answer.language],
        start: [
          {
            path: prompt_answer.startPoint,
            tag: prompt_answer.startPointTag,
          },
        ],
        exclude: [dependencies],
      };

      let yamlString = yaml.dump(ymlData, {
        indent: 8,
        lineWidth: 80,
        noRefs: true,
        skipInvalid: true,
      });

      yamlString = yamlString.replace(/^(\w+):\n/gm, '\n$1:\n');
      fs.writeFileSync('deepdive.yml', yamlString);
      console.log(
        yellowBright(
          `I made deepdive.yml file, please fill it and then continue. 
          Feel free to edit it! You can:
          - Add multiple starting points
          - Exclude any files or directories`
        )
      );
    } else {
      //* if yml is already present, then perform this FX
      await handleParsedDataAfterPrompt();
    }
  } catch (error) {
    console.log(red(error));
  }
}

async function processDependencies(
  startFiles: string[],
  all_dependencies: string[],
  language: string
) {
  for (const start of startFiles || []) {
    //@ts-ignore
    const dependencies = await readDependenciesFromPromt(
      language as string,
      start
    );
    all_dependencies.push(...dependencies);
    // console.log(all_dependencies)
  }

  // console.log('all_dependencies', all_dependencies);
  const yamlString = fs.readFileSync('deepdive.yml', 'utf-8');
  const parsedYaml = yaml.load(yamlString);

  // Step 3: Modify the specific heading (assuming the heading is a key in the object)
  if (parsedYaml && typeof parsedYaml === 'object') {
    //@ts-ignore
    parsedYaml['exclude'] = all_dependencies;
  }
  const updatedYamlString = yaml.dump(parsedYaml);

  // Step 5: Write the updated YAML string back to the file
  fs.writeFileSync('deepdive.yml', updatedYamlString);
  return;
}

async function handleParsedDataAfterPrompt() {
  const fileContent = fs.readFileSync('deepdive.yml', 'utf8');
  const parsedData = yaml.load(fileContent);
  //@ts-ignore
  let dataOfYml: string[] | null = parsedData.start;
  let startFiles: string[] = dataOfYml?.map((item: any) => item.path);
  let tags: string[] = dataOfYml?.map((item: any) => item.tag);
  // return;
  //@ts-ignore
  let language: string | null = parsedData.codebase;

  if (
    language === null ||
    !language ||
    !language[0] ||
    startFiles == null ||
    startFiles?.length === 0
  ) {
    return console.log(redBright('Please fill properly in Deepdive.yml ...'));
  }

  let all_dependencies: string[] = [];

  //* < ------- >
  //* this function is just for reading the starting Files and all their dependencies
  await processDependencies(startFiles, all_dependencies, language[0]);
  //* < ------- >

  //@ts-ignore
  let proj_dependenciesdependencies: string[] | null = parsedData.exclude[0];
  // console.log(startFiles,tags,startFiles.length,startFiles[0])
  if (!startFiles || startFiles.length === 0 || startFiles.some(file => file.trim() === '')) {
    return console.log(
      redBright('Please enter the start files in Deepdive.yml ...')
    );
  }

  if (!tags || tags.length === 0 || tags.some(file => file.trim() === '') || tags.length !== startFiles.length) {
    return console.log(
      redBright('Please enter the start tags in Deepdive.yml ...')
    );
  }


  if (
    proj_dependenciesdependencies === null ||
    proj_dependenciesdependencies.length === 0
  ) {
    return console.log(
      redBright('Please fill all the dependencies in  Deepdive.yml ...')
    );
  }
  let finalAns: ImportsMap = {};

  await doSomething(
    startFiles,
    tags,
    language as string,
    all_dependencies ?? [],
    finalAns
  );
}

start();
