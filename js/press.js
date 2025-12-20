import { getSelectedLanguage } from "./translation.js";

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, ScrollSmoother, SplitText, TextPlugin)

});

const rawReviews = [
    { source: 'Jazz Magazine (FR)', review: { en: 'Revelation!', es: '¡Revelación!' }, link: 'https://drive.google.com/file/d/1-A1xVIa7CMxQFaIXzhZU-fxbTJZVKLLk/view' },
    { source: 'Jazz Weekly (US)', review: { en: 'Brings fresh ideas to the post bop genre.', es: 'Aporta ideas frescas al género post-bop.' }, link: 'https://jazzweekly.com/2025/03/javier-rojo-musica-para-amansar-fieras-fuel/' },
    { source: 'Jazzwise (UK)', review: { en: 'Rojo may be in his mid-twenties but already he is in his element with maturity and purpose.', es: 'Rojo puede estar en la mitad de sus veintitantos, pero ya se mueve con madurez y propósito en su elemento.' }, link: '' },
    { source: 'NRW Jazz (DE)', review: { en: "A fine, contemporary jazz record… the swing is relaxed, the boppy passages are driving, the ballads are tender and emotional - Rojo's own compositions have a lot to offer.", es: 'Un excelente disco de jazz contemporáneo… el swing es relajado, los pasajes bop son enérgicos, las baladas son tiernas y emotivas; las composiciones propias de Rojo tienen mucho que ofrecer.' }, link: 'https://nrwjazz.net/rezensionen/neues-aus-der-cd-welt-christoph-gieses-schnelldurchlauf-vol-66' },
    { source: 'Jazzmania (BE)', review: { en: "Jordi Pujol, head of the Fresh Sound New Talent label, knows damn well who to give a chance to. With this Javier Rojo and his sextet, it's clearly a successful move.", es: 'Jordi Pujol, director del sello Fresh Sound New Talent, sabe muy bien a quién darle una oportunidad. Con Javier Rojo y su sexteto, está claro que ha sido una apuesta acertada.' }, link: 'https://jazzmania.be/javier-rojo-musica-para-amansar-fieras/' },
    { source: 'Jazzflits (NL)', review: { en: 'Energetic, playful, and pleasantly sentimental', es: 'Enérgico, juguetón y agradablemente sentimental.' }, link: '' },
    { source: 'PJ Portrait in Jazz (JP)', review: { en: 'Straight-ahead energy characteristic of young musicians, making it a refreshing listen.', es: 'Energía directa característica de músicos jóvenes, lo que lo convierte en una escucha refrescante.' }, link: 'https://pjportraitinjazz.com/playlists/20250128_8832/' },
    { source: 'Esensja (PL)', review: { en: 'Javier Rojo – remember this artist!', es: 'Javier Rojo: ¡recuerda este nombre!' }, link: 'https://esensja.pl/muzyka/recenzje/tekst.html?id=36044' },
    { source: 'Jazz Views (UK)', review: { en: 'These guys are having real musical conversations.', es: 'Estos músicos mantienen auténticas conversaciones musicales.' }, link: 'https://jazzviews.net/javier-rojo-musica-para-amansar-fieras/' },
    { source: 'Blue in Green (UK)', review: { en: "The musical embodiment of wearing one's heart on their sleeve.", es: 'La encarnación musical de llevar el corazón en la mano.' }, link: 'http://www.blueingreenradio.com/2025/01/musica-para-amansar-fieras-by-javier.html' },
    { source: 'Era Jazzu (PL)', review: { en: 'A perfect showcase for the young European jazz scene.', es: 'Una muestra perfecta de la joven escena jazzística europea.' }, link: 'https://jazz.pl/javier-rojo-musica-para-amansar-fieras-fresh-sound-new-talent/' },
    { source: 'Jazz Rozhlas (CZ)', review: { en: 'recommendation', es: 'recomendación' }, link: 'https://jazz.rozhlas.cz/uloveno-na-siti-dny-se-prodluzuji-jazzu-pribyva-9406376' },
    { source: 'Salt-peanuts (DK)', review: { en: 'review', es: 'crítica' }, link: 'https://salt-peanuts.eu/record/javier-rojo/' },
    { source: 'Goldmine Magazine (US)', review: { en: 'review', es: 'crítica' }, link: 'https://www.goldminemag.com/columns/noel-okimoto-javier-rojo-erik-jekabson-terry-waldo-and-bill-oconnell-know-no-genre/' },
    { source: 'Radio Bemowo (PL)', review: { en: 'airplay', es: 'airplay' }, link: 'https://www.facebook.com/marek.j.smietanski/posts/pfbid02wUXY8xNDSHDwB4iYMd2e4eYLnQbrtiAJMa1zkdyzV7VgrKtdz7RKggX5PZMVcN2hl' },
    { source: '15 Questions (DE)', review: { en: 'interview', es: 'entrevista' }, link: 'https://15questions.net/interview/javier-rojo-about-improvisation/page-1/' },
    { source: 'La Habitacion Del Jazz (ES)', review: { en: 'review', es: 'crítica' }, link: 'https://lahabitaciondeljazz.blogspot.com/2025/01/javier-rojo-cd-musica-para-amansar.html' },
    { source: 'Radio France - Au Coeur du Jazz (FR)', review: { en: 'review', es: 'crítica' }, link: 'https://www.radiofrance.fr/francemusique/podcasts/au-coeur-du-jazz/javier-rojo-le-miroir-de-ses-emotions-9749039' },
    { source: 'Jazzreporter (DE)', review: { en: 'interview', es: 'entrevista' }, link: 'https://www.jazzreporter.com/2025/01/12/javier-rojo-interview/' },
    { source: 'Future Jazz on Jazz FM (UK)', review: { en: 'airplay', es: 'airplay' }, link: 'https://www.mixcloud.com/RuthieNotesandTones/future-jazz-on-jazz-fm-6-january-2025/' },
    { source: 'Radio RDC (PL)', review: { en: 'airplay', es: 'airplay' }, link: 'https://www.facebook.com/alejazz.marek.romanski/posts/pfbid0H7LGwBh66og6g7GGFgBkskJajzkB8SPUB5Vb7Z6v873WYKBpUsU52QmPcSj5rX3zl' }
];

