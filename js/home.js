import { initPressCarousel } from './press.js';

export default async function initHome() {
    initPressCarousel();
}

export function introHomeAnimation() {
    const titleJavier = document.getElementById("title-javier");
    const titleRojo = document.getElementById("title-rojo");

    const introTimeline = gsap.timeline();
    introTimeline
        .to(titleRojo, {rotate: 0, duration: 0, transformOrigin: '0% 100%'})
        .to(titleJavier, { yPercent: 600, duration: 1, ease: 'elastic.out(1, 0.6)' }, 1)
        .to(titleRojo, { yPercent: 600, duration: 1, ease: 'elastic.out(1, 0.5)' }, '<0.3')
        .to('#home-image-foreground', { opacity: 1, duration: 1 }, '<0.5')
        .to(titleRojo, {rotate: 8, duration: 2, ease: 'elastic.out(1, 0.15)'}, '<1.5')
        .from(titleJavier.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<1')
        .from(titleRojo.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<0.3')
        .to('#home-image-background', { opacity: 1, duration: 2 }, '<1')
}