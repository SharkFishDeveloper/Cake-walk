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
exports.createHtmlFile = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const openurl_1 = require("openurl");
const generateHtml_1 = __importDefault(require("./generateHtml"));
function createHtmlFile(graph) {
    return __awaiter(this, void 0, void 0, function* () {
        const htmlFilePath = './graph.html';
        fs_1.default.writeFileSync(htmlFilePath, (0, generateHtml_1.default)(graph), 'utf8');
        // Serve the HTML file
        const server = http_1.default.createServer((req, res) => {
            if (req.url === '/') {
                fs_1.default.readFile(htmlFilePath, (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading HTML file');
                    }
                    else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    }
                });
            }
            else {
                res.writeHead(404);
                res.end('Not Found');
            }
        });
        const port = 3000;
        server.listen(port, () => {
            (0, openurl_1.open)(`http://localhost:${port}`);
            setTimeout(() => {
                server.close(() => {
                    fs_1.default.unlinkSync(htmlFilePath);
                });
            }, 1000);
        });
    });
}
exports.createHtmlFile = createHtmlFile;
