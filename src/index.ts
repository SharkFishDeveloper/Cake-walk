#!/usr/bin/env node

import { greenBright, red, redBright, yellowBright } from 'cli-color';
import fs from 'fs';
import yaml from 'js-yaml';
import inquirer from 'inquirer';
import questions from './lib/util/prompt_questions.js';
import { createSpinner } from 'nanospinner';
import { readDependenciesFromPromt } from './lib/util/prompt_depedecy_list';
import { doSomething } from './lib/crawler/doSomething';

async function start() {
  try {
    //? Add logic so it does not ask question again and agai

    if (!fs.existsSync('deepdive.yml')) {
      //@ts-ignore
      const prompt_answer = await inquirer.prompt(questions);

      let dependencies = await readDependenciesFromPromt(
        prompt_answer.language
      );

      const ymlData = {
        codebase: [prompt_answer.language],
        start: [prompt_answer.startPoint],
        dependencies: [dependencies],
        // exclude:["//eg. files or folders which you want to exclude"],
        // components: '',
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
      handleParsedDataAfterPrompt();
    }
  } catch (error) {
    console.log(red(error));
  }
}

async function handleParsedDataAfterPrompt() {
  const fileContent = fs.readFileSync('deepdive.yml', 'utf8');
  const parsedData = yaml.load(fileContent);
  //@ts-ignore
  let startFiles:string[]|null = parsedData.start;
  //@ts-ignore
  let language:string|null = parsedData.codebase;

  if (startFiles===null || startFiles.length === 0) {
    return console.log(redBright('Please enter the start files in Deepdive.yml ...'))
  }
  if(language===null || !language){
    return console.log(redBright('Please enter the language in  Deepdive.yml ...'))
  }
  startFiles.forEach(async(start)=>{
    await doSomething(start,language as string);
  })
}

start();
