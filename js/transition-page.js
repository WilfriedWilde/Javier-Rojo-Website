export default function transitionPage(next) {
    window.scrollTo(0, 0);

    if (next.container.dataset.namespace === 'index') {
        console.log('index')
        const homeTitleContainer = container.querySelectorAll('#home-title-container');
        const foreground = container.querySelectorAll('#home-image-foreground');
        const navbar = document.getElementById('navbar');
        const lastNews = container.querySelector('#last-news-container');

        return gsap.timeline()
            .to(homeTitleContainer, { opacity: 0, duration: 1 })
            .to(homeTitleContainer, { zIndex: -1, opacity: 0, duration: 0 })
            .to(foreground, { opacity: 0, duration: 1 }, 0.5)
            .to(navbar, { opacity: 1, stagger: { amount: 0.2 } }, 1)
            .to(homeTitleContainer, { yPercent: -100, duration: 0 })
            .to(lastNews, { zIndex: 3, duration: 0 })
            .fromTo(lastNews,
                { opacity: 0, yPercent: 30 },
                { opacity: 1, yPercent: 0, duration: 0.8, ease: 'power2.in' }
            )
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
