"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateHTML = (graph, start) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canvas Tree Visualization</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: black;  /* Set the entire body background to black */
            color: white;
        }
        canvas {
            background-color: black;  /* Ensure the canvas background is black */
            display: block;
            margin: 0 auto;
            border: 1px solid white;  /* Set the canvas border to white */
        }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: white;">File Dependency Tree on Canvas</h1>
    <canvas id="treeCanvas" width="800" height="600"></canvas>
    <script>
        const data = ${JSON.stringify(graph)};
        const canvas = document.getElementById('treeCanvas');
        const ctx = canvas.getContext('2d');

        const NODE_WIDTH = 120;
        const NODE_HEIGHT = 40;
        const HORIZONTAL_SPACING = 200;
        const VERTICAL_SPACING = 80;
        const PARENT_PATH_OFFSET = 150;  // Distance between the node and the parent path text

        // Helper function to draw the nodes and connections
        function drawTree(node, x, y, parentPath, level = 0) {
            // Draw the current node (with only borders and no fill)
            ctx.fillStyle = 'transparent';
            ctx.strokeStyle = '#fff';  // Set the border color to white
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, NODE_WIDTH, NODE_HEIGHT);
            
            // Draw the text inside the node
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, x + NODE_WIDTH / 2, y + NODE_HEIGHT / 2);

            // Draw the parent path text next to the node
            ctx.fillStyle = '#fff'; // White text
            ctx.font = '12px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(parentPath, x + NODE_WIDTH + 10, y + NODE_HEIGHT / 2);

            // Draw children and connect them with lines
            const children = data[node.name] || [];
            let childX = x - (children.length - 1) * HORIZONTAL_SPACING / 2;

            children.forEach(child => {
                const childNode = { name: child.import_name };
                const childY = y + VERTICAL_SPACING;
                
                // Draw a line from parent to child
                ctx.beginPath();
                ctx.moveTo(x + NODE_WIDTH / 2, y + NODE_HEIGHT);
                ctx.lineTo(childX + NODE_WIDTH / 2, childY);
                ctx.strokeStyle = '#fff'; // White lines for connections
                ctx.stroke();
                
                // Recursively draw the child
                drawTree(childNode, childX, childY, child.child, level + 1);
                childX += HORIZONTAL_SPACING;  // Move the child X position
            });
        }

        // Start drawing the tree from the "root" node
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas
        const rootNode = { name: 'App.js' };  // Root node (start of the tree)
        drawTree(rootNode, canvas.width / 2 - NODE_WIDTH / 2, 20, './repo/Fundrz-client/src/App.js');  // Center the root node
    </script>
</body>
</html>
`;
exports.default = generateHTML;
