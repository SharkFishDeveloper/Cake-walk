import allDependenciesForJsTs from '../read_dependencies/js';

export async function readDependenciesFromPromt(language: string) {
  let answerDependencies: string[] = [];
  switch (language) {
    case 'Typescript':
    case 'Javascript':
    case 'NextJs':
    case 'ReactJs':
      answerDependencies = [...allDependenciesForJsTs, 'react', 'react-dom','react-router-dom'];
  }
  return answerDependencies;
}

export default readDependenciesFromPromt;
