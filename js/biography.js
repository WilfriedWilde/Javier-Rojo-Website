import { getSelectedLanguage, getTranslation } from "./translation.js";

const biographyTexts = {
    en: {
        header: {
            one: 'Born in Guadalajara in 1999 and currently based in Basel (Switzerland), Javier is a young and talented...',
            two: 'saxophonist',
            three: 'clarinetist',
            four: 'composer'
        },
        highlights: {
            one: 'Despite his young age, Javier has shared the stage with renowned artists such as:',
            two: 'performing at festivals in:',
            three: 'Switzerland, Austria, Canada',
            four: 'and across the Spanish scene, including festivals in:',
            five: 'as well as venues such as:'
        },
        journey: `<p>Javier’s journey as a musician and composer reflects his unwavering dedication and humble approach to music.</p><p>With every step he takes in his career, he strives to explore new horizons and continuously refine his craft.</p><p>His commitment to excellence and genuine passion for music propel him forward toward a promising future full of exciting projects and new musical discoveries.</p>`,
        studies: {
            one: `In August 2024, Javier completed his Master’s degree in Performance at Jazzcampus in Basel, studying under <span class="bio-highlight-name">Mark Turner</span> and <span class="bio-highlight-name">Chris Cheek</span>, along with other renowned artists such as:`,
            two: 'Previously, he lived in Barcelona for five years, where he studied with prominent musicians including:',
            three: `Since September 2024, he has been pursuing a Master’s degree in Composition under the guidance of <span class="bio-highlight-name">Guillermo Klein</span> at Jazzcampus.`,
        },
        work: {
            one: 'With exceptional interpretative skills and tireless creativity, Javier decided to forge his own path and lead his own musical projects...',
            two: `In 2025, he released his debut album as a bandleader<a href="https://tidal.com/album/396369024" class="bio-highlight-album">Música Para Amansar Fieras</a>under the prestigious <a href="https://www.freshsoundrecords.com/javier-rojo-albums/57428-musica-para-amansar-fieras.html" class="bio-highlight-label">Fresh Sound Records</a> label.`,
            three: 'He is currently immersed in a creative process focused on composition while continuing to grow as a performer, writing music for large ensembles, big bands, orchestral formations with strings, and film scores, while continuing to lead his own groups such as his quintet and sextet, with which he plans to record his second album in early 2026.',
        },
        sideman: 'Rojo also performs as a sideman in projects such as:'
    },
    es: {
        header: {
            one: 'Nacido en Guadalajara en 1999 y actualmente residiendo en Basilea (Suiza), Javier es un joven talentoso...',
            two: 'saxofonista',
            three: 'clarinetista',
            four: 'compositor'
        },
        highlights: {
            one: 'A pesar de su corta edad, Javier ha compartido escenario con artistas de renombre como:',
            two: 'actuando en festivales en:',
            three: 'Suiza, Austria, Canadá',
            four: 'y dentro de la escena española en festivales como los de:',
            five: 'y en salas como:'
        },
        journey: `El viaje de Javier como músico y compositor es un reflejo de su dedicación inquebrantable y su humilde enfoque hacia la música.<br>Con cada paso que da en su carrera, busca explorar nuevos horizontes y refinar continuamente su arte.<br>Su compromiso con la excelencia y su genuina pasión por la música lo impulsan hacia adelante, llevándolo hacia un futuro prometedor lleno de emocionantes proyectos y nuevos descubrimientos musicales.`,
        studies: {
            one: `En agosto de 2024 Javier finalizó su Máster en Interpretación en el Jazzcampus de Basilea, bajo la tutela de <span class="bio-highlight-name">Mark Turner</span> y <span class="bio-highlight-name">Chris Cheek</span>, junto con otros artistas renombrados como:`,
            two: 'Previamente Javier vivió cinco años en Barcelona, donde tuvo como maestros a músicos de la talla de:',
            three: `Desde septiembre de 2024, se encuentra sumergido en el Máster de Composición bajo la tutela de <span class="bio-highlight-name">Guillermo Klein</span> en el Jazzcampus.`,
        },
        work: {
            one: 'Con unas habilidades interpretativas excepcionales y una creatividad incansable, Javier decidió forjar su propio camino y liderar sus propios proyectos musicales...',
            two: `En 2025, lanzó su primer álbum como líder<a href="https://tidal.com/album/396369024" class="bio-highlight-album">Música Para Amansar Fieras</a>con el reconocido sello <a href="https://www.freshsoundrecords.com/javier-rojo-albums/57428-musica-para-amansar-fieras.html" class="bio-highlight-label">Fresh Sound Records.</a>`,
            three: 'Actualmente se encuentra inmerso en un proceso creativo centrado en la composición a la vez que se desarrolla como intérprete, escribiendo música para grandes ensembles, big band, formaciones orquestales con cuerdas y bandas sonoras de cine, mientras continúa liderando sus propios grupos como el quinteto y el sexteto, con quién grabará su segundo álbum a principios de 2026.',
        },
        sideman: 'Rojo actúa como sideman en proyectos como:'
    }
}

const biographyGalleryURLS = [
    './images/sextet/sextet_close.webp',
    './images/sextet/sextet_far.webp',
    './images/sextet/sextet_inside.webp',
    './images/sextet/sextet_line.webp'
];
let gallery;

export default function initBiography(barbaContainer) {
    const texts = Array.from(barbaContainer.querySelectorAll('[data-biography]'));
    const ands = Array.from(barbaContainer.querySelectorAll('.and'));
    gallery = barbaContainer.querySelector('#biography-sextet-gallery');

    displayBiographyTexts(texts, ands);
    initBiographyGallery();
}

export function displayBiographyTexts(texts, ands) {
    displayBiographyCommonTexts(texts);
    displayBiographyAnds(ands);
}

function displayBiographyCommonTexts(texts) {
    texts.forEach(text => displayText(text))
}

function displayText(text) {
    const translatedText = translateCommonText(text);
    text.innerHTML = translatedText;
}

function translateCommonText(text) {
    const language = getSelectedLanguage();
    const textData = [language, ...text.dataset.biography.split('-')] || [language, text.dataset.biography];
    return getTranslation(biographyTexts, textData);
}

function displayBiographyAnds(ands) {
    ands.forEach(and => displayAnd(and))
}

function displayAnd(and) {
    const language = getSelectedLanguage();
    and.textContent = language === 'en' ? 'and' : 'y';
}

function initBiographyGallery() {
    biographyGalleryURLS.forEach((url, i) => appendBiographyGalleryImage(url, i));
}

function appendBiographyGalleryImage(url, index) {
    const image = getImage(url, index);
    gallery.appendChild(image);
}

function getImage(url, index) {
    const image = document.createElement('img');
    image.classList.add('biography-gallery-image');
    image.src = url;

    const operator = index % 2 === 0 ? '+' : '-';
    const distance = window.innerWidth / 2;
    const rotation = getRandomRotation();

    image.style.transform = `translate(-50%, ${index * distance}px) rotate(${operator}${rotation}deg)`;

    return image;
}

function getRandomRotation() {
    const maxRotation = 10;
    return Math.floor(Math.random() * maxRotation);
}