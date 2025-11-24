// Easing functions
function linear(t) {
    return t;
}

function easeIn(t) { 
    return t * t;
}

function easeOut(t) {
    return t * (2 - t);
}

function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Helper functions
const easings = {
    'linear': linear,
    'ease-in': easeIn,
    'ease-out': easeOut,
    'ease-in-out': easeInOut
};

export function getEasing(string) {
    return easings[string] || linear;
}

export function delayEasing(index, length, options) {
    const { auto } = options;

    const easing = getEasing(auto.delayEasing);
    const t = index / (length - 1);
    const easedT = easing(t);

    return easedT * auto.delay * 1000;
}