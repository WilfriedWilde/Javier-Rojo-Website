import { fetchSVG } from "./svg.js";

export async function initTransition(nextNamespace) {
    const icon = await fetchSVG(`./icons/${nextNamespace}.svg`);
    appendTransitionIcon(icon);
}

function appendTransitionIcon(icon) {
    const container = document.getElementById('transition-icon-container');
    container.innerHTML = icon;
}

export const animateTransition = {
    in: animateTransitionIn,
    out: async (next) => animateTransitionOut(next)
}

export function animateTransitionIn() {
    const transitionIn = gsap.timeline();
    transitionIn
        .set('#transition-overlay', { zIndex: 20 })
        .set('#transition-overlay-svg', { opacity: 1 })
        .set('#transition-icon-container', { display: 'block', xPercent: -500, zIndex: 21, left: '50%' })
        .from('#transition-overlay-svg-path', { drawSVG: "0% 0%", duration: 1.5 })
        .to('#transition-icon-container', { xPercent: 0, duration: 0.5, ease: 'back.out(1.5)' }, '<0.8')
    return transitionIn;
}

export async function animateTransitionOut(next) {
    const transitionOut = gsap.timeline();
    transitionOut
        .to({}, { duration: 2 })
        .to('#transition-icon-container', { xPercent: 500, duration: 0.5, ease: 'back.in(1.5)', display: 'none'})
        .to('#transition-overlay-svg-path', {
            drawSVG: '100% 100%',
            duration: 1.5,
        }, '<-0.2')
        .to('#transition-overlay', { zIndex: -10, duration: 0 })
        .to('#transition-overlay-svg', { opacity: 0, duration: 0 })
        .to('#transition-icon-container', { zIndex: -10, duration: 0 })

    const title = next.container.querySelector('.section-title') || '';
    if (title) {
        document.fonts.ready.then(() => {
            let split = SplitText.create(title, { type: 'chars', mask: 'chars' });
            const path = title.parentNode.querySelector('path');
            const selector = title.parentNode.querySelector('.selector');

            transitionOut
                .from(split.chars, {
                    yPercent: -100,
                    stagger: {
                        amount: 0.1,
                        from: 'random'
                    },
                    ease: 'back.out(2)'
                }, '-=0.8')
                .set(selector, { opacity: 1 }, '-=0.5')
                .from(path, { drawSVG: 0, duration: 0.5 }, '-=0.5');
        })
    };
    return transitionOut;
}