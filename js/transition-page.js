export default function transitionPage(next) {
    const title = next.container.querySelector('.section-title');
    if (!title) return;

    const path = title.parentNode.querySelector('path');
    const selector = title.parentNode.querySelector('.selector');

    const split = SplitText.create(title, {
        type: 'chars',
        mask: 'chars'
    });

    const tl = gsap.timeline();

    tl.from(split.chars, {
        yPercent: -100,
        stagger: {
            amount: 0.1,
            from: 'random'
        },
        ease: 'back.out(2)'
    })
    .set(selector, { opacity: 1 }, '-=0.4')
    .from(path, { drawSVG: 0, duration: 0.5 }, '-=0.4');

    return tl;
}
