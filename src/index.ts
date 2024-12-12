#!/usr/bin/env node

import { greenBright, red, redBright } from 'cli-color';
import fs from 'fs';
import yaml from 'js-yaml';
import inquirer from 'inquirer';
import questions from './lib/util/prompt_questions.js';
import { createSpinner } from 'nanospinner';
import { readDependenciesFromPromt } from './lib/util/prompt_depedecy_list';

async function start() {
  try {
    //@ts-ignore
    const prompt_answer = await inquirer.prompt(questions);

    if (!fs.existsSync('cake-walk.yml')) {
      console.log(
        greenBright(
          'I made cake-walk.yml file, please fill it and then continue '
        )
      );
    }
    
    let dependencies =  await readDependenciesFromPromt(prompt_answer.language);

    const ymlData = {
      codebase:[prompt_answer.language],
      start: [prompt_answer.startPoint],
      dependencies: [dependencies],
      exclude:{},
      components: '',
    };

    let yamlString = yaml.dump(ymlData, {
      indent: 8, // Indentation level
      lineWidth: 80, // Limit line width for readability
      noRefs: true, // Don't include references to objects in YAML
      skipInvalid: true, // Skip invalid keys
    });

    yamlString = yamlString.replace(/^(\w+):\n/gm, '\n$1:\n');
    fs.writeFileSync('cake-walk.yml', yamlString);
  } catch (error) {
    console.log(red(error));
  }
}

start();
