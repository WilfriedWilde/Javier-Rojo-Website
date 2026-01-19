import { getSelectedLanguage } from "./translation.js";

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, ScrollSmoother, SplitText, TextPlugin)

});

const rawReviews = [
    { source: 'Jazz Magazine (FR)', review: { en: 'Revelation!', es: '¡Revelación!' }, type: { en: 'review', es: 'crítica' }, link: 'https://drive.google.com/file/d/1-A1xVIa7CMxQFaIXzhZU-fxbTJZVKLLk/view' },
    { source: 'Jazz Weekly (US)', review: { en: 'Brings fresh ideas to the post bop genre.', es: 'Aporta ideas frescas al género post-bop.' }, type: { en: 'review', es: 'crítica' }, link: 'https://jazzweekly.com/2025/03/javier-rojo-musica-para-amansar-fieras-fuel/' },
    { source: 'Jazzwise (UK)', review: { en: 'Rojo may be in his mid-twenties but already he is in his element with maturity and purpose.', es: 'Rojo puede estar en la mitad de sus veintitantos, pero ya se mueve con madurez y propósito en su elemento.' }, type: { en: 'review', es: 'crítica' }, link: '' },
    { source: 'NRW Jazz (DE)', review: { en: "A fine, contemporary jazz record… the swing is relaxed, the boppy passages are driving, the ballads are tender and emotional - Rojo's own compositions have a lot to offer.", es: 'Un excelente disco de jazz contemporáneo… el swing es relajado, los pasajes bop son enérgicos, las baladas son tiernas y emotivas; las composiciones propias de Rojo tienen mucho que ofrecer.' }, type: { en: 'review', es: 'crítica' }, link: 'https://nrwjazz.net/rezensionen/neues-aus-der-cd-welt-christoph-gieses-schnelldurchlauf-vol-66' },
    { source: 'Jazzmania (BE)', review: { en: "Jordi Pujol, head of the Fresh Sound New Talent label, knows damn well who to give a chance to. With this Javier Rojo and his sextet, it's clearly a successful move.", es: 'Jordi Pujol, director del sello Fresh Sound New Talent, sabe muy bien a quién darle una oportunidad. Con Javier Rojo y su sexteto, está claro que ha sido una apuesta acertada.' }, type: { en: 'review', es: 'crítica' }, link: 'https://jazzmania.be/javier-rojo-musica-para-amansar-fieras/' },
    { source: 'Jazzflits (NL)', review: { en: 'Energetic, playful, and pleasantly sentimental', es: 'Enérgico, juguetón y agradablemente sentimental.' }, type: { en: 'review', es: 'crítica' }, link: '' },
    { source: 'PJ Portrait in Jazz (JP)', review: { en: 'Straight-ahead energy characteristic of young musicians, making it a refreshing listen.', es: 'Energía directa característica de músicos jóvenes, lo que lo convierte en una escucha refrescante.' }, type: { en: 'review', es: 'crítica' }, link: 'https://pjportraitinjazz.com/playlists/20250128_8832/' },
    { source: 'Esensja (PL)', review: { en: 'Javier Rojo – remember this artist!', es: 'Javier Rojo: ¡recuerda este nombre!' }, type: { en: 'review', es: 'crítica' }, link: 'https://esensja.pl/muzyka/recenzje/tekst.html?id=36044' },
    { source: 'Jazz Views (UK)', review: { en: 'These guys are having real musical conversations.', es: 'Estos músicos mantienen auténticas conversaciones musicales.' }, type: { en: 'review', es: 'crítica' }, link: 'https://jazzviews.net/javier-rojo-musica-para-amansar-fieras/' },
    { source: 'Blue in Green (UK)', review: { en: "The musical embodiment of wearing one's heart on their sleeve.", es: 'La encarnación musical de llevar el corazón en la mano.' }, type: { en: 'review', es: 'crítica' }, link: 'http://www.blueingreenradio.com/2025/01/musica-para-amansar-fieras-by-javier.html' },
    { source: 'Era Jazzu (PL)', review: { en: 'A perfect showcase for the young European jazz scene.', es: 'Una muestra perfecta de la joven escena jazzística europea.' }, type: { en: 'review', es: 'crítica' }, link: 'https://jazz.pl/javier-rojo-musica-para-amansar-fieras-fresh-sound-new-talent/' },
    { source: 'Jazz Rozhlas (CZ)', type: { en: 'recommendation', es: 'recomendación' }, link: 'https://jazz.rozhlas.cz/uloveno-na-siti-dny-se-prodluzuji-jazzu-pribyva-9406376' },
    { source: 'Salt-peanuts (DK)', type: { en: 'review', es: 'crítica' }, link: 'https://salt-peanuts.eu/record/javier-rojo/' },
    { source: 'Goldmine Magazine (US)', type: { en: 'review', es: 'crítica' }, link: 'https://www.goldminemag.com/columns/noel-okimoto-javier-rojo-erik-jekabson-terry-waldo-and-bill-oconnell-know-no-genre/' },
    { source: 'Radio Bemowo (PL)', type: { en: 'airplay', es: 'emisión' }, link: 'https://www.facebook.com/marek.j.smietanski/posts/pfbid02wUXY8xNDSHDwB4iYMd2e4eYLnQbrtiAJMa1zkdyzV7VgrKtdz7RKggX5PZMVcN2hl' },
    { source: '15 Questions (DE)', type: { en: 'interview', es: 'entrevista' }, link: 'https://15questions.net/interview/javier-rojo-about-improvisation/page-1/' },
    { source: 'La Habitacion Del Jazz (ES)', type: { en: 'review', es: 'crítica' }, link: 'https://lahabitaciondeljazz.blogspot.com/2025/01/javier-rojo-cd-musica-para-amansar.html' },
    { source: 'Radio France - Au Coeur du Jazz (FR)', type: { en: 'review', es: 'crítica' }, link: 'https://www.radiofrance.fr/francemusique/podcasts/au-coeur-du-jazz/javier-rojo-le-miroir-de-ses-emotions-9749039' },
    { source: 'Jazzreporter (DE)', type: { en: 'interview', es: 'entrevista' }, link: 'https://www.jazzreporter.com/2025/01/12/javier-rojo-interview/' },
    { source: 'Future Jazz on Jazz FM (UK)', type: { en: 'airplay', es: 'emisión' }, link: 'https://www.mixcloud.com/RuthieNotesandTones/future-jazz-on-jazz-fm-6-january-2025/' },
    { source: 'Radio RDC (PL)', type: { en: 'airplay', es: 'emisión' }, link: 'https://www.facebook.com/alejazz.marek.romanski/posts/pfbid0H7LGwBh66og6g7GGFgBkskJajzkB8SPUB5Vb7Z6v873WYKBpUsU52QmPcSj5rX3zl' }
];

