import { Graph } from "../interfaces/Graph";

const generateHTML = (graph: Graph, start: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Graph Visualization</title>
  <style>
    body, html {
      margin: 0;
      height: 100%;
      overflow: hidden;
    }
    canvas {
      display: block;
      background-color: #6448c2;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <canvas id="graphCanvas"></canvas>
  <script>
    const graph = ${JSON.stringify(graph)};
    const startNode = "${start}";
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    // Initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 

    const baseNodeRadius = 5;
    let nodeRadius = baseNodeRadius;
    const horizontalSpacing = 150;
    const verticalSpacing = 100;
    let zoom = 1;
    let offsetX = 0;
    let offsetY = 0;

    // Tracks visibility of edges
    const visibleEdges = {};
    Object.keys(graph).forEach(parent => {
      graph[parent].forEach(({ child }) => {
        visibleEdges[\`\${parent}-\${child}\`] = false;
      });
    });

    if (graph[startNode]) {
      graph[startNode].forEach(({ child }) => {
        visibleEdges[\`\${startNode}-\${child}\`] = true;
      });
    }

    const drawNode = (x, y, name, import_name, childCount) => {
      ctx.beginPath();
      ctx.arc(x * zoom + offsetX, y * zoom + offsetY, nodeRadius * zoom, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "green";
      ctx.font = \`\${8 * zoom}px Arial\`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, x * zoom + offsetX, y * zoom + offsetY);

      // Display number of children on the left side
      ctx.fillStyle = "#ffffff";
      ctx.font = \`\${4 * zoom}px Arial\`;
      ctx.textAlign = "right";
      ctx.fillText(\`\Children: \${childCount}\`, x * zoom + offsetX - nodeRadius - 30, y * zoom + offsetY);

      // Display import name on the left side
      ctx.fillStyle = "#ffffff";
      ctx.font = \`\${6 * zoom}px Arial\`;
      ctx.textAlign = "right";
      ctx.fillText(\`\Import: \${import_name}\`, x * zoom + offsetX - nodeRadius - 30, y * zoom + offsetY + 12);

      return { x: x * zoom + offsetX, y: y * zoom + offsetY, name };
    };

    const drawEdge = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1 * zoom + offsetX, y1 * zoom + offsetY);
      ctx.lineTo(x2 * zoom + offsetX, y2 * zoom + offsetY);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * zoom;
      ctx.stroke();
    };

    const renderGraph = (node, x, y) => {
      const currentNode = drawNode(x, y, node, graph[node]?.[0]?.import_name || "No Import", graph[node]?.length || 0);
      const children = graph[node] || [];
      let childX = x - (children.length - 1) * horizontalSpacing / 2;

      const nodePositions = [currentNode];
      children.forEach(({ child, import_name }) => {
        const childY = y + verticalSpacing;

        if (visibleEdges[\`\${node}-\${child}\`]) {
          drawEdge(x, y, childX, childY);
          nodePositions.push(...renderGraph(child, childX, childY));
        }
        childX += horizontalSpacing;
      });

      return nodePositions;
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (graph[startNode]) {
        return renderGraph(startNode, canvas.width / 2 / zoom, 50 / zoom);
      } else {
        console.error("Invalid start node:", startNode);
        return [];
      }
    };

    let nodePositions = render();

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      nodePositions.forEach(({ x, y, name }) => {
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        if (distance <= nodeRadius * zoom) {
          const children = graph[name] || [];
          children.forEach(({ child }) => {
            visibleEdges[\`\${name}-\${child}\`] = !visibleEdges[\`\${name}-\${child}\`];
          });
          nodePositions = render();
        }
      });
    });

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.clientX - offsetX;
      startY = e.clientY - offsetY;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        offsetX = e.clientX - startX;
        offsetY = e.clientY - startY;
        nodePositions = render();
      }
    });

    canvas.addEventListener("mouseup", () => {
      isDragging = false;
    });

    canvas.addEventListener("wheel", (e) => {
  if (e.ctrlKey) {
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert mouse position to world coordinates (canvas coordinate system before zoom)
    const mouseXWorld = (mouseX - offsetX) / zoom;
    const mouseYWorld = (mouseY - offsetY) / zoom;

    // Smooth zooming factor (adjust as necessary)
    const zoomFactor = e.deltaY < 0 ? 1.05 : 0.95; // Decrease zoom speed for smoother experience
    const newZoom = Math.max(0.1, Math.min(zoom * zoomFactor, 3));

    // Adjust the offset to zoom around the mouse position
    offsetX -= mouseXWorld * (newZoom - zoom);
    offsetY -= mouseYWorld * (newZoom - zoom);

    zoom = newZoom;
    nodeRadius = baseNodeRadius * zoom;

    nodePositions = render();
  }
});

const resizeCanvas = () => {
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;

  canvas.style.width = \`$\{window.innerWidth}px\`;
  canvas.style.height = \`\${window.innerHeight}px\`;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

resizeCanvas();
nodePositions = render();

window.addEventListener("resize", () => {
  resizeCanvas();
  nodePositions = render();
});

    console.log("Graph data:", graph);
    console.log("Start node:", startNode);
  </script>
</body>
</html>
`;

export default generateHTML;
