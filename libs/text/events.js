import { getEasing, delayEasing } from "./easing.js";

/* --- HANDLE EVENTS --- */

// --- Scroll animation parameters --- 
let STEP_RATIO, EFFECT_RANGE, STICKY_POSITION, SCROLL_BUFFER;

function setupScroll(element) {
  // --- Setup scroll container ---

  const textContainer = element.querySelector('.text-container');

  element.style.height = scrollHeight + "px";;
  element.style.zIndex = '10';

  textContainer.style.position = "sticky";
  textContainer.style.top = `${window.innerHeight * STICKY_POSITION}px`;

  // Compute extra height needed for full animation scroll
  const elementRect = element.getBoundingClientRect();
  const extraHeight = scrollHeight - elementRect.height;

  // Create a spacer that includes the extra height
  const spacer = document.createElement('div');
  spacer.style.height = `${extraHeight}px`;
  spacer.style.width = '100%';
  spacer.style.pointerEvents = 'none';
  spacer.classList.add = 'spacer';
  
  // Insert it before the next element
  const nextElement = element.nextElementSibling;
  if (nextElement) {
    nextElement.parentElement.insertBefore(spacer, nextElement);
  } else {
    element.parentElement.appendChild(spacer);
  }
}

function updateScrollValues(element, splitNodes, options) {
  const { from, to, animType, scroll } = options;
  EFFECT_RANGE = scroll.effectRange;

  // Map window.scrollY to container.scrollTop
  const rect = element.getBoundingClientRect();
  const scrollTop = Math.max(0, Math.min(1, -rect.top / (scrollHeight * SCROLL_BUFFER)));

  // Set up range limits
  splitNodes.forEach((node, i) => {
    const min = -(i / EFFECT_RANGE);
    const max = ((splitNodes.length - 1) / EFFECT_RANGE - i / EFFECT_RANGE) + to;

    // Linear interpolation
    const rawValue = min + scrollTop * (max - min);
    let value = Math.max(from, Math.min(to, rawValue));

    // Update based on animation type
    switch (animType.split(' ')[0]) {
      case 'fontWeight':
        node.style.setProperty("-webkit-text-stroke", `${value}px`);
        break;

      case 'reveal':
        node.style.opacity = value;
        break;

      case 'scale':
        node.style.transform = `scale(${value})`;
        break;

      case 'translate':
        let property = '';
        const direction = animType.split(' ')[1];
        
        node.style.opacity = 1;

        switch (direction) {
          case 'up':
          case 'down':
            property = 'translateY';
            break;

          case 'left':
          case 'right':
            property = 'translateX';
            break;

          default:
            break;
        }

        switch (direction) {
          case 'up':
          case 'left':
            value = (1 - rawValue) * 100;
            node.style.transform = `${property}(${Math.max(0, Math.min(100, value))}%)`;
            break;

          case 'down':
          case 'right':
            value = (1 - rawValue) * -100;
            node.style.transform = `${property}(${Math.max(-100, Math.min(0, value))}%)`;
        };

        break;

      default:
        break;
    }
  })
}

