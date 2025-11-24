import { translate } from "./translation.js";
import { appendSocialMediaIcons, handleInstagramHover, appendNavIcons } from "./svg-v1.js";
import { injectHTML } from "./inject_html.js";

window.addEventListener('DOMContentLoaded', () => {
    injectHTML('navbar', 'navbar-v1.html')
        .then(() => {
            const sectionsList = document.getElementById('list-sections');
            appendNavIcons(sectionsList);
        });
    injectHTML('footer', 'footer-v1.html')
        .then(() => {
            const socialMediaList = document.getElementById('list-social-medias');
            appendSocialMediaIcons(socialMediaList)
                .then(handleInstagramHover);

            const copyright = document.getElementById('copyright');
            const year = new Date().getFullYear();
            copyright.innerText = `© ${year} Javier Rojo. All rights reserved.`;
        });
})

/* ---> TRANSLATION <--- */
const texts = document.querySelectorAll('.text');

// get language
let language = 'es';

document.documentElement.setAttribute('lang', 'en');
language = document.documentElement.getAttribute('lang');

// get page
const page = document.location.pathname.split('/')[1].split('.')[0];

translate(language, page, texts);

