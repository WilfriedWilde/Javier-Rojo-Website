import { getSelectedLanguage, getTranslation } from "./translation.js";
import { appendTextReviews, appendAllReviews } from "./press.js";

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
    appendAllReviews(barbaContainer);
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
        initTextReviewsAnim(container);
        initReviewsListListener(container);
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
                start: "top 80%",
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

export async function initTextReviewsAnim(container) {
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
                start: "top 80%",
                once: true,
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
            }, 0.3)
    });
}

let isReviewsListDisplayed = false;

function initReviewsListListener(container) {
    isReviewsListDisplayed = false;
    const buttonIcon = container.querySelector('#reviews-button-icon');
    buttonIcon.addEventListener('click', handleDisplayReviewsList);
}

function handleDisplayReviewsList() {
    if (isReviewsListDisplayed) hideReviewsList();
    else showReviewsList();

    isReviewsListDisplayed = !isReviewsListDisplayed;
}

function hideReviewsList() {
    const reviewsContainer = document.getElementById('reviews-container');
    const buttonIcon = reviewsContainer.querySelector('#reviews-button-icon');
    const list = reviewsContainer.querySelector('#reviews-list');
    const items = reviewsContainer.querySelectorAll('.review-item');

    const hideTimeline = gsap.timeline();
    hideTimeline
        .to(buttonIcon, { duration: 2, ease: "elastic.out(1.1,0.4)", rotation: "+=180" })
        .to(items, {
            stagger: {
                each: 0.03,
                from: 'end',
                ease: 'power1.out'
            },
            opacity: 0,
        }, 0)
        .to(list, { duration: 0.5, height: 0 }, 1)
        .to(reviewsContainer, { duration: 0.8, backgroundColor: 'transparent', color: 'var(--color-white)' }, '>')


}

function showReviewsList() {
    const reviewsContainer = document.getElementById('reviews-container');
    const buttonIcon = reviewsContainer.querySelector('#reviews-button-icon');
    const list = reviewsContainer.querySelector('#reviews-list');
    const items = reviewsContainer.querySelectorAll('.review-item');

    const listHeight = getReviewsListHeight(list);

    const showTimeline = gsap.timeline();
    showTimeline
        .to(buttonIcon, { duration: 2, ease: "elastic.out(1.2,0.7)", rotation: "-=180" })
        .to(reviewsContainer, { duration: 0.3, backgroundColor: 'var(--color-white)', color: 'var(--color-black)' }, 0)
        .to(list, { duration: 1, ease: 'power2.out', height: listHeight }, 0.5)
        .to(items, {
            stagger: {
                each: 0.03,
                from: 'start',
                ease: 'power2.out'
            }
            , opacity: 1
        }, 1)
}

function getReviewsListHeight(list) {
    let listHeight = 0;

    list.style.height = 'auto';
    listHeight = list.getBoundingClientRect().height;
    list.style.height = 0;

    return listHeight;
}