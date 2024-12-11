import {greenBright, red } from "cli-color"
import fs from "fs";
import yaml from 'js-yaml';
import { excludeFiles } from "./lib/exclude";
import inquirer from 'inquirer';
import questions from "./lib/prompt_questions";


async function start() {
    try {
            //@ts-ignore
          const answer = await inquirer.prompt([questions[0]]);

          console.log(answer)
          return;

        if(!fs.existsSync("cake-walk.yml")){
            console.log(greenBright("I made cake-walk.yml file, please fill it and then continue "))
        }


        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        const allDependencies = [...Object.keys(dependencies), ...Object.keys(devDependencies)];

        const ymlData = {
            start:["eg ../App.jsx"],
            dependencies: allDependencies,
            exclude: [excludeFiles],
            components:""
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
     console.log(red(error))   
    }
}


start();
