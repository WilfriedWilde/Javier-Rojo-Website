import { newsSheetsURL, addGoogleDocsData } from './news.js';
import { mediaSheetURL } from './media.js';
import { concertsSheetURL } from './concerts.js';

export const TIMER = 5 * 60 * 1000;
const sheetDataNames = ['news', 'media', 'concerts'];
const sheetUrls = { news: newsSheetsURL, media: mediaSheetURL, concerts: concertsSheetURL };

export default async function initHome(barbaContainer) {
    fetchAllData();
    initHomeAnimations(barbaContainer);
}

async function fetchAllData() {
    for (const name of sheetDataNames) {
        const cacheKeys = {
            cachedData: `cache_${name}`,
            cachedTime: `cache_time_${name}`
        };
        const data = await fetchSheetsData(sheetUrls[name], cacheKeys);

        if (name === 'news') {
            await addGoogleDocsData(data);
        }
    }
}

export async function fetchSheetsData(url, cacheKeys) {
    const { cachedData, cachedTime } = cacheKeys;
    const cached = sessionStorage.getItem(cachedData);
    const timestamp = Number(sessionStorage.getItem(cachedTime));

    const isFresh = cached && timestamp && (Date.now() - timestamp) < TIMER;

    if (isFresh) {
        return JSON.parse(cached);
    }

    try {
        const response = await fetch(url);
        const text = await response.text();
        const rows = text.split(/\r?\n/).map(row => row.split(","));
        const headers = rows[0];

        const data = rows.slice(1).map(row => {
            return Object.fromEntries(
                headers.map((header, i) => {
                    const cell = row[i];
                    return [header.toLowerCase().split(' ')[0], cell];
                }))
        });

        sessionStorage.setItem(cachedData, JSON.stringify(data));
        sessionStorage.setItem(cachedTime, Date.now().toString());

        return data;
    } catch (error) {
        console.log('Error fetching sheets data', error);
        return [];
    }
}

let homeClickHandler = null;

function initHomeAnimations(container) {
    const homeTitleContainer = container.querySelectorAll('#home-title-container');
    const homeOverlay = container.querySelector('#home-image-overlay');
    const homeImages = container.querySelectorAll('.home-image');
    const navbar = document.getElementById('navbar');

    if (!homeOverlay || homeImages.length === 0) return;

    let isHomeDisplayed = false;
    const homeTimeline = gsap.timeline({ paused: true });
    homeTimeline
        .to(homeTitleContainer, { zIndex: -1, stagger: { amount: 0.1, from: 'start' }, overwrite: true })
        .to(homeImages, { transform: "translate(-50%, -48%) scale(1.05)", duration: 0.5, overwrite: true }, 0.5)
        .to(navbar, { opacity: 1, stagger: { amount: 0.2 } }, 0.5)

    homeClickHandler = (event) => {
        if (event.target.closest('li')) return;

        if (!isHomeDisplayed) {
            homeTimeline.play()
        } else {
            homeTimeline.reverse();
        }
        isHomeDisplayed = !isHomeDisplayed;
    };

    window.addEventListener("click", homeClickHandler);
}


export function clearHomeAnimations() {
    if (homeClickHandler) {
        window.removeEventListener("click", homeClickHandler);
        homeClickHandler = null;
    }

    ScrollTrigger.getAll().forEach(st => st.kill());

    const overlay = document.getElementById('home-image-overlay');
    const images = document.querySelectorAll('.home-image');

    gsap.set([overlay, ...images], {
        opacity: 0,
        clearProps: "all",
        pointerEvents: "none"
    });
}

export function introHomeAnimation() {
    const homeTitles = document.querySelectorAll('.home-title');
    const clickSVG = document.querySelector('.click');
    const path = document.querySelector('.click path');
    const clickText = document.getElementById('click-text');

    const split = SplitText.create(clickText, { type: 'words', mask: 'words' });

    gsap.set(path, { drawSVG: 0 });
    gsap.set(clickText, { opacity: 1 });

    const introTimeline = gsap.timeline();
    introTimeline
        .to('#home-image-overlay', { backdropFilter: "blur(5px) brightness(0.1)", duration: 1 }, 1)
        .to(homeTitles, { opacity: 1, stagger: 1, duration: 2 }, '>')
        .to(clickSVG, { opacity: 1, duration: 0 })
        .to(path, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' })
        .fromTo(
            split.words,
            { opacity: 0, xPercent: -20 },
            {
            opacity: 1,
            xPercent: 0,
            duration: 1,
            stagger: {
                each: 0.5,
                ease: 'power1.in'
            }
        }
        )

    return introTimeline;
}