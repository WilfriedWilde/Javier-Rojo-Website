import { initPressCarousel } from './press.js';

export default async function initHome() {
    initPressCarousel();
}

export function introHomeAnimation() {
    const titleJavier = document.getElementById("title-javier");
    const titleRojo = document.getElementById("title-rojo");

    const introTimeline = gsap.timeline();
    introTimeline
        .set('#navbar', { opacity: 0 })
        .to(titleRojo, {rotate: 0, duration: 0, transformOrigin: '0% 100%'})
        .from(titleJavier, { yPercent: -600, zIndex: -1, duration: 0.5, ease: 'back.out(1.5)' }, 1)
        .from(titleRojo, { yPercent: -600, zIndex: -1, duration: 0.5, ease: 'back.out(1.5)' }, '<0.3')
        .to(titleRojo, {rotate: 8, duration: 2, ease: 'elastic.out(1, 0.15)'}, '<1.5')
        .from('#home-image-foreground', { opacity: 0, duration: 1 }, '<0.5')
        .from(titleJavier.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<1')
        .from(titleRojo.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<0.3')
        .from('#home-image-background', { opacity: 0, duration: 2 }, '<1')
}