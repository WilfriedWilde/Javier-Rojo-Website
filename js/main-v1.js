import initHome from "./home.js";
import { getSelectedLanguage, handleLanguageSelection, translateTextsInPage } from "./translation.js";
import { appendAllSelectors, drawSelectors, appendSocialMediaIcons, handleInstagramHover } from "./svg.js";
import { injectHTML } from "./inject_html.js";

async function initUI(page, container) {
    // Inject navbar/footer only if needed
    if (page === 'home') {
        await injectHTML('navbar', 'navbar.html');
        await injectHTML('footer', 'footer.html');
        setFooter();
    }

    await handlePageSelection(page);
    const currentLanguage = getSelectedLanguage();

    // Pass the current container to scope translation correctly
    await handleTranslation(currentLanguage, container);
}
/*
async function initUI(page) {
    if (page === 'home') {
        await injectHTML('navbar', 'navbar.html');
        await injectHTML('footer', 'footer.html');
    }

    setFooter(page);

    await handlePageSelection(page);
    await handleTranslation(page);
}*/

// SET FOOTER
function setFooter(page) {
    setSocialMediaIcons();
    setCopyrightText();
}

async function setSocialMediaIcons() {
    appendSocialMediaIcons()
        .then(handleInstagramHover);
}

function setCopyrightText() {
    const copyright = document.getElementById('copyright');
    const year = new Date().getFullYear();
    copyright.innerHTML = `© ${year} Javier Rojo. <span data-translation="footer"></span>`;
}

// PAGE SELECTION
async function handlePageSelection(page) {
    const navbar = document.getElementById('navbar');

    updatePageSelection(page);

    navbar.addEventListener('click', (event) => {
        if (!event.target.dataset.page) return;
        updatePageSelection(page);
    })
}

function updatePageSelection(page) {
    storeSelectedPage(page);
    assignPagesClassName(page);
}

function storeSelectedPage(page) {
    localStorage.setItem('page', page);
}

function assignPagesClassName() {
    const pagesList = Array.from(document.querySelectorAll('[data-page]'));
    const selectedPage = getSelectedPage();

    for (const page of pagesList) {
        if (page.dataset.page !== selectedPage) {
            page.classList.remove('selected-page');
        }
        else {
            page.classList.add('selected-page');
        }
    }
}

function getSelectedPage() {
    const selectedSection = localStorage.getItem('page');
    return selectedSection ? selectedSection : 'home';
}

// TRANSLATION
// TRANSLATION
async function handleTranslation(language, container) {
    const textsToTranslate = container.querySelectorAll('[data-translation]');
    const page = container.dataset.namespace;

    // Apply translations and run SVG microanimations
    await updateLanguageContent(language, textsToTranslate, page);

    // Set up language switching for this container
    const navbarListLanguages = document.querySelector('#navbar-list-languages');
    if (navbarListLanguages) {
        navbarListLanguages.addEventListener('click', async (event) => {
            if (!event.target.dataset.language) return;
            await updateLanguageContent(event.target.dataset.language, textsToTranslate, page);
        });
    }
}


/*
async function handleTranslation(page) {
    const textsToTranslate = document.querySelectorAll('[data-translation]');
    const currentLanguage = getSelectedLanguage();
    const navbarListLanguages = document.getElementById('navbar-list-languages');

    await updateLanguageContent(currentLanguage, textsToTranslate, page);

    navbarListLanguages.addEventListener('click', async (event) => {
        if (!event.target.dataset.language) return;
        await updateLanguageContent(event.target.dataset.language, textsToTranslate, page);
    });
}*/

async function updateLanguageContent(language, textsToTranslate, page) {
    handleLanguageSelection(language);
    translateTextsInPage(textsToTranslate, 'all');
    translateTextsInPage(textsToTranslate, page);
    await appendAllSelectors();
    await drawSelectors();
}

/*window.addEventListener('DOMContentLoaded', () => {
    const page = document.location.pathname.split('/')[1].split('.')[0];
    
    initUI(page);
})*/

/* TRANSITIONS */
barba.init({
    transitions: [{
        name: "page-transition",

        async once({ current }) {
            const container = current.container || document.querySelector('[data-barba="container"]');
            const page = container.dataset.namespace;
            console.log("FIRST LOAD → page:", page);
            await initUI(page, container);

            if (page === "home") initHome();
        },

        async enter({ next }) {
            const page = next.container.dataset.namespace;
            console.log("Entering page →", page);

            if (page === "home") initHome();
        },

        async afterEnter({ next }) {
            const container = next.container;
            const page = container.dataset.namespace;
            console.log("After enter → page:", page);

            // Run initUI with the specific container to prevent disappearing elements
            await initUI(page, container);
        }
    }]
});
/*
barba.init({
    transitions: [{
        name: "page-transition",

        // First load of the page
        async once({ current }) {
            // current.container is null on first load
            const container = current.container || document.querySelector('[data-barba="container"]');
            const page = container.dataset.namespace;
            console.log("FIRST LOAD → page:", page);
            await initUI(page);

            // Example: if home-specific code
            if (page === "home") initHome();
        },

        // When leaving a page (animation out)
        leave({ current }) {
            console.log("Leaving page →", current.container.dataset.namespace);
            // You can add leave animations here
        },

        // When entering a new page (animation in)
        async enter({ next }) {
            const page = next.container.dataset.namespace;
            console.log("Entering page →", page);

            if (page === "home") initHome();
        },

        // After the new page is fully in DOM
        async afterEnter({ next }) {
            const container = next.container;
            const page = container.dataset.namespace;
            console.log("After enter → page:", page);

            // Inject navbar/footer and re-run page init
            await initUI(page);
        }
    }]
});*/