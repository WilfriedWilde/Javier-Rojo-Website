/* <==== SPLIT TEXT ====> */

// Wrap original node to hide its content
function hideOriginalContent(node) {
    const mask = document.createElement('div');
    const textContent = node.textContent;

    node.textContent = '';
    mask.textContent = textContent; 
    mask.style.position = 'absolute';
    mask.style.opacity = '0';
    mask.classList.add('original-hidden');
    node.appendChild(mask);
}

export default function splitText(node, splitType) {
    const range = document.createRange();
    let nodesArr = [];
    let splitNodes = [];

    function replace(node) {
        const { container, rects, content, alignAttr } = node;

        // Create a mask to substitute original element
        const mask = document.createElement('div');
        mask.classList.add('mask');

        // Place mask using original element's rects
        mask.style.position = 'absolute';
        mask.style.width = `${rects.width}px`;
        mask.style.height = `${rects.height}px`;
        mask.style.top = `${rects.top - nodeRects.top}px`;
        mask.style.left = `${rects.left - nodeRects.left}px`;
        mask.style.x = `${rects.x}px`;
        mask.style.y = `${rects.y}px`;
        mask.style.overflow = 'hidden';

        // Create, place and store span containing the content
        const span = document.createElement('span');

        span.style.position = 'absolute';
        span.style.top = "0";
        span.style.left = "0";
        span.style.textAlign = alignAttr;
        span.innerText = content;

        splitNodes.push(span);

        // Append span to mask
        mask.appendChild(span);

        // Append mask into container
        container.appendChild(mask);
    };

    // Set up container
    const nodeRects = node.getBoundingClientRect();
    const container = document.createElement('div');
    container.classList.add('text-container');
    container.style.position = 'absolute';
    container.style.height = `${nodeRects.height}px`;
    container.style.width = `${nodeRects.width}px`;
    container.style.top = 0;

    // Store node's parent, rect, and content depending on split type
    const alignAttr = window.getComputedStyle(node).textAlign;
    const text = node.firstChild;
    let rects, content;

    if (splitType === 'line') {
        // Get line's text content
        let linesText = [];
        let index = 0;

        // Set up first line with its own rect and first char
        range.setStart(text, index);
        range.setEnd(text, index + 1);
        let rect = range.getClientRects()[0];
        let content = range.toString();
        let currentLine = { top: rect.top, textContent: "" };

        // Loop through the text to detect changes of line (comparing top)
        while (index < text.length) {
            if (rect.top !== currentLine.top) {
                linesText.push(currentLine.textContent);
                currentLine = { top: rect.top, textContent: "" };
            }
            currentLine.textContent += content;

            index++;
            if (index < text.length) {
                range.setStart(text, index);
                range.setEnd(text, index + 1);
                rect = range.getClientRects()[0];
                content = range.toString();
            }
        }
        linesText.push(currentLine.textContent);

        // Get line's rects
        range.selectNodeContents(node);
        rects = range.getClientRects();

        for (let i = 0; i < linesText.length; i++) {
            nodesArr.push({ container, rects: rects[i], content: linesText[i], alignAttr })
        }
    } else if (splitType === 'char') {
        for (let i = 0; i < text.length; i++) {
            range.setStart(text, i);
            range.setEnd(text, i + 1);
            rects = range.getClientRects()[0];
            content = range.toString();
            nodesArr.push({ container, rects, content, alignAttr });
        }
    } else {
        range.selectNodeContents(node)
        rects = range.getBoundingClientRect();
        content = node.innerText;
        nodesArr.push({ container, rects, content, alignAttr });
    }

    // Hide original content
    hideOriginalContent(node);

    // Replace original elements with split ones
    for (const node of nodesArr) {
        replace(node);
    }

    // Append container into node
    node.style.width = `${nodeRects.width}px`;
    node.appendChild(container);

    return splitNodes;
};
