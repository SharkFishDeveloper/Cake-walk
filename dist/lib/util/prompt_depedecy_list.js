"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDependenciesFromPromt = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function readDependenciesFromPromt(language, startPoint) {
    return __awaiter(this, void 0, void 0, function* () {
        let answerDependencies = [];
        switch (language) {
            case 'Typescript':
            case 'Javascript':
            case 'NextJs':
            case 'ReactJs':
                //* <----->
                //* Change it according to every language
                let relativeDirDependencies = yield readPackageJsonForEachDir(startPoint);
                //* <----->
                answerDependencies = [
                    ...relativeDirDependencies,
                ];
        }
        return answerDependencies;
    });
}
exports.readDependenciesFromPromt = readDependenciesFromPromt;
exports.default = readDependenciesFromPromt;
function readPackageJsonForEachDir(startPoint) {
    return __awaiter(this, void 0, void 0, function* () {
        const dependencies = [];
        // Recursive helper function to traverse directories
        function traverseDir(directory) {
            if (fs_1.default.existsSync(directory) && fs_1.default.lstatSync(directory).isDirectory()) {
                // Prevent going into node_modules
                if (directory.includes('node_modules'))
                    return;
                // Check if the directory contains a package.json
                const packageJsonPath = path_1.default.join(directory, 'package.json');
                if (fs_1.default.existsSync(packageJsonPath)) {
                    try {
                        // Read and parse package.json
                        const fileData = fs_1.default.readFileSync(packageJsonPath, 'utf-8');
                        const packageJson = JSON.parse(fileData);
                        // Collect dependencies and devDependencies
                        const deps = Object.keys(packageJson.dependencies || {});
                        const devDeps = Object.keys(packageJson.devDependencies || {});
                        // Append dependencies to the list (only unique values)
                        dependencies.push(...deps, ...devDeps);
                    }
                    catch (error) {
                        console.error(`Failed to read or parse ${packageJsonPath}:`, error);
                    }
                }
                // Recursively check subdirectories (skip node_modules)
                const subDirs = fs_1.default.readdirSync(directory);
                for (const subDir of subDirs) {
                    const fullPath = path_1.default.join(directory, subDir);
                    if (fs_1.default.lstatSync(fullPath).isDirectory()) {
                        traverseDir(fullPath);
                    }
                }
            }
        }
        // Start traversal from the given starting point
        traverseDir(startPoint);
        // Return unique dependencies (removes duplicates)
        return [...new Set(dependencies)];
    });
}
