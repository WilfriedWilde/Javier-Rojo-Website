import animateText from "../libs/text/text_animations.js";
import { animOptions } from "./anim_options.js";
import { startPressCarousel } from "./press.js";
import { fetchArticlesData, displayNewsList, displaySelectedNews } from "./news.js";

const subheadersContainer = document.getElementById('hero-subheaders-container');
const subheaders = Array.from(subheadersContainer.children);

// constants
const DELAY_STEP = 500;
const GOLDEN_RATIO = 1.618;

const ANIM_DELAYS = {
    background: DELAY_STEP,
    title: DELAY_STEP * GOLDEN_RATIO * 2,
    subheaders: {
        start: DELAY_STEP * GOLDEN_RATIO * 3,
        anim: 150
    },
    pressCarousel: 9000
};

// +++ ANIMATIONS +++

// HEADER
const heroTitles = document.getElementById('hero-background');
const title = document.getElementById('hero-title');

function startHeader() {
    setTimeout(() => {
        heroTitles.style.transform = 'translateX(0)';
    }, ANIM_DELAYS.background)
    setTimeout(() => {
        title.style.transform = 'translateX(0)';
    }, ANIM_DELAYS.title);
    setTimeout(startSubheaders, ANIM_DELAYS.subheaders.start);
}

// subheaders
function startSubheaders() {
    subheadersContainer.style.opacity = '1';

    subheaders.forEach((element, i) => {
        let direction, fromValue;

        if (i % 2 !== 0) {
            direction = 'up';
            fromValue = -100;
        } else {
            direction = 'down';
            fromValue = 100;
        }

        const subheaderOptions = { ...animOptions.homeSubheaders };
        subheaderOptions.animType = `translate ${direction}`;
        subheaderOptions.from = fromValue;

        setTimeout(() => {
            animateText(element, 'para', subheaderOptions);
        }, (i + 1) * ANIM_DELAYS.subheaders.anim);
    })
}

// PRESS CAROUSEL
const pressCarousel = document.getElementById('press-carousel');

// ON LOAD
window.onload = () => {
    startHeader();
    startPressCarousel(pressCarousel, ANIM_DELAYS.pressCarousel);
};

// NEWS
const newsList = document.getElementById('news-list');
let articlesData = [];

async function initNews() {
    articlesData = await fetchArticlesData();
    displayNewsList(articlesData, newsList);

    newsList.addEventListener('click', (event) => {
        const article = event.target.closest('.article');
        const articleIndex = article.id.split('-')[1];

        Array.from(newsList.children).forEach(news => {
            news.classList.remove('active');
            news.classList.add('inactive');
        });

        article.classList.remove('inactive');
        article.classList.add('active');

        displaySelectedNews(articleIndex, articlesData);
    })
}

initNews();



