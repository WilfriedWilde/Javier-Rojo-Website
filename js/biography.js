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
        journey: `<p>El viaje de Javier como músico y compositor es un reflejo de su dedicación inquebrantable y su humilde enfoque hacia la música.</p><p>Con cada paso que da en su carrera, busca explorar nuevos horizontes y refinar continuamente su arte.</p><p>Su compromiso con la excelencia y su genuina pasión por la música lo impulsan hacia adelante, llevándolo hacia un futuro prometedor lleno de emocionantes proyectos y nuevos descubrimientos musicales.</p>`,
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

export default async function initBiography(barbaContainer) {
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

export function initBiographyAnimations(container) {
    document.fonts.ready.then(() => {
        initHeaderAnim(container);
        initHighlightsAnim(container);
        initJourneyAnim(container);
        initStudiesAnim(container);
        initWorkAnim(container);
        initSidemanAnim(container);
    });
}

function initHeaderAnim(container) {
    const imageHeader = container.querySelector('#biography-header img');
    gsap.to(imageHeader, {
        scrollTrigger: {
            trigger: imageHeader,
            start: '40% center',
            scrub: 1,
            pin: true,
            pinSpacing: true
        },
        scale: 0.5,
    })

    const checkHeaderSelector = setInterval(() => {
        const path = document.querySelector('#biography-header-text-container path');
        if (path) {
            clearInterval(checkHeaderSelector);

            const instruments = container.querySelector('#biography-header-instruments');
            const instrumentsWidth = instruments.getBoundingClientRect().width;
            const selector = path.parentNode.parentNode;

            gsap.set(selector, { width: instrumentsWidth });

            const instrumentsTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: instruments,
                    start: 'top 80%',
                }
            })
            let split = SplitText.create(instruments, { type: 'words', mask: 'words' });

            instrumentsTimeline
                .from(split.words, {
                    stagger: {
                        amount: 0.5,
                        ease: 'power1.in'
                    },
                    yPercent: -100,
                })
                .from(path, { drawSVG: 0, strokeWidth: 0, duration: 1, ease: 'power1.out' })
        }
    }, 50);
}

function initHighlightsAnim(container) {
    const highlights = Array.from(container.querySelectorAll('.biography-highlights-text'));
    highlights.forEach(highlight => {
        const list = highlight.children[1];
        const split = SplitText.create(list, { type: 'lines' });

        gsap.from(split.lines, {
            scrollTrigger: {
                trigger: list,
                start: 'top 70%'
            },
            stagger: {
                amount: 1,
                ease: 'power1.in'
            },
            opacity: 0
        })
    });

    const imageHighlights = container.querySelector('#biography-highlights img');
    gsap.to(imageHighlights, {
        scrollTrigger: {
            trigger: imageHighlights,
            start: '40% center',
            scrub: 1,
            pin: true,
            pinSpacing: true
        },
        scale: 0.5
    })
}

function initJourneyAnim(container) {
    const journeyParagraphs = Array.from(container.querySelectorAll('#biography-journey p'));
    journeyParagraphs.forEach(paragraph => {
        const split = SplitText.create(paragraph, { type: 'words' });

        gsap.from(split.words, {
            scrollTrigger: {
                trigger: paragraph,
                start: 'center center',
                scrub: 1,
                pin: true,
                pinSpacing: true
            },
            stagger: {
                each: 0.1
            },
            opacity: 0,
        })
    })
}

function initStudiesAnim(container) {
    const studies = Array.from(container.querySelectorAll('.studies'));
    studies.forEach(study => {
        const list = study.children[1];
        const split = SplitText.create(list, { type: 'lines' });

        gsap.from(split.lines, {
            scrollTrigger: {
                trigger: list,
                start: 'top 70%'
            },
            stagger: {
                amount: 1,
                ease: 'power1.in'
            },
            opacity: 0
        })

        const checkStudySelector = setInterval(() => {
            const path = study.querySelector('path');
            if (path) {
                clearInterval(checkStudySelector);
                gsap.from(path, {
                    scrollTrigger: {
                        trigger: study,
                        start: 'top 80%',
                    },
                    drawSVG: 0,
                    strokeWidth: 0,
                    duration: 1,
                    ease: 'power1.out'
                })
            }
        }, 50);
    });

    const imageStudies = container.querySelector('#biography-studies img');
    gsap.to(imageStudies, {
        scrollTrigger: {
            trigger: imageStudies,
            start: '30% center',
            scrub: 1,
            pin: true,
            pinSpacing: true
        },
        scale: 0.5
    })

}

function initWorkAnim(container) {
    const workParagraphs = Array.from(container.querySelectorAll('#biography-work p'));
    workParagraphs.forEach(paragraph => {
        if (paragraph.dataset.biography === 'work-two') {
            const split = SplitText.create(paragraph, { type: 'words', masks: 'words' });
            gsap.from(split.words, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'center center',
                    pin: true,
                    scrub: true,
                    pinSpacing: true
                },
                stagger: {
                    from: 'start',
                    each: 0.5
                },
                opacity: 0
            })
        } else {
            gsap.from(paragraph, {
                scrollTrigger: {
                    trigger: paragraph,
                    start: 'top 80%'
                },
                opacity: 0,
                duration: 1,
                ease: 'power1.in'
            })
        }
    })

    const gallery = container.querySelector('#biography-sextet-gallery');
    const checkGallery = setInterval(() => {
        const images = Array.from(gallery.querySelectorAll('img'));
        if (images.length > 0) {
            clearInterval(checkGallery);
            images.forEach((image, index) => {
                const x = index % 2 === 0 ? -200 : 200;
                const r = index % 2 === 0 ? -90 : 90;
                gsap.from(image, {
                    scrollTrigger: {
                        trigger: image,
                        start: 'top 70%',
                    },
                    xPercent: x,
                    rotate: r,
                    duration: 1,
                    ease: 'back.out(1.5)'
                })
            })
        }
    }, 50);
}

function initSidemanAnim(container) {
    const checkSidemanSelector = setInterval(() => {
        const path = container.querySelector('#biography-sideman path');
        if (path) {
            clearInterval(checkSidemanSelector);
            gsap.from(path, {
                scrollTrigger: {
                    trigger: path,
                    start: 'top 80%',
                },
                drawSVG: 0,
                strokeWidth: 0,
                duration: 1,
                ease: 'power1.out'
            })
        }
    }, 50);
}