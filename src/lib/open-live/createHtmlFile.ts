import { Graph } from "../interfaces/Graph";
import fs from "fs";
import http from "http";
import {open} from "openurl"
import generateHTML from "./generateHtml";



async function createHtmlFile(graph:Graph,start:string) {
    const htmlFilePath = './graph.html';
    fs.writeFileSync(htmlFilePath, generateHTML(graph,start), 'utf8');
    
// Serve the HTML file
const server = http.createServer((req, res) => {
    if (req.url === '/') {
      fs.readFile(htmlFilePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end('Error loading HTML file');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(data);
        }
      });
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  const port = 3000;
  server.listen(port, () => {
    open(`http://localhost:${port}`);
    setTimeout(() => {
        server.close(() => {
          fs.unlinkSync(htmlFilePath); 
        });
      }, 1000);
  });
}

export {createHtmlFile};