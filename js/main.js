import initNavbar from "./navbar.js";
import initHome, { resizeImageToScreenSize } from "./home.js";
import initNews from "./news.js";
import initMedias from "./medias.js";
import initConcerts from "./concerts.js";
import initContact from "./contact.js";
import { getSelectedLanguage, handleLanguageSelection, translateTextsInPage } from "./translation.js";
import { appendAllTransitionsSVGs, appendAllSelectors, drawSelectors, appendSocialMediaIcons, handleInstagramHover } from "./svg.js";
import { injectHTML } from "./inject_html.js";
import { destroyPressCarousel } from "./press.js";


/* ---------------------------------------------------------
   INIT PAGE
--------------------------------------------------------- */
const pageInits = {
    home: initHome,
    news: initNews,
    medias: initMedias,
    concerts: initConcerts,
    contact: initContact
}

async function initPage(page, container) {
    if (pageInits[page]) await pageInits[page](container);
}

/* ---------------------------------------------------------
   BARBA TRANSITIONS
--------------------------------------------------------- */
// Prevent transitions when clicking the link to the current page
document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;

    const currentUrl = window.location.pathname;
    const targetUrl = new URL(link.href).pathname;

    if (currentUrl === targetUrl) {
        e.preventDefault();
        return;
    }
});

barba.init({
    views: [{
        namespace: null,
        async beforeEnter({ next }) {
            const page = next.container.dataset.namespace;

            await initUI(page, next.container);
            await drawSelectors(true);
            await initPage(page, next.container)

            if (page === 'index') resizeImageToScreenSize();
        }
    }],

    transitions: [{
        name: "page-transition",
        async once() {
            const container = document.querySelector("[data-barba='container']");
            const page = container.dataset.namespace;

            await initUI(page, container);
            await appendAllTransitionsSVGs();
            await drawSelectors();
        },

        leave() {
            const drawOverlay = gsap.timeline();
            drawOverlay
                .set('#transition-overlay', { zIndex: 20 })
                .set('#transition-overlay-svg', { opacity: 1 })
                .from('#transition-overlay-svg-path', {
                    drawSVG: 0,
                    duration: 1.5,
                })

            return drawOverlay;
        },

        enter({ current }) {
            if (current.container.dataset.namespace === 'index') {
                destroyPressCarousel();
                window.scrollTo(0, 0);
            }
            current.container.style.position = 'absolute';
        },

        async afterEnter({ next }) {
            const unDrawOverlay = gsap.timeline();
            unDrawOverlay
                .to('#transition-overlay-svg-path', {
                    drawSVG: '100% 100%',
                    duration: 1.5,
                })
                .set('#transition-overlay', { zIndex: -10 })
                .set('#transition-overlay-svg', { opacity: 0 })

            const title = next.container.querySelector('.section-title') || '';
            if (title) {
                let split = SplitText.create(title, { type: 'chars', mask: 'chars' });
                const path = title.parentNode.querySelector('path');
                const selector = title.parentNode.querySelector('.selector');

                unDrawOverlay
                    .from(split.chars, {
                        yPercent: -100,
                        stagger: {
                            amount: 0.1,
                            from: 'random'
                        },
                        ease: 'back.out(2)'
                    }, '-=0.8')
                    .set(selector, { opacity: 1 }, '-=0.5')
                    .from(path, { drawSVG: 0, duration: 0.5 }, '-=0.5');
            };

            await unDrawOverlay;
            await appendAllTransitionsSVGs();
        }
    }]
});

/* ---------------------------------------------------------
   INIT UI (runs on first load + after each transition)
--------------------------------------------------------- */
async function initUI(page, container) {
    const navbar = document.getElementById('navbar');
    const footer = document.getElementById('footer');

    if (navbar && !navbar.innerHTML.trim()) {
        await injectHTML('navbar', 'navbar.html');
        attachNavbarListeners();
    }
    if (footer && !footer.innerHTML.trim()) {
        await injectHTML('footer', 'footer.html');
    }

    initNavbar(navbar, page);
    initFooter(page);
    handlePageSelection(page);

    const currentLanguage = getSelectedLanguage();
    await handleTranslation(currentLanguage, container);
}


/* ---------------------------------------------------------
   NAVBAR LANGUAGE LISTENERS
--------------------------------------------------------- */
function attachNavbarListeners() {
    const navbarLangList = document.getElementById("navbar-list-languages");

    if (!navbarLangList) return;

    navbarLangList.addEventListener("click", async (e) => {
        if (!e.target.dataset.language) return;

        const lang = e.target.dataset.language;
        handleLanguageSelection(lang);

        const container = document.querySelector("[data-barba='container']");
        await handleTranslation(lang, container);
        await drawSelectors();
    });
}

/* ---------------------------------------------------------
   FOOTER
--------------------------------------------------------- */
function initFooter(page) {
    const footer = document.getElementById("footer");
    if (page === "index") {
        footer.style.display = "none";
    } else {
        footer.style.display = "flex";
    }

    if (!document.getElementById("list-social-medias").hasChildNodes()) {
        setSocialMediaIcons();
        setCopyrightText();
    }
}

async function setSocialMediaIcons() {
    appendSocialMediaIcons().then(handleInstagramHover);
}

function setCopyrightText() {
    const el = document.getElementById("copyright");
    const year = new Date().getFullYear();
    el.innerHTML = `© ${year} Javier Rojo. <span data-translation="footer"></span>`;
}

/* ---------------------------------------------------------
   NAVBAR PAGE SELECTION
--------------------------------------------------------- */
function handlePageSelection(page) {
    localStorage.setItem("page", page);
    highlightNavbarPage();
}

function highlightNavbarPage() {
    const pages = document.querySelectorAll("[data-page]");
    const selected = localStorage.getItem("page") || "index";

    pages.forEach(el => {
        el.classList.toggle("selected-page", el.dataset.page === selected);
    });
}

/* ---------------------------------------------------------
   TRANSLATION HANDLING
--------------------------------------------------------- */
async function handleTranslation(language, container) {
    handleLanguageSelection(language);

    const persistent = document.querySelectorAll(
        "#navbar [data-translation], #footer [data-translation]"
    );
    translateTextsInPage(persistent, "all");

    const pageTexts = container.querySelectorAll("[data-translation]");
    translateTextsInPage(pageTexts, "all");
    translateTextsInPage(pageTexts, container.dataset.namespace);

    await appendAllSelectors();
}


