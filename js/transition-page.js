import { moveArrow } from "./home.js";

export default function transitionPage(next) {
    window.scrollTo(0, 0);

    if (next.container.dataset.namespace === 'index') {
        console.log('index')
        const homeImages = next.container.querySelectorAll('.home-image'); console.log('images:', homeImages)
        const homeTitles = next.container.querySelectorAll('.home-title');
        const clickSVG = next.container.querySelector('.click');
        const path = next.container.querySelector('.click path');
        const clickText = next.container.querySelector('#click-text');
        const overlay = next.container.querySelector('#home-image-overlay');

        const split = SplitText.create(clickText, { type: 'words, chars', mask: 'chars' });

        gsap.set(path, { drawSVG: 0 });
        gsap.set(clickText, { opacity: 1 });

        return gsap.timeline()
            .to(next.container, { opacity: 0, duration: 0 })
            .to(homeImages, { opacity: 0, duration: 0 }, 0)
            .to(next.container, { opacity: 1, duration: 0 })
            .to(homeImages, { opacity: 1, duration: 1 })
            .to(overlay, { backdropFilter: "blur(5px) brightness(0.1)", duration: 1 }, 0.5)
            .to(homeTitles, { opacity: 1, duration: 1 })
            .to(clickSVG, { opacity: 1, duration: 0 })
            .to(path, { drawSVG: '100%', duration: 0.5 })
            .fromTo(split.chars, { opacity: 0, xPercent: -50 }, {
                opacity: 1,
                xPercent: 0,
                duration: 1,
                stagger: { each: 0.07 }
            });
    } else {
        const title = next.container.querySelector('.section-title');
        const split = SplitText.create(title, {
            type: 'chars',
            mask: 'chars'
        });

        return gsap.timeline()
            .to(next.container, { xPercent: 0, duration: 0.7, ease: 'power3.out' })
            .from(split.chars, {
                yPercent: -100,
                stagger: {
                    amount: 0.1,
                    from: 'random'
                },
                ease: 'back.out(2)'
            })
    }
}
