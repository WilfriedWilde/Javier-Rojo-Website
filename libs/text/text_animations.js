import splitText from "./split.js";
import { handleClick, handleIntersection, handleScroll } from "./events.js";

/* <==== ANIMATE TEXT ====> */

// Prepare nodes for animation
function prepareForAnim(splitNodes, options) {
  const { animType, from } = options;
  switch (animType.split(' ')[0]) {
    case 'reveal':
      splitNodes.forEach(node => {
        node.style.opacity = `${from}`;
      })
      break;

    case 'scale':
      splitNodes.forEach(node => {
        node.style.transform = `scale(${from})`;
      })
      break;

    case 'translate':
      splitNodes.forEach(node => {
        const direction = animType.split(' ')[1];
        switch (direction) {
          case 'up':
          case 'down':
            node.style.transform = `translateY(${from}%)`;
            break;

          case 'right':
          case 'left':
            node.style.transform = `translateX(${from}%)`;
            break;

          default:
            break;
        }
      })
      break;

    default:
      break;
  }
};

function handleAnimation(element, splitNodes, options) {
  prepareForAnim(splitNodes, options);

  if (options.eventType === 'click') {
    if (options.reverse === true) {
      handleClick(element, splitNodes, options);

      setTimeout(() => {
        const newTo = options.from;
        const newFrom = options.to;

        options.to = newTo;
        options.from = newFrom;

        handleClick(element, splitNodes, options);
      }, options.reverseDelay * 1000);
    } else handleClick(element, splitNodes, options);
  }
  else if (options.eventType === 'intersection') {
    if (options.reverse === true) {
      handleIntersection(element, splitNodes, options);

      setTimeout(() => {
        const newTo = options.from;
        const newFrom = options.to;

        options.to = newTo;
        options.from = newFrom;

        handleIntersection(element, splitNodes, options);
      }, options.reverseDelay * 1000);
    } else handleIntersection(element, splitNodes, options);
  } else if (options.eventType === 'scroll') {
    if (options.reverse === true) {
      handleScroll(element, splitNodes, options);

      setTimeout(() => {
        const newTo = options.from;
        const newFrom = options.to;

        options.to = newTo;
        options.from = newFrom;

        handleScroll(element, splitNodes, options);
      }, options.reverseDelay * 1000);
    } else handleScroll(element, splitNodes, options);
  }
};

export default function animateText(element, splitType, options) {
  const splitNodes = splitText(element, splitType);
  handleAnimation(element, splitNodes, options);
};