import { parseDDMMYYYY } from "./news.js";
import { getSelectedLanguage } from "./translation.js";
import { fetchSheetsData } from "./home.js";

export const concertsSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=722645748&single=true&output=csv';
let concertsMenu, concertsListSelector, upcomingConcertsList, pastConcertsList, upcomingConcertsData = [], pastConcertsData = [];
let sheetDataName;

export default async function initConcerts(barbaContainer) {
    sheetDataName = barbaContainer.dataset.namespace;
    concertsMenu = barbaContainer.querySelector('#concerts-menu');
    concertsListSelector = barbaContainer.querySelector('#concerts-list-option-selector');
    upcomingConcertsList = barbaContainer.querySelector('#upcoming-concerts-list');
    pastConcertsList = barbaContainer.querySelector('#past-concerts-list');

    upcomingConcertsList.innerHTML = '';
    pastConcertsList.innerHTML = '';
    upcomingConcertsData = [];
    pastConcertsData = [];

    const concertsData = await getConcertsData();
    await populateConcertsLists(concertsData);

    if (concertsData.length > 0) {
        displayEmptyConcertsListMessage();
        displaySelectedConcertsLists();
    }
}

async function getConcertsData() {
    const cacheKeys = {
        cachedData: `cache_${sheetDataName}`,
        cachedTime: `cache_time_${sheetDataName}}`
    };
    const data = await fetchSheetsData(concertsSheetURL, cacheKeys);
    if (!data || data.length === 0) {
        displayNoConcertsMessage();
        return [];
    }

    return data;
}

export function displayNoConcertsMessage() {
    const language = getSelectedLanguage();
    const message = translateNoConcertsMessageIn(language);
    appendNoConcertsMessage(message);
}

function translateNoConcertsMessageIn(language) {
    if (language === 'en') return 'No concerts scheduled... Book me!';
    else if (language === 'es') return 'No hay conciertos programados... Contrátame!';
}

function appendNoConcertsMessage(message) {
    const messageContainer = document.getElementById('no-concerts-message');
    messageContainer.textContent = message;
    messageContainer.style.display = 'block';
}

async function populateConcertsLists(data) {
    if (!data) return;

    for (let i = 0; i < data.length; i++) {
        if (isConcertUpcoming(data[i])) upcomingConcertsData.push(data[i]);
        else pastConcertsData.push(data[i]);
    }

    upcomingConcertsData = getChronologicallySortedData(upcomingConcertsData);
    pastConcertsData = getChronologicallyReversedSortedData(pastConcertsData);

    for (let i = 0; i < upcomingConcertsData.length; i++) {
        await appendUpcomingConcert(upcomingConcertsData, i);
    }

    for (let i = 0; i < pastConcertsData.length; i++) {
        await appendPastConcert(pastConcertsData, i);
    }
}

function getChronologicallySortedData(data) {
    return [...data].sort((a, b) => parseDDMMYYYY(a.date) - parseDDMMYYYY(b.date));
}

function getChronologicallyReversedSortedData(data) {
    return [...data].sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date));
}

function isConcertUpcoming(concert) {
    const concertDateTime = parseLocalDateTime(
        concert.date,
        concert.time ?? "23:59"
    );

    return concertDateTime.getTime() > Date.now();
}

