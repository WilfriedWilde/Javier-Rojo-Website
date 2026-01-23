import { fetchSheetsData } from "./home.js";
import { getSelectedLanguage, getTranslation } from "./translation.js";
import { shuffle } from "./press.js";

export const mediaSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=129671728&single=true&output=csv';
const mediaTexts = {
    en: {
        subheader: {
            one: 'audio',
            two: 'video',
            three: 'gallery'
        }
    },
    es: {
        subheader: {
            one: 'audio',
            two: 'video',
            three: 'galería'
        }
    }
}

const mediaTypes = {
    audio: ['tidal', 'bandcamp'],
    video: ['youtu.be', 'youtube']
};
const platformParsers = {
    youtube: {
        template: `<iframe class="media-youtube" 
        title="YouTube video player" frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        regex: /[^\/]+$/g
    },
    tidal: {
        template: `<iframe class="media-tidal"
        allow="encrypted-media; fullscreen; clipboard-write https://embed.tidal.com; web-share"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        style="color-scheme: light dark" title="TIDAL Embed Player"></iframe>`,
        regex: /\/album\/(\d+)/
    },
    bandcamp: {
        template: `<iframe style="border: 0; width: 350px; height: 786px; border-radius: 5px" seamless></iframe>`,
        regex: /album=[0-9]+/g
    }
};
const svgArrow = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
        <path class="arrow" d="M31,55.78l2.63,2.79c4.24-1.07,8.66-1.1,13-1.13Q158,56.83,269.36,59.05" />
    </svg>
`;

let sheetDataName;
let audioList, videoList, galleryColumns, images = [];

export default async function initMedia(barbaContainer) {
    const texts = Array.from(barbaContainer.querySelectorAll('[data-media]'));
    displayMediaTexts(texts);

    sheetDataName = barbaContainer.dataset.namespace;
    audioList = barbaContainer.querySelector('#audio-list');
    videoList = barbaContainer.querySelector('#video-list');
    galleryColumns = Array.from(barbaContainer.querySelectorAll('.image-column'));

    audioList.innerHTML = '';
    videoList.innerHTML = '';
    galleryColumns.forEach(column => column.innerHTML = '');
    images = [];

    const mediaData = await getMediadata();
    await populateMediaLists(mediaData);

    appendSVGs(barbaContainer);
}

export function displayMediaTexts(texts) {
    texts.forEach(text => displayText(text));
}

function displayText(text) {
    const translatedText = getTranslatedText(text);
    text.innerText = translatedText;
}

function getTranslatedText(text) {
    const language = getSelectedLanguage();
    const textData = [language, ...text.dataset.media.split('-')];
    return getTranslation(mediaTexts, textData);
}

async function getMediadata() {
    const cacheKeys = {
        cachedData: `cache_${sheetDataName}`,
        cachedTime: `cache_time_${sheetDataName}}`
    };
    const data = await fetchSheetsData(mediaSheetURL, cacheKeys);

    if (!data || data.length === 0) {
        return [];
    }

    return data;
}

async function populateMediaLists(mediaData) {
    if (!mediaData) return;

    for (const data of mediaData) {
        await appendMedia(data);
    }

    const shuffledImages = shuffle(images);
    for (const image of shuffledImages) {
        appendImage(image);
    }
}

async function appendMedia(data) {
    if (data.media === 'image') {
        const image = await getImageElement(data.link);
        images.push(image);
        return;
    }

    const mediaElement = getMediaElement(data);
    if (data.media === 'audio') audioList.appendChild(mediaElement)
    else if (data.media === 'video') videoList.appendChild(mediaElement);
}

function getMediaElement(data) {
    if (data.media === 'image') return getImageElement(data.link)
    else return getIframe(data);
}

async function getImageElement(link) {
    return new Promise((resolve, reject) => {
        const image = document.createElement('img');
        image.classList.add('media-image');

        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', reject);

        image.src = link;
        image.classList.add('media');
    });
}

function getIframe(data) {
    const { link } = data;
    const platform = getPlatform(data);
    const template = platformParsers[platform].template;

    let mediaSrc;

    if (platform === 'youtube') {
        mediaSrc = `https://www.youtube.com/embed/${link.match(platformParsers[platform].regex)[0]}`;
    } else if (platform === 'tidal') {
        mediaSrc = `https://embed.tidal.com/albums/${link.match(platformParsers[platform].regex)[1]}`;
    } else if (platform === 'bandcamp') {
        mediaSrc = `https://bandcamp.com/EmbeddedPlayer/${link.match(platformParsers[platform].regex)[0]}/size=large/bgcol=ffffff/linkcol=0687f5/transparent=true/`;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');
    const iframe = doc.querySelector('iframe');

    if (!iframe) return null;

    iframe.src = mediaSrc;
    iframe.classList.add('media');

    return iframe;
}

function getPlatform(data) {
    const { media, link } = data;

    for (const type of mediaTypes[media]) {
        if (link.includes(type)) return type.replace('.', '');
    }

    return '';
}

function appendImage(image) {
    if (images.length >= 3) {
        appendMasonry(image);
    } else {
        galleryColumns[1].appendChild(image);
    }
}

function appendMasonry(image) {
    const smallest = getSmallestColumn();
    smallest.appendChild(image);
}

function getSmallestColumn() {
    const bias = 100;
    const middleIndex = Math.floor(galleryColumns.length / 2);
    let smallest = { value: Infinity, index: null };

    galleryColumns.forEach((column, i) => {
        const height = i === middleIndex ? column.offsetHeight - bias : column.offsetHeight;

        if (height < smallest.value) {
            smallest.value = height;
            smallest.index = i;
        }
    })

    return galleryColumns[smallest.index];
}

function appendSVGs(barbaContainer) {
    const arrowContainers = barbaContainer.querySelectorAll('.arrow-container');
    arrowContainers.forEach(container => container.innerHTML = svgArrow);
}

export function initMediaAnimations(container) {
    clearMediaAnimations();
    document.fonts.ready.then(() => {
        initSubheaderAnim(container);
        initMediaItemsAnim(container);
    })
}

export function clearMediaAnimations() {
    ScrollTrigger.getAll().forEach(st => st.kill());
}

function initSubheaderAnim(container) {
    const subheaderText = Array.from(
        container.querySelectorAll('[data-media]')
    )

    subheaderText.forEach(text => {
        const arrow = text.parentNode.querySelector('.arrow');

        gsap.set(text, { opacity: 1 });
        gsap.set(arrow.parentNode, { opacity: 1 });
        gsap.set(arrow, { drawSVG: 0 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: text,
                start: "top 90%",
                once: true
            }
        });

        tl
            .from(text, {
                duration: 0.5,
                ease: 'power2.out',
                opacity: 0,
                xPercent: -35,
            })
            .to(arrow, {
                duration: 1,
                ease: 'power3.inOut',
                drawSVG: '100%',
            }, "-=0.2")
    })
}

function initMediaItemsAnim(container) {
    const items = container.querySelectorAll('.media');

    items.forEach(item => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                once: true
            }
        });

        tl.from(item, {
            duration: 0.6,
            ease: 'power2.out',
            yPercent: 35
        })
        tl.to(item, {
            duration: 0.6,
            ease: 'power2.out',
            opacity: 1
        }, 0)
    })
}