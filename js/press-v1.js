import animateText from "../libs/text/text_animations.js";
import setOptions from "../libs/text/options.js";
import { animOptions } from "./anim_options.js";

const reviews = [
    { source: 'Jazz Magazine (FR)', review: 'Revelation!' },
    { source: 'Jazz Weekly (US)', review: 'Brings fresh ideas to the post bop genre.' },
    { source: 'Jazzwise (UK)', review: 'Rojo may be in his mid-twenties but already he is in his element with maturity and purpose.' },
    { source: 'NRW Jazz (DE)', review: "A fine, contemporary jazz record… the swing is relaxed, the boppy passages are driving, the ballads are tender and emotional - Rojo's own compositions have a lot to offer." },
    { source: 'Jazzmania (BE)', review: "Jordi Pujol, head of the Fresh Sound New Talent label, knows damn well who to give a chance to. With this Javier Rojo and his sextet, it's clearly a successful move." },
    { source: 'Jazzflits (NL)', review: 'Energetic, playful, and pleasantly sentimental' },
    { source: 'PJ Portrait in Jazz (JP)', review: 'Straight-ahead energy characteristic of young musicians, making it a refreshing listen.' },
    { source: 'Esensja (PL)', review: 'Javier Rojo – remember this artist!' },
    { source: 'Jazz Views (UK)', review: 'These guys are having real musical conversations.' },
    { source: 'Blue in Green (UK)', review: "The musical embodiment of wearing one's heart on their sleeve." },
    { source: 'Era Jazzu (PL)', review: 'A perfect showcase for the young European jazz scene.' },
];

function getRandomReview(previous) {
    let review;
    do {
        review = reviews[Math.floor(Math.random() * reviews.length)];
    } while (review === previous);

    return review;
}

let reviewContainer, sourceContainer, reviewOptions, sourceOptions;

function resetPressCarousel(container, delay) {
    const template = `
    <p class="review-container"></p>
    <p class="source-container"></p>
    `;

    container.innerHTML = template;

    reviewContainer = container.querySelector('.review-container');
    sourceContainer = container.querySelector('.source-container');

    reviewOptions = { ...animOptions.pressReview };
    sourceOptions = { ...animOptions.pressSource };
    reviewOptions.reverseDelay = (delay / 1000) * 0.75;
    sourceOptions.reverseDelay = (delay / 1000) * 0.75;

    let pressReview = getRandomReview();

    reviewContainer.innerHTML = `"${pressReview.review}"`;
    sourceContainer.innerHTML = `&mdash; ${pressReview.source}`;
}

export function startPressCarousel(container, delay) {
    resetPressCarousel(container, delay);
    animateText(reviewContainer, 'char', reviewOptions);
    animateText(sourceContainer, 'char', sourceOptions);

    const pressInterval = setInterval(() => {
        resetPressCarousel(container, delay);
        animateText(reviewContainer, 'char', reviewOptions);
        animateText(sourceContainer, 'char', sourceOptions);
    }, delay);

    window.addEventListener('beforeunload', () => clearInterval(pressInterval));
}