import { getSelectedLanguage, getTranslation } from "./translation.js";
import { appendTextReviews } from "./press.js";

const biographyTexts = {
    en: {
        one: 'Born in Guadalajara (Spain) in 1999, Javier began studying classical clarinet at the age of six with Enrique Pérez, soloist of the Spanish National Orchestra. At 17, he moved to Barcelona to study jazz and switched to tenor saxophone, training with teachers such as Joan Albert Amargós, Lluís Vidal, Santi de la Rubia, and Perico Sambeat. In 2022, he relocated to Basel to pursue a Master’s degree in Performance and subsequently another in Composition at the Jazzcampus, where he studied with musicians including Mark Turner, Guillermo Klein, Chris Cheek, Brad Mehldau, Larry Grenadier, Jorge Rossy, Ambrose Akinmusire, and Jeff Ballard.',
        two: 'Despite his young age, Javier has shared the stage with artists such as Lionel Loueke, Aaron Parks, Chano Domínguez, Jim McNeely, and Carles Benavent, and has performed at festivals and clubs across Spain, Switzerland, Germany, Austria, and Canada. These include festivals such as the Madrid Jazz Festival, Cádiz Jazz Festival, BigBasel Fest (Basel), Jazz Montez (Frankfurt), Córdoba Jazz Festival, Mas i Mas (Barcelona), and Elche Jazz Festival, as well as venues like ZWE (Vienna), Bird’s Eye Jazz Club (Basel), Jamboree (Barcelona), Jimmy Glass (Valencia), Nova Jazz Cava (Terrassa), AsseJazz (Seville), Altxerri (San Sebastián), Rvbicón (Santander), and Meidinerz (Gijón), among others.',
        three: 'He also works as a sideman in projects such as Yossi Itskovich 5et, Paul Janoschka 4et, Nepumuk, Nikolai Olshansky 5et, Ryuji Uchida 5et, Basel Jazz Orchestra, Martin Otero 5et, Perramon-Rojo 5et, Knuets-Rojo 5et, and Ensemble Revuelo.',
        four: 'With exceptional interpretive ability and tireless creativity, Javier decided to lead his own musical projects with the release of his debut album as a leader, Música Para Amansar Fieras (Fresh Sound Records, 2025). He is currently immersed in the creative process of his second album, scheduled for release in autumn 2026.',
        five: 'press reviews'
    },
    es: {
        one: 'Nacido en Guadalajara (ES) en 1999, Javier comenzó clarinete clásico a los seis años con Enrique Pérez, solista de la Orquesta Nacional de España. A los 17 se trasladó a Barcelona para estudiar jazz y pasó al saxofón tenor, formándose con maestros como Joan Albert Amargós, Lluís Vidal, Santi de la Rubia y Perico Sambeat. En 2022 se mudó a Basilea para realizar un Máster en Interpretación y otro después en Composición en el Jazzcampus, donde estudió con músicos como Mark Turner, Guillermo Klein, Chris Cheek, Brad Mehldau, Larry Grenadier, Jorge Rossy, Ambrose Akinmusire y Jeff Ballard.',
        two: 'A pesar de su juventud, Javier ha compartido escenario con artistas como Lionel Loueke, Aaron Parks, Chano Domínguez, Jim McNeely o Carles Benavent, y ha actuado en festivales y clubs de España, Suiza, Alemania, Austria y Canadá, incluyendo festivales como el Festival de Jazz de Madrid, Festival Jazz Cádiz, BigBasel Fest (Basel), Jazz Montez (Frankfurt), Córdoba, Mas i Mas (Barcelona), Elche o clubes como el ZWE (Viena), Bird’s Eye Jazz Club (Basilea), Jamboree (Barcelona), Jimmy Glass (Valencia), Nova Jazz Cava (Terrassa), AsseJazz (Sevilla), Altxerri (San Sebastián), Rvbicón (Santander) o Meidinerz (Gijón) entre otros.',
        three: 'Además, participa como sideman en proyectos como Yossi Itskovich 5et, Paul Janoschka 4et, Nepumuk, Nikolai Olshansky 5et, Ryuji Uchida 5et, Basel Jazz Orchestra, Martin Otero 5et, Perramon-Rojo 5et, Knuets-Rojo 5et o Ensemble Revuelo.',
        four: 'Con una capacidad interpretativa excepcional y una creatividad incansable, Javier decidió liderar sus propios proyectos musicales con el lanzamiento de su primer álbum como líder Música Para Amansar Fieras, (Fresh Sound Records, 2025). Actualmente está inmerso en el proceso creativo de su segundo álbum, el cuál saldrá a la luz en Otoño de 2026.',
        five: 'críticas de prensa'
    }
}

export default async function initBiography(barbaContainer) {
    const texts = Array.from(barbaContainer.querySelectorAll('[data-biography]'));
    displayBiographyTexts(texts);
    appendTextReviews(barbaContainer);
}

export function displayBiographyTexts(texts) {
    texts.forEach(text => displayText(text))
}

function displayText(text) {
    const translatedText = translateText(text);
    text.innerHTML = translatedText;
}

function translateText(text) {
    const language = getSelectedLanguage();
    const textData = [language, ...text.dataset.biography.split('-')] || [language, text.dataset.biography];
    return getTranslation(biographyTexts, textData);
}

export function initBiographyAnimations(container) {
    clearBiographyAnimations();
    document.fonts.ready.then(() => {
        initTextAnim(container);
        initReviewsAnim(container);
    });
}

export function waitForSelector(container, selector) {
    return new Promise(resolve => {
        const el = container.querySelector(selector);
        if (el) return resolve(el);

        const observer = new MutationObserver(() => {
            const found = container.querySelector(selector);
            if (found) {
                observer.disconnect();
                resolve(found);
            }
        });
        observer.observe(container, { childList: true, subtree: true });
    });
}

export function clearBiographyAnimations() {
    ScrollTrigger.getAll().forEach(st => st.kill());
}

export async function initTextAnim(container) {
    const texts = container.querySelectorAll('[data-biography]');

    texts.forEach(text => {
        text._split?.revert();
        text._split = SplitText.create(text, { type: "lines" });
        gsap.set(text, { opacity: 1 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: text,
                start: "top center",
                once: true
            }
        });

        tl.from(text._split.lines, {
            duration: 1.3,
            opacity: 0,
            stagger: 0.02
        });
    });
}

export async function initReviewsAnim(container) {
    const textReviews = container.querySelectorAll('.review-content');

    textReviews.forEach(text => {
        const review = text.querySelector('.review-container');
        const source = text.querySelector('.source-container');

        const reviewSplit = SplitText.create(review, { type: 'words' });
        const sourceSplit = SplitText.create(source, { type: 'chars' });
        gsap.set(text, { opacity: 1 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: text,
                start: "top center",
                once: true
            }
        });

        tl
            .from(reviewSplit.words, {
                duration: 1,
                opacity: 0,
                stagger: 0.03
            })
            .from(sourceSplit.chars, {
                duration: 0.5,
                opacity: 0,
                stagger: 0.05
            }, '0')
    });
}



////////////////////////////////////


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