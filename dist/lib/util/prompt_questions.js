"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }
];
exports.default = questions;
