const svgSelectors = ['home-title', 'circle', 'line', 'background', 'title', 'biography'];
const svgTransitions = ['page'];
const biographySelectorColors = [
    getComputedStyle(document.documentElement).getPropertyValue('--color-blue'),
    getComputedStyle(document.documentElement).getPropertyValue('--color-light-orange'),
    getComputedStyle(document.documentElement).getPropertyValue('--color-dark-orange')
];

let isStrokeColorLight = false;
let bioSelectorColorIndex = 0;

const svgInfos = {
    selectorsURLs: Object.fromEntries(
        svgSelectors.map(selector => {
            return [selector, `./svg/selector-${selector}.svg`];
        })
    ),

    socialMedias: [
        { url: './logos/social_medias/facebook.svg', id: 'facebook', href: 'https://www.facebook.com/javier.sanchezrojo.9' },
        { url: './logos/social_medias/instagram.svg', id: 'instagram', href: 'https://www.instagram.com/javiersrojo/' },
        { url: './logos/social_medias/spotify.svg', id: 'spotify', href: 'https://open.spotify.com/intl-fr/artist/4Mg2B60aGou7zXTRlbAmeH?si=yEht4fvUSbi2bO2alAGLng' },
        { url: './logos/social_medias/apple.svg', id: 'apple', href: 'https://music.apple.com/es/artist/javier-rojo/1478744089' },
        { url: './logos/social_medias/tidal.svg', id: 'tidal', href: 'https://tidal.com/artist/16729922/' }
    ],

    transitions: Object.fromEntries(
        svgTransitions.map(transition => {
            return [transition, `./svg/transition-${transition}.svg`];
        })
    )
};

// svg transitions
export async function appendAllTransitionsSVGs() {
    const transitionTargets = Array.from(document.querySelectorAll('[data-transition]'));

    for (let i = 0; i < svgTransitions.length; i++) {
        for (const target of transitionTargets) {
            if (target.dataset.transition === svgTransitions[i]) {
                await appendTransitionSVG(svgTransitions[i], target);
            }
        }
    }
}

async function appendTransitionSVG(transition, target) {
    const svg = await fetchSVG(svgInfos.transitions[transition]);
    target.innerHTML = svg;
}

// svg selectors
export async function appendAllSelectors() {
    removeExistingSelectors();

    const selectorTargets = Array.from(document.querySelectorAll('[data-selector]'));

    for (let i = 0; i < svgSelectors.length; i++) {
        for (const target of selectorTargets) {
            if (target.dataset.selector === svgSelectors[i]) {
                await appendSelector(svgSelectors[i], target);
            }
        }
    }
}

async function removeExistingSelectors() {
    const navbarListSectionsSelectors = Array.from(document.querySelectorAll('.selector-container'));

    if (!navbarListSectionsSelectors) return;
    navbarListSectionsSelectors.forEach(element => element.remove());
}

async function appendSelector(selector, target) {
    const targetWidth = target.getBoundingClientRect().width;
    const selectorWidthRatio = selector === 'home-title' ? 1.5 : 1.5;
    const container = target.parentNode;
    const selectorContainer = document.createElement('div');
    const svg = await fetchSVG(svgInfos.selectorsURLs[selector]);

    selectorContainer.innerHTML = svg;
    selectorContainer.classList.add('selector-container');
    selectorContainer.style.width = `${targetWidth * selectorWidthRatio}px`;

    if (['static', ''].includes(getComputedStyle(container).position))
        container.style.position = 'relative';

    container.appendChild(selectorContainer);

    if (['home-title', 'circle'].includes(selector)) assignSelectorOrangeColor(selectorContainer);
    if (['biography'].includes(selector)) initBiographySelectors(selectorContainer, target);
}

function initBiographySelectors(container, target) {
    assignBiographySelectorColor(container);
    rotateRandomlySelector(container, target);
}

function assignSelectorOrangeColor(container) {
    const svgPath = container.querySelector('path');
    const color = isStrokeColorLight ? 'light' : 'dark';
    svgPath.classList.add(`svg-stroke-${color}`);
    isStrokeColorLight = !isStrokeColorLight;
}

