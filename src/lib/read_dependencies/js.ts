import fs from "fs";

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

console.log("packageJson",packageJson)

const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};


const allDependenciesForJsTs = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
];

console.log(packageJson)
export default allDependenciesForJsTs;
