import initNavbar from "./navbar.js";
import initHome, { introHomeAnimation } from "./home.js";
import initNews from "./news.js";
import initBiography, { initBiographyAnimations } from "./biography.js";
import initMedias from "./medias.js";
import initConcerts from "./concerts.js";
import initContact from "./contact.js";
import { getSelectedLanguage, handleLanguageSelection, translateTextsInPage } from "./translation.js";
import { appendAllTransitionsSVGs, appendAllSelectors, drawSelectors, appendSocialMediaIcons, handleInstagramHover } from "./svg.js";
import { injectHTML } from "./inject_html.js";
import { destroyPressCarousel } from "./press.js";
import { initTransition, animateTransition } from "./transition-page.js";

/* ---------------------------------------------------------
   INIT PAGE
--------------------------------------------------------- */
const pageInits = {
    index: initHome,
    news: initNews,
    biography: initBiography,
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
        },
        afterEnter({ next }) {
            if (next.container.dataset.namespace === 'biography') initBiographyAnimations(next.container);
        },
    }],

    transitions: [{
        debug: true,
        name: "page-transition",
        async once() {
            const container = document.querySelector("[data-barba='container']");
            const page = container.dataset.namespace;

            await initUI(page, container);
            await appendAllTransitionsSVGs();
            await drawSelectors();

            if (page === 'index') introHomeAnimation();
        },

        async beforeLeave({ trigger }) {
            if (trigger) {
                const namespace = trigger.dataset.barbaNamespaceTarget
                    || trigger.getAttribute('href').split('.')[0];
                await initTransition(namespace);
            }
        },

        async leave() {
            await animateTransition.in();
        },

        enter({ current }) {
            if (current.container.dataset.namespace === 'index') destroyPressCarousel();

            current.container.style.position = 'absolute';
        },

        async afterEnter({ next }) {
            await animateTransition.out(next);
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


