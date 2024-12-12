"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const packageJson = JSON.parse(fs_1.default.readFileSync('./package.json', 'utf8'));
const dependencies = packageJson.dependencies || {};
const devDependencies = packageJson.devDependencies || {};
const allDependenciesForJsTs = [
    ...Object.keys(dependencies),
    ...Object.keys(devDependencies),
];
exports.default = allDependenciesForJsTs;
