import { newsSheetsURL, addGoogleDocsData, fetchCalendarSVG, handleNewsContentDisplay, formatDate, getTimeAgo } from './news.js';
import { mediaSheetURL } from './media.js';
import { concertsSheetURL } from './concerts.js';

export const TIMER = 5 * 60 * 1000;
const sheetDataNames = ['news', 'media', 'concerts'];
const sheetUrls = { news: newsSheetsURL, media: mediaSheetURL, concerts: concertsSheetURL };
let newsData = [];
let newsContainer = '';

export default async function initHome(barbaContainer) {
    newsContainer = barbaContainer.querySelector('#last-news-container');

    await fetchAllData();
    initHomeAnimations(barbaContainer);
    appendLastNews();
}

async function fetchAllData() {
    for (const name of sheetDataNames) {
        const cacheKeys = {
            cachedData: `cache_${name}`,
            cachedTime: `cache_time_${name}`
        };
        const data = await fetchSheetsData(sheetUrls[name], cacheKeys);

        if (name === 'news') {
            const fullData = await addGoogleDocsData(data);
            newsData = fullData;
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
let isIntroCompleted = false;

function initHomeAnimations(container) {
    const homeTitleContainer = container.querySelectorAll('#home-title-container');
    const foreground = container.querySelectorAll('#home-image-foreground');
    const navbar = document.getElementById('navbar');
    const lastNews = container.querySelector('#last-news-container');

    let isHomeDisplayed = false;
    const homeTimeline = gsap.timeline({ paused: true });
    homeTimeline
        .to(homeTitleContainer, { opacity: 0, duration: 1 })
        .to(homeTitleContainer, { zIndex: -1, opacity: 0, duration: 0 })
        .to(foreground, { opacity: 0, duration: 1 }, 0.5)
        .to(navbar, { opacity: 1, stagger: { amount: 0.2 } }, 1)
        .to(homeTitleContainer, { yPercent: -100, duration: 0 })
        .to(lastNews, { zIndex: 3, duration: 0})
        .fromTo(lastNews,
            { opacity: 0, yPercent: 30 },
            { opacity: 1, yPercent: 0, duration: 0.8, ease: 'power2.in' }
        )

    homeClickHandler = (event) => {
        if (event.target.closest('li') || !isIntroCompleted) return;

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

    const split = SplitText.create(clickText, { type: 'words, chars', mask: 'chars' });

    gsap.set(path, { drawSVG: 0 });
    gsap.set(clickText, { opacity: 1 });

    const introTimeline = gsap.timeline();
    introTimeline
        .to('#home-image-overlay', { backdropFilter: "blur(5px) brightness(0.1)", duration: 1 }, 1)
        .to(homeTitles, { opacity: 1, stagger: 1, duration: 2 }, '>')
        .to(clickSVG, { opacity: 1, duration: 0 }, 0)
        .to(path, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, 3.8)
        .fromTo(
            split.chars,
            { opacity: 0, xPercent: -50 },
            {
                opacity: 1,
                xPercent: 0,
                duration: 1.2,
                stagger: {
                    each: 0.08,
                    ease: 'power1.in'
                }
            }, '-=1')
        .add(moveArrow(clickSVG, split), '-=1')
        .add(() => isIntroCompleted = true, '-=1')

    return introTimeline;
}

export function moveArrow(arrow, split) {
    const lastWord = split.words.at(-1);
    const lastWordSplit = new SplitText(lastWord, { type: 'chars' });
    const cleanChars = lastWordSplit.chars.filter(
        char => char.textContent !== '.'
    );

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(arrow, {
        xPercent: 5,
        duration: 1,
        ease: 'power2.out'
    }).to(cleanChars, {
        color: 'var(--color-light-orange)',
        duration: 1,
        ease: 'power2.out'
    }, 0)

    return tl;
}

async function appendLastNews() {
    const { image, date, title, content } = newsData[0];
    const iconCalendar = await fetchCalendarSVG();
    const newsContent = await handleNewsContentDisplay(content, 0);

    const newsTemplate = `
        <div class="news-header">
            <div class="news-date-container">
                <div class="icon-calendar-container">${iconCalendar}</div>
                <div class="news-date">${formatDate(date, 'eu')}</div>
            </div>
            <img class="news-header-image" src="${image}">
            <div class="news-header-text">
                <p class="news-title">${title}</p>
                <p class="news-time-ago">${getTimeAgo(date)}</p>
            </div>
        </div>
        <div class="news-content">${newsContent}</div>   
    `;

    const news = document.createElement('li');
    news.classList.add('news');
    news.id = `lastNews`;
    news.innerHTML = newsTemplate;

    newsContainer.appendChild(news);
}