function parseLocalDateTime(date, time = "23:59") {
    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

async function appendUpcomingConcert(data, index) {
    const { band, city, country, date, image, lineup, ticket, venue, venueurl } = data[index];
    const concertDate = getFormatedConcertDate(date);
    const concertLineUp = getFormatedConcertLineup(lineup);

    const concertTemplate = `
        <div class="concert-date">${concertDate}</div>
        <img class="concert-image" src="${image}"> 
        <div class="concert-text">
            <div class="concert-text-header">
                <p class="concert-band">${band}</p>
                <p class="concert-venue">@ <a href="${venueurl}">${venue}</a></p>
            </div>
            <p class="concert-location">${city} &mdash; ${country}</p>
            <div class="concert-lineup">${concertLineUp}</div>
        </div>
        <a class="concert-ticket" href="${ticket}"></a>
    `;

    const concert = document.createElement('div');
    concert.classList.add('concert');
    concert.id = `concert-${index}`;
    concert.innerHTML = concertTemplate;

    upcomingConcertsList.appendChild(concert);
}

async function appendPastConcert(data, index) {
    const { band, city, country, date, image, lineup, venue, venueurl } = data[index];
    const concertDate = getFormatedConcertDate(date);
    const concertLineUp = getFormatedConcertLineup(lineup);

    const concertTemplate = `
        <div class="concert-date">${concertDate}</div>
        <img class="concert-image" src="${image}"> 
        <div class="concert-text">
            <div class="concert-text-header">
                <p class="concert-band">${band}</p>
                <p class="concert-venue">@ <a href="${venueurl}">${venue}</a></p>
            </div>
            <p class="concert-location">${city} &mdash; ${country}</p>
            <div class="concert-lineup">${concertLineUp}</div>
        </div>
    `;

    const concert = document.createElement('div');
    concert.classList.add('concert');
    concert.id = `concert-${index}`;
    concert.innerHTML = concertTemplate;

    pastConcertsList.appendChild(concert);
}

function getFormatedConcertDate(date) {
    let concertDate = {};
    const splitDate = date.split('-');
    concertDate.day = splitDate[0].trim();
    concertDate.month = getMonthName(splitDate[1].trim());
    concertDate.year = splitDate[2].trim();

    return getConcertDateHTML(concertDate);
}

export function getMonthName(monthNumber) {
    const language = getSelectedLanguage();
    const months = getMonthsTranslation(language);
    return months[parseInt(monthNumber) - 1];
}

function getMonthsTranslation(language) {
    if (language === 'en')
        return ['jan.', 'feb.', 'mar.', 'apr.', 'may', 'jun.', 'jul.', 'aug.', 'sep.', 'oct.', 'nov.', 'dec.'];
    else if (language === 'es')
        return ['ene.', 'feb.', 'mar.', 'abr.', 'may', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
}

function getConcertDateHTML(concertDate) {
    const { day, month, year } = concertDate;
    return `
        <p class="concert-month">${month}</p>
        <p class="concert-day">${parseInt(day)}</p>
        <p class="concert-year">${year}</p>
    `;
}

function getFormatedConcertLineup(lineup) {
    if (!lineup) return '';

    const splitLineup = lineup.split('|');
    let lineupHTML = '<p>feat.</p>';
    for (const feature of splitLineup) {
        lineupHTML += `<p class="concert-musician">${feature.trim()}</p>`;
    }
    return lineupHTML;
}

export function getTicketTranslation() {
    const language = getSelectedLanguage();
    if (language === 'en') return 'tickets';
    else if (language === 'es') return 'entradas';
}

export function translateMonthName(monthName) {
    const to = getSelectedLanguage();
    const from = to === 'en' ? 'es' : 'en';
    let nameIndex = getMonthsTranslation(from).indexOf(monthName);

    if (nameIndex === -1) nameIndex = getMonthsTranslation(to).indexOf(monthName);

    const months = getMonthsTranslation(to);
    return months[nameIndex];
}

function displayEmptyConcertsListMessage() {
    [upcomingConcertsList, pastConcertsList].forEach(list => {
        if (!list.hasChildNodes()) list.innerHTML = getEmptyConcertsListMessage(list);
    })
    return;
}

function getEmptyConcertsListMessage(list) {
    return `<p class="concerts-list-empty-message">${getTranslationEmptyConcertsListMessage(list)}</p>`
}

export function getTranslationEmptyConcertsListMessage(list) {
    const language = getSelectedLanguage();
    const listName = list.id.split('-')[0];
    const messages = {
        upcoming: {
            en: 'No concerts scheduled... Book me!',
            es: 'No hay conciertos programados... Contrátame!'
        },
        past: {
            en: 'No previous concerts...',
            es: 'No hay conciertos pasados...'
        }
    }
    return messages[listName][language];
}

function displaySelectedConcertsLists() {
    initConcertsListSelector();
    attachConcertsMenuListeners();
}

function initConcertsListSelector() {
    const upcomingOption = Array.from(concertsMenu.children).find(child => child.id.includes('upcoming')).getBoundingClientRect();
    gsap.set(concertsListSelector, { left: `${upcomingOption.left}`, opacity: 1 });
}

function attachConcertsMenuListeners() {
    concertsMenu.addEventListener('click', handleConcertsListSelection);
}

function handleConcertsListSelection(event) {
    const listOptions = Array.from(event.currentTarget.querySelectorAll('.concerts-list-option'));
    const selectedOption = listOptions.find(option => option === event.target) || '';
    if (!selectedOption) return;

    updateConcertsListsClassNames(selectedOption, listOptions);
    animateConcertsListSelector(selectedOption);
    animateConcertsList(selectedOption);
}

function updateConcertsListsClassNames(selectedOption, listOptions) {
    listOptions.forEach(option => {
        const list = option.id.includes('upcoming') ? upcomingConcertsList : pastConcertsList;
        if (option === selectedOption) {
            list.classList.add('selected-concerts-list');
            option.classList.add('selected-concerts-list-option');
        } else {
            list.classList.remove('selected-concerts-list');
            option.classList.remove('selected-concerts-list-option');
        }
    })
}

function animateConcertsListSelector(selectedOption) {
    const selectorRects = concertsListSelector.getBoundingClientRect();
    const selectedOptionRects = selectedOption.getBoundingClientRect();
    const screenCenter = window.innerWidth / 2;
    const operator = getOperator(selectedOptionRects);
    console.log(operator)
    if (((selectorRects.x + (selectorRects.width / 2)) > screenCenter && operator === '+')
        ||
        ((selectorRects.x + (selectorRects.width / 2)) < screenCenter && operator === '-')){
            console.log('fuck')
            return;
        }
        
        console.log('after fuck')
    const tl = gsap.timeline();

    if (operator === '+') {
        tl
            .to(concertsListSelector, {
                width: '100%',
                right: selectedOptionRects.right,
                duration: 0.3,
                ease: 'power2.in'
            })
            .to(concertsListSelector, {
                left: selectedOptionRects.left,
                width: '50%',
                duration: 0.3,
                ease: "elastic.out(1,0.9)",
            })
    } else {
        tl
            .to(concertsListSelector, {
                width: '100%',
                left: selectedOptionRects.left,
                duration: 0.3,
                ease: 'power2.in'
            })
            .to(concertsListSelector, {
                width: '50%',
                duration: 0.3,
                ease: "elastic.out(1,0.9)",
            })
    }
}

function getOperator(rects) {
    const screenCenter = window.innerWidth / 2;console.log(screenCenter, rects.left)
    if (rects.left >= screenCenter) return '+';
    else return '-';
}

function getDistance(selectorRects, selectedOptionRects) {
    const screenCenter = Math.floor(window.innerWidth / 2);
    if (Math.floor(selectorRects.x + (selectorRects.width / 2)) !== screenCenter) return selectedOptionRects.width * 2;
    else return selectedOptionRects.width;
}

function animateConcertsList(selectedOption) {
    const selectedList = selectedOption.id.includes('upcoming') ? upcomingConcertsList : pastConcertsList;
    const concerts = selectedList.querySelectorAll('.concert');

    gsap.from(selectedList, { opacity: 0, duration: 0.7, ease: 'power2.out' });

    concerts.forEach(concert => {
        gsap.timeline({
            scrollTrigger: {
                trigger: concert,
                start: 'top bottom',
                once: true
            }
        }).from(concert, { opacity: 0, yPercent: 50, duration: 0.4, ease: 'power2.out' })
    })
}