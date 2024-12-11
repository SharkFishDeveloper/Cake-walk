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
const cli_color_1 = require("cli-color");
const fs_1 = __importDefault(require("fs"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const exclude_1 = require("./lib/exclude");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!fs_1.default.existsSync("cake-walk.yml")) {
                console.log((0, cli_color_1.greenBright)("I made cake-walk.yml file, please fill it and then continue "));
            }
            const packageJson = JSON.parse(fs_1.default.readFileSync('package.json', 'utf8'));
            const dependencies = packageJson.dependencies || {};
            const devDependencies = packageJson.devDependencies || {};
            const allDependencies = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
            const ymlData = {
                start: ["eg ../App.jsx"],
                dependencies: allDependencies,
                exclude: [exclude_1.excludeFiles],
                components: ""
            };
            let yamlString = js_yaml_1.default.dump(ymlData, {
                indent: 8, // Indentation level
                lineWidth: 80, // Limit line width for readability
                noRefs: true, // Don't include references to objects in YAML
                skipInvalid: true, // Skip invalid keys
            });
            yamlString = yamlString.replace(/^(\w+):\n/gm, '\n$1:\n');
            fs_1.default.writeFileSync('cake-walk.yml', yamlString);
        }
        catch (error) {
            console.log((0, cli_color_1.red)(error));
        }
    });
}
start();
