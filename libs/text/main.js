import animateText from "./text_animations.js";
import setOptions from "./options.js";

const one = document.getElementById('one');
const two = document.getElementById('two');
const three = document.getElementById('three');
const four = document.getElementById('four');

const options = {
  fontWeigth: setOptions({
    animType: 'fontWeight',
    eventType: 'intersection',
    from: 0,
    to: 3,
    reverse: false,
    reverseDelay: null,
    scroll: {
      stepRatio: 0.004,
      effectRange: 50,
      stickyPosition: 0.5,
      scrollBuffer: 0.3
    },
    auto: {
      duration: 1,
      delay: 1.2,
      animEasing: 'linear',
      delayEasing: 'linear'
    },
    intersection: {
      root: null,
      rootMargin: '-50%',
      threshold: 0
    }
  }),

  reveal: setOptions({
    animType: 'reveal',
    eventType: 'scroll',
    from: 0,
    to: 1,
    reverse: false,
    reverseDelay: null,
    scroll: {
      stepRatio: 0.004,
      effectRange: 50,
      stickyPosition: 0.5,
      scrollBuffer: 0.3
    },
    auto: {
      duration: 1,
      delay: 6,
      animEasing: 'linear',
      delayEasing: 'linear'
    },
    intersection: {
      root: null,
      rootMargin: '-50%',
      threshold: 0
    }
  }),

  scale: setOptions({
    animType: 'scale',
    eventType: 'intersection',
    from: 0,
    to: 1,
    reverse: false,
    reverseDelay: null,
    scroll: {
      stepRatio: 0.004,
      effectRange: 50,
      stickyPosition: 0.5,
      scrollBuffer: 0.3
    },
    auto: {
      duration: 1,
      delay: 5,
      animEasing: 'linear',
      delayEasing: 'linear'
    },
    intersection: {
      root: null,
      rootMargin: '-50%',
      threshold: 0
    }
  }),

  translate: setOptions({
    animType: 'translate down',
    eventType: 'scroll',
    from: 0,
    to: 1,
    reverse: false,
    reverseDelay: null,
    scroll: {
      stepRatio: 0.004,
      effectRange: 50,
      stickyPosition: 0.5,
      scrollBuffer: 0.3
    },
    auto: {
      duration: 1,
      delay: 4,
      animEasing: 'ease-in-out',
      delayEasing: 'linear'
    },
    intersection: {
      root: null,
      rootMargin: '-20%',
      threshold: 0
    }
  }),

  scramble: {
    ...setOptions({
      animType: 'scramble',
      eventType: 'intersection',
      from: null,
      to: null,
      reverse: false,
      reverseDelay: null,
      scroll: {
        stepRatio: null,
        effectRange: null,
        stickyPosition: null,
        scrollBuffer: null
      },
      auto: {
        duration: 0.4,
        delay: null,
        animEasing: null,
        delayEasing: null
      },
      intersection: {
        root: null,
        rootMargin: '0px',
        threshold: 0
      }
    }),
    minSpeed: 200,
    speed: 400,
    alphabet: 'fuck' // alphabet accept either 'auto', a string or an array of chars.
  }
};

animateText(one, 'char', options.scramble);
animateText(two, 'char', options.reveal);
animateText(three, 'char', options.scale);
animateText(four, 'char', options.translate);