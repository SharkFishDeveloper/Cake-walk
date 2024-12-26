const questions = [
  {
    type: 'list',
    name: 'language',
    message: 'What is your codebase in ?',
    choices: [
      'ReactJs',
      'NextJs',
      'Javascript',
      'Typescript',
      'Golang',
      'Rust',
    ],
  },
  {
    type: 'list',
    name: 'ansFormat',
    message: 'Do you want to see full dependencies or half ?',
    choices: ['full', 'half'],
  },
  {
    type: 'input',
    name: 'startPoint',
    message: 'What is the starting point of your project?',
    default: '',
  },
  {
    type: 'input',
    name: 'startPointTag',
    message: 'What is the tag of your starting file ?',
    default: '',
  },
];
// ./repo/Fundrz-client/src/App.js
export default questions;
