import { newsSheetsURL, addGoogleDocsData } from './news.js';
import { mediasSheetURL } from './medias.js';
import { concertsSheetURL } from './concerts.js';

export const TIMER = 5 * 60 * 1000;

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
    const homeTitle = container.querySelector('#home-title-container');
    const homeOverlay = container.querySelector('#home-image-overlay');
    const homeImages = container.querySelectorAll('.home-image');
    const navbar = container.querySelector('#navbar');

    if (!homeOverlay || homeImages.length === 0) return;

    let isHomeDisplayed = false;
    const homeTimeline = gsap.timeline({ paused: true });
    homeTimeline
        .to(homeTitle.children, { yPercent: -600, zIndex: -1, stagger: { amount: 0.1, from: 'start' }, ease: 'back.in(1.3)' })
        .to(homeOverlay, { backdropFilter: "blur(5px) brightness(0.1)", duration: 0.4, overwrite: true }, 0.5)
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
    const titleJavier = document.getElementById("title-javier");
    const titleRojo = document.getElementById("title-rojo");

    const introTimeline = gsap.timeline();
    introTimeline
        .to(titleRojo, { rotate: 0, duration: 0, transformOrigin: '0% 100%' })
        .to(titleJavier, { yPercent: 600, duration: 1, ease: 'elastic.out(1, 0.6)' }, 1)
        .to(titleRojo, { yPercent: 600, duration: 1, ease: 'elastic.out(1, 0.5)' }, '<0.3')
        .to('#home-image-foreground', { opacity: 1, duration: 1 }, '<0.5')
        .to(titleRojo, { rotate: 8, duration: 2, ease: 'elastic.out(1, 0.15)' }, '<1.5')
        .from(titleJavier.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<1')
        .from(titleRojo.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<0.3')
        .to('#home-image-background', { opacity: 1, duration: 2 }, '<1')
}

const sheetDataNames = ['news', 'medias', 'concerts'];
const sheetUrls = { news: newsSheetsURL, medias: mediasSheetURL, concerts: concertsSheetURL };