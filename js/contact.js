import { getSelectedLanguage, getTranslation } from "./translation.js";
import { waitForSelector } from "./biography.js";

const contactTexts = {
    en: {
        header: {
            one: 'something in mind?',
            two: 'get in touch.'
        },
        label: {
            one: 'name',
            two: 'email',
            three: 'subject',
            four: 'message'
        },
        option: {
            one: 'What is it about?',
            two: 'Booking',
            three: 'Teaching',
            four: 'Collaboration',
            five: 'Press',
            six: 'Other'
        },
        button: 'send'
    },
    es: {
        header: {
            one: '¿algo en mente?',
            two: 'ponte en contacto.'
        },
        label: {
            one: 'nombre',
            two: 'correo electrónico',
            three: 'asunto',
            four: 'mensaje'
        },
        option: {
            one: '¿De qué se trata?',
            two: 'Contratación',
            three: 'Enseñanza',
            four: 'Colaboración',
            five: 'Prensa',
            six: 'Otro'
        },
        button: 'enviar'
    }
}

export default async function initContact(barbaContainer) {
    const texts = Array.from(barbaContainer.querySelectorAll('[data-contact]'));
    displayContactTexts(texts);
}

export function displayContactTexts(texts) {
    texts.forEach(text => displayText(text));
}

function displayText(text) {
    const translatedText = getTranslatedText(text);

    if (text.tagName === 'INPUT' || text.tagName === 'TEXTAREA') {
        text.placeholder = translatedText;
    } else {
        text.innerText = translatedText;
    }
}

function getTranslatedText(text) {
    const language = getSelectedLanguage();
    const textData = [language, ...text.dataset.contact.split('-')];
    return getTranslation(contactTexts, textData);
}

export function initContactAnimations(container) {
    clearContactAnimations();
    document.fonts.ready.then(() => {
        initHeaderAnim(container);
        setTimeout(() => {
            initSVGAnim(container)
        }, 50)
    });
}

export function clearContactAnimations() {
    ScrollTrigger.getAll().forEach(st => st.kill());
}

function initHeaderAnim(container) {
    const headerText = Array.from(
        container.querySelectorAll('[data-contact]')
    ).find(el => el.dataset.contact === 'header-two');
    
    const split = SplitText.create(headerText, {
        type: "words"
    });
    
    let chars = [];
    split.words.forEach(word => {
        const charSplit = SplitText.create(word, { type: "chars" });
        chars.push(...charSplit.chars);
    });
    
    gsap.set(split.words, { whiteSpace: "nowrap" });
    gsap.set(headerText, { opacity: 1 });
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: headerText,
            start: "top 70%",
            once: true
        }
    });
    
    const sentence = chars.slice(0, chars.length - 1);
    const dot = chars[chars.length - 1];
    
    tl
      .from(sentence, {
          duration: 1,
          opacity: 0,
          stagger: {
              each: 0.03
          }
      })
      .from(dot, {
          duration: 0.7,
          opacity: 0
      }, "-=0.4");
}

export async function initSVGAnim(container) {
    const path = await waitForSelector(container.querySelector('.selector-contact'), 'path');
    const start = container.querySelector('#svg-start');
    const end = Array.from(container.querySelectorAll('[data-contact]')).find(el => el.dataset.contact === 'button');
    const distance = end.getBoundingClientRect().bottom - start.getBoundingClientRect().top;
    const button = container.querySelector('button');

    gsap.set(path, { drawSVG: 0, strokeWidth: 2 });
    gsap.to(path, {
        drawSVG: "100%",
        scrollTrigger: {
            trigger: start,
            start: "top center",
            end: '+=' + distance + 50,
            scrub: 1,
            onLeave: () => {
                gsap.to(button, {
                    duration: 0.3,
                    border: '8px solid var(--color-blue)'
                })
            },
            onEnterBack: () => {
                gsap.to(button, {
                    duration: 0.3,
                    border: '8px solid transparent'
                })
            }
        }
    });
}