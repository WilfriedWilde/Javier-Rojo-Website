import { fetchSheetsData } from "./home.js";

export const mediasSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ5KRWUtYBv62ZMIt9JBbiE4jykThuTOZN68BEzM48HSDjxqutLLy8aGURisHvVdiXnRjQ3UA1nqpJE/pub?gid=129671728&single=true&output=csv';
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
        template: `<iframe class="media-bandcamp" seamless></iframe>`,
        regex: /album=[0-9]+/g
    }
};

let sheetDataName;
let audioList, videoList;

export default async function initMedias(barbaContainer) {
    sheetDataName = barbaContainer.dataset.namespace;
    audioList = barbaContainer.querySelector('[data-medias="audio"]');
    videoList = barbaContainer.querySelector('[data-medias="video"]');

    audioList.innerHTML = '';
    videoList.innerHTML = '';

    const mediasData = await getMediasdata();
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
    if (data.platform === 'youtube') videoList.appendChild(mediaElement)
    else audioList.appendChild(mediaElement);
}

function getMediaElement(data) {
    const { platform, link } = data;
    const template = platformParsers[platform].template;
    let mediaSrc;

    if (platform === 'youtube') {
        mediaSrc = `https://www.youtube.com/embed/${link.match(platformParsers[platform].regex)[0]}`;
    } else if (platform === 'tidal') {
        mediaSrc = `https://embed.tidal.com/albums/${link.match(platformParsers[platform].regex)[1]}`;
    } else if (platform === 'bandcamp') {
        mediaSrc = `https://bandcamp.com/EmbeddedPlayer/${link.match(platformParsers[platform].regex)[0]}/size=large/bgcol=ffffff/linkcol=0687f5/minimal=true/transparent=true/`;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(template, 'text/html');
    const iframe = doc.querySelector('iframe');

    if (!iframe) return null;

    iframe.src = mediaSrc;

    return iframe;
}