function assignBiographySelectorColor(container) {
    const svgPath = container.querySelector('path');
    const color = biographySelectorColors[bioSelectorColorIndex];
    svgPath.style.stroke = color;
    bioSelectorColorIndex = (bioSelectorColorIndex + 1) % biographySelectorColors.length;
}

function rotateRandomlySelector(container) {
        container.style.transform = `translate(-50%, -50%) rotate(${Math.floor(Math.random() * 360)}deg)`;
}

// social media icons
export async function appendSocialMediaIcons() {
    const socialMediaList = document.getElementById('list-social-medias');
    for (let i = 0; i < svgInfos.socialMedias.length; i++) {
        await appendLink(i, socialMediaList);
    }
}

async function appendLink(index, container) {
    const listOption = document.createElement('li');
    const link = document.createElement('a');
    const svg = await fetchSVG(svgInfos.socialMedias[index].url);

    link.innerHTML = svg;
    link.id = svgInfos.socialMedias[index].id;
    listOption.classList.add('link-social-media');
    link.href = svgInfos.socialMedias[index].href;

    listOption.appendChild(link);
    container.appendChild(listOption);
}

export async function fetchSVG(url) {
    const response = await fetch(url);
    const svg = await response.text();
    return svg;
}

// instagram icon
let isHovered = false;
export function handleInstagramHover() {
    const instagramIcon = document.getElementById('instagram');
    const instagramColors = document.querySelectorAll('.instagram-color');
    const animNumber = ['one', 'two', 'three', 'four'];

    instagramIcon.addEventListener('mouseenter', () => {
        isHovered = true;
        handleColorTransition(animNumber, instagramColors);
    });

    instagramIcon.addEventListener('mouseleave', () => {
        isHovered = false;
        handleColorTransition(animNumber, instagramColors);
    });
}

function handleColorTransition(animNumber, instagramColors) {
    for (const number of animNumber) {
        for (const color of instagramColors) {
            if (color.classList.contains(number)) {
                if (isHovered) {
                    color.classList.remove(`insta-anim-out-${number}`);
                    color.classList.add(`insta-anim-in-${number}`);
                } else {
                    color.classList.remove(`insta-anim-in-${number}`);
                    color.classList.add(`insta-anim-out-${number}`);
                }
            }
        }
    }
}

export async function drawSelectors(isTransition) {
    const targets = Array.from(document.querySelectorAll('[data-selector]'));

    targets.forEach(target => {
        const path = target.parentNode.querySelector('path');
        const selector = target.parentNode.querySelector('.selector');

        const isSelectedLanguage = target.classList.contains('selected-language');
        const isSelectedPage = target.classList.contains('selected-page');
        const isSectionTitle = target.classList.contains('section-title');
        const isHomeTitle = target.classList.contains('home-title');
        const isBiography = target.dataset.selector === 'biography';
        const isLanguageOption = target.dataset.language !== undefined;

        if (isLanguageOption && !isSelectedLanguage && !isSectionTitle && !isHomeTitle && !isBiography) return;

        if (isSectionTitle) {
            if (!isTransition) {
                gsap.set(selector, { opacity: 1 });
                gsap.from(path, { drawSVG: 0, duration: 0.5 });
            }
        } else if (!isSelectedPage && !isSelectedLanguage && !isHomeTitle && !isBiography) {
            const draw = gsap.timeline({ paused: true });
            draw.set(selector, { opacity: 1 })
                .from(path, { drawSVG: 0, duration: 0.5 });

            target.addEventListener('mouseenter', () => draw.play());
            target.addEventListener('mouseleave', () => draw.reverse());

        } else if (isBiography) {
            gsap.set(selector, { opacity: 1 });
            return;
        } else {
            gsap.set(selector, { opacity: 1 });
            if (!isTransition && !isHomeTitle && !isBiography) {
                let drawDuration = 1;
                if (isSelectedLanguage) drawDuration = 0.5;
                else if (isSelectedPage) drawDuration = 0.3;

                gsap.from(path, { drawSVG: 0, duration: drawDuration });
            }
        }
    });
}