function updateAutoValues(splitNodes, options) {
  const { to, animType, auto } = options;

  splitNodes.forEach((node, i) => {
    const easing = getEasing(auto.animEasing);
    const delay = delayEasing(i, splitNodes.length, options);

    switch (animType.split(' ')[0]) {
      case 'fontWeight':
        const weight = to;
        const durationMs = auto.duration * 1000;
        let startTime = null;

        setTimeout(() => {
          function step(timestamp) {
            if (!startTime) startTime = timestamp;

            let elapsed = timestamp - startTime;
            let progress = easing(Math.min(elapsed / durationMs, 1));

            let current = weight * progress;

            node.style.setProperty("-webkit-text-stroke", `${current}px`);
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }, delay);
        break;

      case 'reveal':
        node.style.transition = `opacity ${auto.duration}s ${auto.animEasing}`;
        setTimeout(() => {
          node.style.opacity = `${to}`;
        }, delay);
        break;

      case 'scale':
        node.style.transition = `transform ${auto.duration}s ${auto.animEasing}`;
        setTimeout(() => {
          node.style.transform = `scale(${to})`;
        }, delay);
        break;

      case 'translate':
        let property = '';
        const direction = animType.split(' ')[1];

        switch (direction) {
          case 'up':
          case 'down':
            property = 'translateY';
            break;

          case 'left':
          case 'right':
            property = 'translateX';
            break;

          default:
            break;
        }

        node.style.transition = `transform ${auto.duration}s ${auto.animEasing}`;
        setTimeout(() => {
          node.style.transform = `${property}(${to}%)`;
        }, delay);
        break;

      case 'scramble':
        // Build an alphabet array from a given text using only chars from this text
        function getAlphabet(array) {
          let alphabet = [];
          for (const element of array) {
            const text = element.span.innerText;
            if (text) alphabet.push(text.toLowerCase());
          }

          return Array.from(new Set(alphabet));
        };

        const alphabets = {
          accent: ['a', 'à', 'á', 'â', 'ä', 'b', 'c', 'ç', 'd', 'e', 'é', 'è', 'ë', 'f', 'g', 'h', 'i', 'í', 'ì', 'î', 'j', 'k', 'l', 'm', 'n', 'ñ', 'o', 'ö', 'ô', 'ó', 'ò', 'p', 'q', 'r', 's', 't', 'u', 'ü', 'ú', 'ù', 'û', 'v', 'w', 'x', 'y', 'z'],
          latin: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
          number: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
          custom: getAlphabet(splitNodes)
        }
        const regexs = {
          notAlphanumeric: /[^\p{L}\p{N}]/u,
          accent: /(?:\p{L}\p{M}+|[\u00C0-\u017F])/u,
          latin: /[a-z]/i,
          number: /[0-9]/
        };

        splitNodes.forEach((node, i) => {
          let char = node.innerText;

          if (regexs.notAlphanumeric.test(char) || char === '') return; // Validate char is alphanumeric

          // Determine alphabet
          let alphabet = [];
          if (options.alphabet) {
            if (options.alphabet === 'auto') alphabet = alphabets.custom;
            else alphabet = options.alphabet;
          } else if (regexs.latin.test(char)) alphabet = alphabets.latin;
          else if (regexs.accent.test(char)) alphabet = alphabets.accent;
          else if (regexs.number.test(char)) alphabet = alphabets.number;

          const originalChar = char; // Store original letter
          const charIndex = regexs.number.test(char) ? alphabet.indexOf(originalChar) : alphabet.indexOf(originalChar.toLowerCase()); // Store original letter index
          const time = options.speed === options.minSpeed ? options.speed : Math.floor(Math.random() * options.speed) + options.minSpeed; // Set scrambling speed

          let currentIndex = Math.floor(Math.random() * alphabet.length); // Pick a random char index in alphabet

          function setScramble() {
            if (currentIndex === charIndex) { // If the random char index is equal to the original char index, stop scrambling
              clearInterval(interval);
            }

            const currentChar = alphabet[currentIndex]; // Get random char
            node.innerText = /[A-Z]/.test(originalChar) ? currentChar.toUpperCase() : currentChar; // Replace char with random char and format case
            currentIndex = Math.floor(Math.random() * alphabet.length); // Pick another random char index before next interval
          };

          const interval = setInterval(setScramble, time); // Initiate time intervals

          // Clear interval after given duration
          if (options.auto.duration) {
            setTimeout(() => {
              node.innerText = originalChar;
              clearInterval(interval);
            }, options.auto.duration * 1000 * i)
          }
        })
        break;

      default:
        break;
    }
  })
}

function updateAnimValues(element, splitNodes, options) {
  if (options.animType !== 'opacity') element.style.opacity = '1';
  if (options.eventType === 'scroll') {
    updateScrollValues(element, splitNodes, options);
  } else {
    updateAutoValues(splitNodes, options);
  }
}

let scrollHeight = 0;

export function handleScroll(element, splitNodes, options) {
  const { scroll } = options;
  EFFECT_RANGE = scroll.effectRange;
  STEP_RATIO = scroll.stepRatio;
  STICKY_POSITION = scroll.stickyPosition;
  SCROLL_BUFFER = scroll.scrollBuffer;

  scrollHeight = (((splitNodes.length - 1) / EFFECT_RANGE) + options.to) / STEP_RATIO;

  setupScroll(element);

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateAnimValues.bind(null, element, splitNodes, options));
  }, { passive: true });

  window.addEventListener('resize', updateAnimValues.bind(null, element, splitNodes, options), { passive: true });

  // --- Initial sync ---
  updateAnimValues(element, splitNodes, options);
}

export function handleClick(element, splitNodes, options) {
  const textContainer = element.querySelector('.text-container');
  element.style.height = textContainer.getBoundingClientRect().height + 'px';

  element.addEventListener('click', updateAnimValues.bind(null, element, splitNodes, options));
};

export function handleIntersection(element, splitNodes, options) {
  const textContainer = element.querySelector('.text-container');
  element.style.height = textContainer.getBoundingClientRect().height + 'px';
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateAnimValues(element, splitNodes, options);
      }
    })
  }, options.intersection);

  observer.observe(element);
}