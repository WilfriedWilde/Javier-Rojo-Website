import { getReviewText, getReviewTranslatedType } from "./press.js";
import { displayNoNewsMessage, getTimeAgo } from "./news.js";
import { displayNoConcertsMessage, translateMonthName, getTicketTranslation, getTranslationEmptyConcertsListMessage } from "./concerts.js";
import { displayBiographyTexts } from "./biography.js";
import { displayMediaTexts } from "./media.js";
import { displayContactTexts, initContactAnimations } from "./contact.js";

// Object storing all the translations. It follows the structure 'language' => 'page' => 'section'.
const translations = {
    es: {
        all: {
            navbar: ['novedades', 'biografía', 'medios', 'conciertos', 'contacto'],
            footer: ['Diseño web por', 'Fotografía por', 'Política de privacidad', 'Todos los derechos reservados']
        },
        home: {

        },
        news: {
            title: ['novedades']
        },
        biography: {
            title: ['biografía']
        },
        media: {
            title: ['medios']
        },
        concerts: {
            title: ['conciertos'],
            menu: ['próximos', 'pasados']
        },
        contact: {
            title: ['contacto']
        }
    },
    en: {
        all: {
            navbar: ['news', 'biography', 'media', 'concerts', 'contact'],
            footer: ['Webdesign by', 'Photography by', 'Privacy policy', 'All rights reserved.']
        },
        home: {

        },
        news: {
            title: ['news']
        },
        biography: {
            title: ['biography']
        },
        media: {
            title: ['media']
        },
        concerts: {
            title: ['concerts'],
            menu: ['upcoming', 'past']
        },
        contact: {
            title: ['contact']
        }
    }
}

// Language selection
export function handleLanguageSelection(language) {
    const languageOptions = Array.from(document.querySelectorAll('[data-language]'));

    storeSelectedLanguage(language);
    hightlightSelectedLanguage(languageOptions, language);
}

function storeSelectedLanguage(language) {
    localStorage.setItem('language', language);
}

function hightlightSelectedLanguage(elementsArr, selectedLanguage) {
    for (const element of elementsArr) {
        if (element.dataset.language !== selectedLanguage) {
            element.classList.remove('selected-language');
        }
        else {
            element.classList.add('selected-language');
        }
    }
}

// Translation
export function translateTextsInPage(textContainers, page) {
    const language = getSelectedLanguage();
    let current = { section: null, index: 0 };

    textContainers.forEach((container) => {
        const section = container.dataset.translation;

        if (section !== current.section) {
            current.section = section;
            current.index = 0;
        }

        const keys = [language, page, section];
        const result = getTranslation(translations, keys);
        if (!result) return;

        const translation = result[current.index];
        replaceOriginalWithTranslation(container, translation);
        current.index++;
    });

    if (page === 'news') {
        handleTimeAgoTranslation();

        const noNewsMessage = document.getElementById('no-news-message');
        if (noNewsMessage.innerText) displayNoNewsMessage();
    } else if (page === 'biography') {
        const biographyTexts = Array.from(document.querySelectorAll('[data-biography]'));
        if (biographyTexts.some(text => text.innerText !== '')) {
            displayBiographyTexts(biographyTexts);
            ScrollTrigger.refresh();
        }

        const reviewContainers = Array.from(document.querySelectorAll('.review-container'));
        if (reviewContainers.length !== 0) {
            reviewContainers.forEach(container => container.innerText = getReviewText(container.dataset.reviewId));
        } else return;

        const reviewItems = Array.from(document.querySelectorAll('.review-item'));
        if (reviewItems.length !== 0) {
            reviewItems.forEach(item => {
                const itemId = item.dataset.id;
                const type = item.querySelector('.review-type');
                type.innerText = getReviewTranslatedType(itemId);
            })
        }
    } else if (page === 'media') {
        const mediaTexts = Array.from(document.querySelectorAll('[data-media]'));
        if (mediaTexts.some(text => text.innerText !== '')) {
            displayMediaTexts(mediaTexts);
        }
    } else if (page === 'concerts') {
        const noConcertsMessage = document.getElementById('no-concerts-message');
        if (noConcertsMessage.innerText) displayNoConcertsMessage();

        const tickets = Array.from(document.querySelectorAll('.concert-ticket'));
        tickets.forEach(ticket => ticket.innerText = getTicketTranslation());

        const concertMonths = Array.from(document.querySelectorAll('.concert-month'));
        if (concertMonths.length !== 0) concertMonths.forEach(month => month.innerText = translateMonthName(month.innerText.toLowerCase()));

        const concertsListsEmptyMessage = document.querySelector('.concerts-list-empty-message') || '';
        if (concertsListsEmptyMessage) concertsListsEmptyMessage.innerText = getTranslationEmptyConcertsListMessage(concertsListsEmptyMessage.parentNode);
    } else if (page === 'contact') {
        const contactTexts = Array.from(document.querySelectorAll('[data-contact]'));
        if (contactTexts.some(text => text.innerText !== '')) {
            displayContactTexts(contactTexts);
            initContactAnimations(document.querySelector('.main'));
        }
    }
}

function handleTimeAgoTranslation() {
    Array.from(document.querySelectorAll('.news')).forEach(news => {
        const newsTimeAgo = news.querySelector('.news-time-ago');
        const newsDate = news.querySelector('.news-date').innerText.split('.').join('-');

        newsTimeAgo.textContent = getTimeAgo(newsDate);
    })
}

export function getSelectedLanguage() {
    const selectedLanguage = localStorage.getItem('language');
    return selectedLanguage ? selectedLanguage : 'en';
}

export function getTranslation(object, keys) {
    return keys.reduce((acc, key) => acc?.[key], object);
}

function replaceOriginalWithTranslation(container, translation) {
    container.textContent = translation;
}


