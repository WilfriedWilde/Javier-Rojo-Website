import { fetchSheetsData, formatDate } from "./news.js";
import { getSelectedLanguage } from "./translation.js";

const concertsSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=722645748&single=true&output=csv';
let concertsMenu, upcomingConcertsList, pastConcertsList;

export default async function initConcerts(barbaContainer) {
    upcomingConcertsList = barbaContainer.querySelector('#upcoming-concerts-list');
    pastConcertsList = barbaContainer.querySelector('#past-concerts-list');
    concertsMenu = barbaContainer.querySelector('#concerts-menu');
    const concertsData = await getConcertsData(); console.log('data:', concertsData)
    await populateConcertsLists(concertsData);

    if (concertsData.length > 0) {
        displayEmptyConcertsListMessage();
        displaySelectedConcertsLists();
    }
}

async function getConcertsData() {
    const data = await fetchSheetsData(concertsSheetURL);
    if (!data || data.length === 0) {
        displayNoConcertsMessage();
        return;
    }

    return getChronologicallySortedData(data);
}

function getChronologicallySortedData(data) {
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
}

async function populateConcertsLists(data) {
    if (!data) return;

    for (let i = 0; i < data.length; i++) {
        if (isConcertUpcoming(data, i)) await appendUpcomingConcert(data, i);
        else await appendPastConcert(data, i);
    }
}

function isConcertUpcoming(data, index) {
    const concertDate = new Date(formatDate(data[index].date, 'us')).getTime();
    const now = Date.now();
    return concertDate > now;
};

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
    const splitDate = date.split('/');
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
    const language = getSelectedLanguage();
    const months = getMonthsTranslation(language);
    return months[months.indexOf(monthName)];
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
    attachConcertsMenuListeners();
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
}

function updateConcertsListsClassNames(selectedOption, listOptions) {
    listOptions.forEach(option => {
        const list = option.id.includes('upcoming') ? upcomingConcertsList : pastConcertsList;
        if (option === selectedOption) {
            list.classList.add('selected-concerts-list');
            option.classList.add('selected-concerts-list-option');
        } else {console.log(list)
            list.classList.remove('selected-concerts-list');
            option.classList.remove('selected-concerts-list-option');
        }
    })
}

function animateConcertsListSelector(selectedOption) {
    const concertsListSelector = document.getElementById('concerts-list-option-selector');
    const selectedOptionRects = selectedOption.getBoundingClientRect();

    gsap.to(concertsListSelector, {
        left: selectedOptionRects.left,
        duration: 0.3
    })
}