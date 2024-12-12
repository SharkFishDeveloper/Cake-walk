import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};

const allDependenciesForJsTs = [
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies),
];

export default allDependenciesForJsTs;
