import { fetchSheetsData } from "./home.js";

export const mediasSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=129671728&single=true&output=csv';
const mediaTypes = {
    audio: ['tidal', 'bandcamp'],
    video: ['youtu.be']
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

let sheetDataName;
let audioList, videoList, imageList;

export default async function initMedias(barbaContainer) {
    sheetDataName = barbaContainer.dataset.namespace;
    audioList = barbaContainer.querySelector('[data-medias="audio"]');
    videoList = barbaContainer.querySelector('[data-medias="video"]');
    imageList = barbaContainer.querySelector('[data-medias="image"]');

    audioList.innerHTML = '';
    videoList.innerHTML = '';
    imageList.innerHTML = '';

    const mediasData = await getMediasdata(); console.log(mediasData)
    await populateMediasLists(mediasData);
}

async function getMediasdata() {
    const cacheKeys = {
        cachedData: `cache_${sheetDataName}`,
        cachedTime: `cache_time_${sheetDataName}}`
    };
    const data = await fetchSheetsData(mediasSheetURL, cacheKeys);

    if (!data || data.length === 0) {
        return [];
    }

    return data;
}

async function populateMediasLists(mediasData) {
    if (!mediasData) return;

    for (const data of mediasData) {
        appendMedia(data);
    }
}

function appendMedia(data) {
    const mediaElement = getMediaElement(data);

    if (data.media === 'audio') audioList.appendChild(mediaElement)
    else if (data.media === 'video') videoList.appendChild(mediaElement);
    else if (data.media === 'image') imageList.appendChild(mediaElement);
}

function getMediaElement(data) {
    if (data.media === 'image') return getImageElement(data.link)
    else return getIframe(data);
}

function getImageElement(link) {
    const image = document.createElement('img');
    image.src = link;
    image.classList.add('media-image');

    return image;
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

    return iframe;
}

function getPlatform(data) {
    const { media, link } = data;

    for (const type of mediaTypes[media]) {
        if (link.includes(type)) return type.replace('.', '');
    }

    return '';
}