function generateReviewID(review, index) {
    const reviewText = review.source.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${reviewText}-${index}`;
}

const reviews = rawReviews.map((review, index) => ({
    id: generateReviewID(review, index),
    ...review
}))

export function initPressCarousel() {
    const pressCarousel = document.getElementById('press-carousel');
    if (pressCarousel.children.length > 1) return;

    const shuffledReviews = shuffle(reviews);

    shuffledReviews.forEach((review, index) => {
        appendPressReview(review, index);
    });

    initCarouselAnimations();
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function appendPressReview(pressReview, index) {
    const { id, source, link } = pressReview;
    const pressCarousel = document.getElementById('press-carousel');
    const side = index % 2 === 0 ? 'start' : 'end';
    const reviewText = getReviewText(id);
    const template = `
    <div class="review-content">
        <p class="review-container" data-review-id=${id}>${reviewText}</p>
        <a class="source-container" href="${link}">&mdash; ${source}</a>
    </div>
    `;

    const pressReviewContainer = document.createElement('div');
    pressReviewContainer.classList.add('press-review-container');
    pressReviewContainer.innerHTML = template;
    pressReviewContainer.style.justifyContent = side;
    pressCarousel.appendChild(pressReviewContainer);
}

export function getReviewText(id) {
    const translatedReview = getTranslatedReview(id);

    if (/^\p{L}+$/u.test(translatedReview)) return translatedReview.toUpperCase();
    else return `"${translatedReview}"`;
}

function getTranslatedReview(id) {
    const language = getSelectedLanguage();
    const currentReview = reviews.find(review => review.id === id);

    return currentReview.review[language];
}

/* ANIMATIONS */
let homeClickHandler = null;
let homeSmoother = null;
let homeScrollTriggers = [];

function initCarouselAnimations() {
    const homeTitle = document.getElementById("home-title-container");
    const smoothWrapper = document.getElementById("smooth-wrapper");
    const pressCarousel = document.getElementById("press-carousel");
    const homeOverlay = document.getElementById("home-image-overlay");
    const homeImages = document.querySelectorAll(".home-image");
    const sections = gsap.utils.toArray(".press-review-container");
    const navbar = document.getElementById('navbar');

    if (!pressCarousel || !homeOverlay || homeImages.length === 0) return;

    let isCarouselDisplayed = false;
    const carouselTimeline = gsap.timeline({ paused: true });
    carouselTimeline
        .to(smoothWrapper, { zIndex: 5, duration: 0 })
        .to(homeTitle.children, { yPercent: -600, zIndex: -1, stagger: { amount: 0.1, from: 'start' }, ease: 'back.in(1.3)' })
        .to(homeOverlay, { backdropFilter: "blur(5px) brightness(0.1)", duration: 0.4, overwrite: true }, 0.5)
        .to(homeImages, { transform: "translate(-50%, -48%) scale(1.05)", duration: 0.5, overwrite: true }, 0.5)
        .to(pressCarousel, { opacity: 1, duration: 0.4, overwrite: true }, 0.5)
        .to(navbar, { opacity: 1, stagger: { amount: 0.2 } }, 0.5)

    homeClickHandler = (event) => {
        if (event.target.closest('li')) return;

        if (!isCarouselDisplayed) {
            carouselTimeline.play()
        } else {
            carouselTimeline.reverse();
        }
        isCarouselDisplayed = !isCarouselDisplayed;
    };

    window.addEventListener("click", homeClickHandler);

    homeSmoother = ScrollSmoother.create({
        smooth: 2,
        smoothTouch: 0.1,
        wrapper: "#smooth-wrapper",
        content: "#smooth-content"
    });

    const container = document.querySelector("#press-carousel-container");
    const verticalScroll = gsap.to(sections, {
        y: () => -150 * (sections.length - 1),
        ease: "none",
        stagger: {
            each: 0.015
        },
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: "top 20%",
            end: () => "+=" + window.innerHeight * (sections.length - 1) / 5
        }
    });
    homeScrollTriggers.push(verticalScroll.scrollTrigger);
}


export function destroyPressCarousel() {
    if (homeClickHandler) {
        window.removeEventListener("click", homeClickHandler);
        homeClickHandler = null;
    }

    homeScrollTriggers.forEach(st => st.kill());
    homeScrollTriggers = [];

    if (homeSmoother) {
        homeSmoother.kill();
        homeSmoother = null;
    }

    const overlay = document.getElementById('home-image-overlay');
    const images = document.querySelectorAll('.home-image');
    const carousel = document.getElementById('press-carousel');

    gsap.set([overlay, ...images, carousel], {
        opacity: 0,
        clearProps: "all",
        pointerEvents: "none"
    });
}