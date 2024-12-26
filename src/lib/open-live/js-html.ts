import { Graph } from '../interfaces/Graph';

const generateHTML = (graph: Graph, start: string): string => `
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
            color: white;
        }
        canvas {
            background-color: black;
            display: block;
            margin: 0 auto;
            border: 1px solid white;
        }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: white;">File Dependency Tree on Canvas aaa</h1>
    <p>Hello there</p>
    <canvas id="treeCanvas"></canvas>
    <script>
        const data = ${JSON.stringify(graph)};
        const canvas = document.getElementById('treeCanvas');
        const ctx = canvas.getContext('2d');

        let canvasWidth = window.innerWidth;
        let canvasHeight = window.innerHeight;
        let scale = 1;
        let offsetX = 0, offsetY = 0;
        let isDragging = false;
        let lastX = 0, lastY = 0;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const NODE_WIDTH = 120;
        const NODE_HEIGHT = 40;
        const HORIZONTAL_SPACING = 200;
        const VERTICAL_SPACING = 80;
        const PARENT_PATH_OFFSET = 150;

        // Helper function to draw the nodes and connections
        function drawTree(node, x, y, parentPath, level = 0) {
            x = x * scale + offsetX;
            y = y * scale + offsetY;

            ctx.fillStyle = 'transparent';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, NODE_WIDTH * scale, NODE_HEIGHT * scale);

            ctx.fillStyle = '#fff';
            ctx.font = \`\${14 * scale}px Arial\`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.name, x + NODE_WIDTH * scale / 2, y + NODE_HEIGHT * scale / 2);

            ctx.fillStyle = '#fff';
            ctx.font = \`\${12 * scale}px Arial\`;
            ctx.textAlign = 'left';
            ctx.fillText(parentPath, x + NODE_WIDTH * scale + 10, y + NODE_HEIGHT * scale / 2);

            const children = data[node.name] || [];
            let childX = x - (children.length - 1) * HORIZONTAL_SPACING * scale / 2;

            children.forEach(child => {
                const childNode = { name: child.import_name };
                const childY = y + VERTICAL_SPACING * scale;

                ctx.beginPath();
                ctx.moveTo(x + NODE_WIDTH * scale / 2, y + NODE_HEIGHT * scale);
                ctx.lineTo(childX + NODE_WIDTH * scale / 2, childY);
                ctx.strokeStyle = '#fff';
                ctx.stroke();

                drawTree(childNode, childX, childY, child.child, level + 1);
                childX += HORIZONTAL_SPACING * scale;
            });
        }

        function redrawTree() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const rootNode = { name: 'App.js' };
            drawTree(rootNode, canvas.width / 2 - NODE_WIDTH / 2, 20, './repo/Fundrz-client/src/App.js');
        }

        redrawTree();

        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const zoomFactor = 0.05; // Adjust this to control the zoom speed
            if (event.deltaY < 0) {
                scale += zoomFactor;
            } else {
                scale -= zoomFactor;
                if (scale < 0.1) scale = 0.1;
            }
            redrawTree();
        });

        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        });

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

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });

        window.addEventListener('resize', () => {
            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
            redrawTree();
        });
    </script>
</body>
</html>
`;

export default generateHTML;
