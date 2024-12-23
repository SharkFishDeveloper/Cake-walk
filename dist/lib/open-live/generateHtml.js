"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateHTML = (graph, start) => `
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
      background-color: #111211;
      border: 1px solid black;
    }
  </style>
</head>
<body>
  <canvas id="graphCanvas"></canvas>
  <script>
    const graph = ${JSON.stringify(graph)};
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    // Initial canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const baseNodeRadius = 30;  // Base radius
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
        visibleEdges[\`\${parent}-\${child}\`] = true;
      });
    });

    const drawNode = (x, y, name, import_name) => {
      ctx.beginPath();
      ctx.arc(x * zoom + offsetX, y * zoom + offsetY, nodeRadius * zoom, 0, 2 * Math.PI);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "green";
      ctx.font = \`\${16 * zoom}px Arial\`;  // Increase font size for node name
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(name, x * zoom + offsetX, y * zoom + offsetY); // Center name in the middle of node
      
      // Decrease font size for import statement and position it to the left
      ctx.fillStyle = "#ffffff";
      ctx.font = \`\${8 * zoom}px Arial\`;  // Smaller font size for import statement
      ctx.textAlign = "left";
      ctx.fillText(\`Import: \${import_name}\`, x * zoom + offsetX - nodeRadius, y * zoom + offsetY + nodeRadius); // Position import name on the left

      return { x: x * zoom + offsetX, y: y * zoom + offsetY, name };
    };

    const drawEdge = (x1, y1, x2, y2) => {
      ctx.beginPath();
      ctx.moveTo(x1 * zoom + offsetX, y1 * zoom + offsetY);
      ctx.lineTo(x2 * zoom + offsetX, y2 * zoom + offsetY);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2 * zoom;  // Adjust stroke width based on zoom level
      ctx.stroke();
    };

    const renderGraph = (node, x, y) => {
      const currentNode = drawNode(x, y, node, graph[node]?.[0]?.import_name || "No Import"); // Access import_name correctly
      const children = graph[node] || [];
      let childX = x - (children.length - 1) * horizontalSpacing / 2;

      const nodePositions = [currentNode];
      children.forEach(({ child, import_name }) => {
        const childY = y + verticalSpacing;
        // Check if the edge is visible, otherwise skip drawing the edge
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
      return renderGraph('a', canvas.width / 2 / zoom, 50 / zoom);
    };

    let nodePositions = render();

    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      nodePositions.forEach(({ x, y, name }) => {
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        if (distance <= nodeRadius * zoom) {
          // Toggle visibility of edges for clicked node's children
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

    // Zoom functionality
    canvas.addEventListener("wheel", (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoom *= 1.1; // Zoom in
        } else {
          zoom /= 1.1; // Zoom out
        }

        // Apply zoom limits
        zoom = Math.max(0.1, Math.min(zoom, 3));

        nodeRadius = baseNodeRadius * zoom;  // Adjust node radius based on zoom
        nodePositions = render();
      }
    });

    // Adjust canvas size on window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      ctx.imageSmoothingEnabled = true; 
      canvas.height = window.innerHeight;
      nodePositions = render();
    });
  </script>
</body>
</html>
`;
exports.default = generateHTML;
