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
            background-color: black;
            overflow: hidden;  /* Prevent scrollbars */
        }
        canvas {
            display: block;
            cursor: grab;
        }
    </style>
</head>
<body>
    <canvas id="treeCanvas"></canvas>
    <script>
        const data = ${JSON.stringify(graph)};
        const canvas = document.getElementById('treeCanvas');
        const ctx = canvas.getContext('2d');

        const NODE_WIDTH = 120;
        const NODE_HEIGHT = 40;
        const HORIZONTAL_SPACING = 300;
        const VERTICAL_SPACING = 120;
        const PARENT_PATH_OFFSET = 200;  // Distance between the node and the parent path text

        // Variables for dragging and zooming
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;
        let offsetX = 0;
        let offsetY = 0;
        let zoom = 1; // Zoom level (1 is the default)

        // Resize the canvas to fill the entire screen
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        // Helper function to draw the nodes and connections
        function drawTree(node, x, y, parentPath, level = 0) {
            // Draw the current node
            ctx.fillStyle = '#3182bd';
            ctx.fillRect(x, y, NODE_WIDTH, NODE_HEIGHT);
            ctx.fillStyle = '#fff';
            ctx.font = \`14px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, x + NODE_WIDTH / 2, y + NODE_HEIGHT / 2);

            // Draw the parent path text next to the node
            ctx.fillStyle = '#fff';
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
                ctx.strokeStyle = '#ccc';
                ctx.stroke();

                // Recursively draw the child
                drawTree(childNode, childX, childY, child.child, level + 1);
                childX += HORIZONTAL_SPACING;  // Move the child X position
            });
        }

        // Redraw the tree with the current offset and zoom applied globally
        function redrawTree() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

            // Apply zoom to the entire context (this affects everything in the drawing)
            ctx.save();
            ctx.translate(offsetX, offsetY);  // Apply the current offset (for dragging)
            ctx.scale(zoom, zoom);  // Apply zoom scale to the entire tree

            const rootNode = { name: 'App.js' };  // Root node (start of the tree)
            drawTree(rootNode, canvas.width / 2 - NODE_WIDTH / 2, 20, './repo/Fundrz-client/src/App.js');

            ctx.restore();  // Restore the context after drawing
        }

        // Initial resize and draw
        resizeCanvas();
        redrawTree();

        // Window resize event to adjust canvas size dynamically
        window.addEventListener('resize', () => {
            resizeCanvas();
            redrawTree();
        });

        // Mouse down event for dragging
        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
            canvas.style.cursor = 'grabbing';
        });

        // Mouse move event for dragging
        canvas.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const dx = event.clientX - lastX;
                const dy = event.clientY - lastY;
                offsetX += dx;
                offsetY += dy;
                lastX = event.clientX;
                lastY = event.clientY;
                redrawTree();
            }
        });

        // Mouse up event to stop dragging
        canvas.addEventListener('mouseup', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        // Mouse leave event to stop dragging if mouse leaves the canvas
        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        // Mouse wheel event for zooming in and out
        canvas.addEventListener('wheel', (event) => {
            // Zoom in and out on the wheel scroll
            if (event.deltaY < 0) {
                zoom = Math.min(zoom + 0.05, 3); // Zoom in, but limit zooming in to 3x
            } else {
                zoom = Math.max(zoom - 0.05, 0.5); // Zoom out, but limit zooming out to 0.5x
            }
            redrawTree();
        });
    </script>
</body>
</html>
`;
exports.default = generateHTML;