let reviewContainers = [], reviewsList;

function generateReviewID(review, index) {
    const reviewText = review.source.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${reviewText}-${index}`;
}

const reviews = rawReviews.map((review, index) => ({
    id: generateReviewID(review, index),
    ...review
}))

export function appendTextReviews(container) {
    reviewContainers = Array.from(container.querySelectorAll('.text-review-container'));

    const shuffledReviews = shuffle(reviews);
    const textReviews = shuffledReviews.filter(review => 'review' in review).slice(0, 2);

    textReviews.forEach((review, index) => appendTextReview(review, index));
}

export function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function appendTextReview(pressReview, index) {
    const { id, source, link } = pressReview;
    const reviewText = getReviewText(id);
    const template = `
        <p class="review-container" data-review-id=${id}>${reviewText}</p>
        <a class="source-container" href="${link}">&mdash; ${source}</a>
    `;

    const reviewContent = document.createElement('div');
    reviewContent.classList.add('review-content');
    reviewContent.innerHTML = template;

    reviewContainers[index].appendChild(reviewContent);
}

export function getReviewText(id) {
    const translatedReview = getTranslatedReview(id);
    return `"${translatedReview}"`;
}

function getTranslatedReview(id) {
    const language = getSelectedLanguage();
    const currentReview = reviews.find(review => review.id === id);

    return currentReview.review[language];
}

export function appendAllReviews(container) {
    reviewsList = container.querySelector('#reviews-list');

    const shuffledReviews = shuffle(reviews);
    shuffledReviews.forEach(review => appendReview(review));
}

function appendReview(review) {
    const { source, link, id } = review;
    const translatedType = getReviewTranslatedType(id);
    const template = `
        <a href="${link}">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class='review-open-icon'>
                <path
                    d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240q17 0 28.5 11.5T480-800q0 17-11.5 28.5T440-760H200v560h560v-240q0-17 11.5-28.5T800-480q17 0 28.5 11.5T840-440v240q0 33-23.5 56.5T760-120H200Zm560-584L416-360q-11 11-28 11t-28-11q-11-11-11-28t11-28l344-344H600q-17 0-28.5-11.5T560-800q0-17 11.5-28.5T600-840h200q17 0 28.5 11.5T840-800v200q0 17-11.5 28.5T800-560q-17 0-28.5-11.5T760-600v-104Z" />
            </svg>
            <p class="review-text">${source}</p>
            <p class="review-type">${translatedType}</p>
        </a>
    `;

    const reviewItem = document.createElement('li');
    reviewItem.classList.add('review-item');
    reviewItem.dataset.id = id;
    reviewItem.innerHTML = template;

    reviewsList.appendChild(reviewItem);
}

export function getReviewTranslatedType(id) {
    const language = getSelectedLanguage();
    return reviews.find(review => review.id === id).type[language];
}