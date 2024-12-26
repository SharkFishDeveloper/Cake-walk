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
    if (!fs.existsSync('barrenland.yml')) {
      // console.log("DEONS not exists")
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
        pathVisibility: prompt_answer.ansFormat,
        excludeFolders: [
          'node_modules',
          '.git',
          '.gitignore',
          'package-lock.json',
          'package.json',
          'public',
          'README.md'
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
      fs.writeFileSync('barrenland.yml', yamlString);
      console.log(
        yellowBright(
          `I made deepdive.yml file, please fill it and then continue. 
          Feel free to edit it! You can:
          - Add multiple starting points
          - Exclude any files or directories`
        )
      );
    } else {
      // console.log("Exists")
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
    all_dependencies.push('react','react-router-dom',...dependencies);
  }
  // Read the existing YAML file
  const yamlString = fs.readFileSync('barrenland.yml', 'utf-8');
  const parsedYaml = yaml.load(yamlString);

  // Step 3: Merge existing exclude data with new dependencies
  if (parsedYaml && typeof parsedYaml === 'object') {
    //@ts-ignore
    const existingExcludes = Array.isArray(parsedYaml['exclude'])
      ? parsedYaml['exclude']
      : [];
    const combinedExcludes = [...new Set([...existingExcludes, ...all_dependencies])];
    //@ts-ignore
    parsedYaml['exclude'] = combinedExcludes;
  }

  // Convert updated object back to YAML
  const updatedYamlString = yaml.dump(parsedYaml);

  // Write the updated YAML string back to the file
  fs.writeFileSync('barrenland.yml', updatedYamlString);

  return;
}






async function handleParsedDataAfterPrompt() {
  const fileContent = fs.readFileSync('barrenland.yml', 'utf8');
  const parsedData = yaml.load(fileContent);
  //@ts-ignore
  let dataOfYml: string[] | null = parsedData.start;
  let startFiles: string[] = dataOfYml?.map((item: any) => item.path);
  let tags: string[] = dataOfYml?.map((item: any) => item.tag);
  // return;
  //@ts-ignore
  let language: string | null = parsedData.codebase;
  //@ts-ignore
  let howToSeeDependencies: string | null = parsedData.pathVisibility;

  if (!howToSeeDependencies || howToSeeDependencies === null) {
    return console.log(
      redBright('Please fill how to see dependencies in Deepdive.yml ...')
    );
  }
    //@ts-ignore
  let excludeFolders: string[] | null = parsedData.excludeFolders;
  if (!excludeFolders || excludeFolders === null || excludeFolders.length === 0) {
    return console.log(
      redBright('Please fill the folders you want to  exclude, like node_modules ...')
    );
  }

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
  // console.log(all_dependencies)
  //* < ------- >
// return;
  //@ts-ignore
  let proj_dependenciesdependencies: string[] | null = parsedData.exclude[0];
  // console.log(startFiles,tags,startFiles.length,startFiles[0])
  if (
    !startFiles ||
    startFiles.length === 0 ||
    startFiles.some((file) => file.trim() === '')
  ) {
    return console.log(
      redBright('Please enter the start files in Deepdive.yml ...')
    );
  }

  if (
    !tags ||
    tags.length === 0 ||
    tags.some((file) => file.trim() === '') ||
    tags.length !== startFiles.length
  ) {
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
    finalAns,
    howToSeeDependencies,
    excludeFolders
  );
}

start();
