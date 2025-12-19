export default function transitionPage(next) {
    window.scrollTo(0, 0);

    if (next.container.dataset.namespace === 'index') {
        const titleJavier = next.container.querySelector("#title-javier");
        const titleRojo = next.container.querySelector("#title-rojo");

        return gsap.timeline()
            .to(titleRojo, { rotate: 0, duration: 0, transformOrigin: '0% 100%' })
            .to(titleJavier, { yPercent: 600, duration: 1, ease: 'elastic.out(1, 0.6)' }, 0.3)
            .to(titleRojo, { yPercent: 600, duration: 1, ease: 'elastic.out(1, 0.5)' }, '<0.1')
            .to('#home-image-foreground', { opacity: 1, duration: 1 }, '<0.2')
            .to(titleRojo, { rotate: 8, duration: 2, ease: 'elastic.out(1, 0.15)' }, '<0')
            .from(titleJavier.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<0')
            .from(titleRojo.querySelector('path'), { drawSVG: 0, duration: 0.5, ease: 'power1.inOut' }, '<0')
            .to('#home-image-background', { opacity: 1, duration: 1 }, '<0')
    } else {
        const title = next.container.querySelector('.section-title');
        const path = title.parentNode.querySelector('path');
        const selector = title.parentNode.querySelector('.selector');

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
            .set(selector, { opacity: 1 }, '-=0.3')
            .from(path, { drawSVG: 0, duration: 0.5 }, '-=0.3');
    }
}
