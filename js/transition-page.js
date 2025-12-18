export default async function transitionPage(next) {
    const title = next.container.querySelector('.section-title');console.log(title)
    const tl = gsap.timeline();

    document.fonts.ready.then(() => {
        let split = SplitText.create(title, { type: 'chars', mask: 'chars' });
        const path = title.parentNode.querySelector('path');
        const selector = title.parentNode.querySelector('.selector');

        tl
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

    return tl;
}