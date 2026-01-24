import { getSelectedLanguage } from "./translation.js";
import { fetchSheetsData, TIMER } from "./home.js";

let sheetDataName;

export const newsSheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=0&single=true&output=csv';
let newsList;

export default async function initNews(barbaContainer) {
    sheetDataName = barbaContainer.dataset.namespace;
    newsList = barbaContainer.querySelector('#news-list');

    newsList.innerHTML = '';

    const newsData = await getNewsData();
    await populateNewsList(getReverseChronologicallySortedData(newsData));
}

async function getNewsData() {
    const cacheKeys = {
        cachedData: `cache_${sheetDataName}`,
        cachedTime: `cache_time_${sheetDataName}`
    };
    const data = await fetchSheetsData(newsSheetsURL, cacheKeys);
    if (!data || data.length === 0) {
        displayNoNewsMessage();
        return [];
    }
    return await addGoogleDocsData(data);
}

function getReverseChronologicallySortedData(data) {
    return [...data].sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date));
}

export function parseDDMMYYYY(dateStr) {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

export async function addGoogleDocsData(data) {
    try {
        return await Promise.all(data.map(async d => ({
            ...d,
            content: await fetchDocsData(d.googledocs).catch(() => '')
        })))
    } catch (error) {
        console.log('Error adding google docs data', error);
        return [];
    }
}

async function fetchDocsData(url) {
    const id = btoa(url);
    const cachedData = `cache_doc_${id}`;
    const cachedTime = `cache_doc_time_${id}`;

    const cached = sessionStorage.getItem(cachedData);
    const timestamp = Number(sessionStorage.getItem(cachedTime));

    const isFresh = cached && timestamp && (Date.now() - timestamp) < TIMER;

    if (isFresh) {
        const node = document.createElement('div');
        node.innerHTML = cached;
        return node;
    }

    try {
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const content = doc.querySelector('#contents');

        doc.querySelectorAll('meta').forEach(tag => tag.remove());

        if (!content) {
            console.error('No #contents found in Google Doc!');
            return '';
        }

        sessionStorage.setItem(cachedData, content.innerHTML);
        sessionStorage.setItem(cachedTime, Date.now().toString());

        return content;
    } catch (error) {
        console.log('Error fetching docs data', error);
        return;
    }
}

export function displayNoNewsMessage() {
    const language = getSelectedLanguage();
    const message = translateNoNewsMessageIn(language);
    appendNoNewsMessage(message);
}

function translateNoNewsMessageIn(language) {
    if (language === 'en') return 'No news yet...';
    else if (language === 'es') return 'Aún no hay noticias...';
}

function appendNoNewsMessage(message) {
    const messageContainer = document.getElementById('no-news-message');
    messageContainer.textContent = message;
}

async function populateNewsList(data) {
    if (!data) return;

    for (let i = 0; i < data.length; i++) {
        await appendNews(data, i);
    }
}

async function appendNews(data, index) {
    const { image, date, title, content } = data[index];
    const iconCalendar = await fetchCalendarSVG();
    const newsContent = await handleNewsContentDisplay(content, index);

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
    news.id = `news-${index}`;
    news.innerHTML = newsTemplate;

    newsList.appendChild(news);
}


export function getTimeAgo(date) {
    const timeAgoMs = Date.now() - new Date(formatDate(date, 'us')).getTime();
    const language = getSelectedLanguage();

    if (!date || timeAgoMs < 0) {
        if (language === 'en') return 'today';
        else if (language === 'es') return 'hoy';
    }

    const timeAgo = {};
    timeAgo.days = Math.floor(timeAgoMs / 1000 / 60 / 60 / 24);
    timeAgo.months = Math.floor(timeAgo.days / 30.416);
    timeAgo.years = Math.floor(timeAgo.months / 12);

    return translateTimeAgo(timeAgo, language);
}

function translateTimeAgo(timeAgo, language) {
    if (language === 'en') return timeAgoInEnglish(timeAgo);
    else if (language === 'es') return timeAgoInSpanish(timeAgo);
}

function timeAgoInEnglish(timeAgo) {
    const { years, months, days } = timeAgo;

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) {
        return days === 1 ? 'yesterday' : `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return 'today';
}

function timeAgoInSpanish(timeAgo) {
    const { years, months, days } = timeAgo;

    if (years > 0) return `hace ${years} año${years > 1 ? 's' : ''}`;
    if (months > 0) return `hace ${months} mes${months > 1 ? 'es' : ''}`;
    if (days > 0) {
        return days === 1 ? 'ayer' : `hace ${days} día${days > 1 ? 's' : ''}`;
    }

    return 'hoy';
}

export function formatDate(date, format) {
    if (format === 'us') {
        return date.split('-')[0].length < 4 ? date.split('-').reverse().join('-') : date;
    }
    else if (format === 'eu') {
        return date.split('-')[0].length === 4 ? date.split('-').reverse().join('.') : date.split('-').join('.');
    }
}

export async function fetchCalendarSVG() {
    const svg = await fetch('./icons/calendar.svg');
    return svg.text();
}

export async function handleNewsContentDisplay(content, index) {
    if (content === '') return content;

    formatContent(content, index);
    return getContentHTML(content);
}

function formatContent(content, index) {
    resetContentClassName(content);
    formatContentLinks(content);
    formatDocsCSS(content, index);
}

function resetContentClassName(content) {
    const docContent = content.querySelector('.doc-content') || null;
    if (!docContent) return;

    docContent.className = '';
    docContent.classList.add('doc-content');
}

function formatContentLinks(content) {
    const links = content.querySelectorAll('a') || null;
    if (!links) return;

    for (const link of links) {
        link.parentNode.style.textDecoration = 'none';

        const linkColor = getComputedStyle(document.documentElement).getPropertyValue('--color-dark-orange');
        link.style.color = linkColor;
    }
}

function formatDocsCSS(content, index) {
    const docsStyleTag = content.querySelector('style');
    const docsCSS = docsStyleTag.innerHTML;
    const namespacedCSS = namespaceDocsCSS(docsCSS, index);

    docsStyleTag.innerHTML = namespacedCSS;
}

function namespaceDocsCSS(css, index) {
    const prefix = `#news-${index} .doc-content`;

    return css.replace(/(^|})(\s*[^@{][^{]*){/g, (match, brace, selector) => {
        return `${brace} ${prefix} ${selector.trim()}{`;
    });
}

function getContentHTML(content) {
    return content.innerHTML;
}

export function initNewsAnimations(container) {
    clearNewsAnimations();
    document.fonts.ready.then(() => {
        initNewsAnim(container);
    });
}

export function clearNewsAnimations() {
    ScrollTrigger.getAll().forEach(st => st.kill());
}

function initNewsAnim(container) {
    const news = container.querySelectorAll('.news') || null;
    if (news === null) return;

    news.forEach(news => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: news,
                start: "top 80%",
                once: true
            }
        })

        gsap.set(news, { opacity: 1 })

        tl.from(news, { opacity: 0, yPercent: 10, duration: 1, ease: 'power2.out' })
    })
}