document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, ScrollSmoother, SplitText, TextPlugin)

});

const reviews = [
    { source: 'Jazz Magazine (FR)', review: 'Revelation!' },
    { source: 'Jazz Weekly (US)', review: 'Brings fresh ideas to the post bop genre.' },
    { source: 'Jazzwise (UK)', review: 'Rojo may be in his mid-twenties but already he is in his element with maturity and purpose.' },
    { source: 'NRW Jazz (DE)', review: "A fine, contemporary jazz record… the swing is relaxed, the boppy passages are driving, the ballads are tender and emotional - Rojo's own compositions have a lot to offer." },
    { source: 'Jazzmania (BE)', review: "Jordi Pujol, head of the Fresh Sound New Talent label, knows damn well who to give a chance to. With this Javier Rojo and his sextet, it's clearly a successful move." },
    { source: 'Jazzflits (NL)', review: 'Energetic, playful, and pleasantly sentimental' },
    { source: 'PJ Portrait in Jazz (JP)', review: 'Straight-ahead energy characteristic of young musicians, making it a refreshing listen.' },
    { source: 'Esensja (PL)', review: 'Javier Rojo – remember this artist!' },
    { source: 'Jazz Views (UK)', review: 'These guys are having real musical conversations.' },
    { source: 'Blue in Green (UK)', review: "The musical embodiment of wearing one's heart on their sleeve." },
    { source: 'Era Jazzu (PL)', review: 'A perfect showcase for the young European jazz scene.' },
];

let previousReview = null;

export function initPressCarousel() {
    if (document.getElementById('press-carousel').children.length > 1) return;

    for (let i = 0; i < reviews.length; i++) {
        const pressReview = getRandomDifferentReview(i);
        appendPressReview(pressReview);
    }
    setCarouselAnimations();
}

function getRandomDifferentReview(index) {
    let review;

    if (!previousReview) {
        review = reviews[Math.floor(Math.random() * reviews.length)];
    }
    else {
        do {
            review = reviews[Math.floor(Math.random() * reviews.length)];
        } while (review === previousReview || review === reviews[index]);
    }

    previousReview = review;
    return review;
}

function appendPressReview(pressReview) {
    const pressCarousel = document.getElementById('press-carousel');
    const template = `
    <div class="review-content">
        <p class="review-container">"${pressReview.review}"</p>
        <p class="source-container">&mdash; ${pressReview.source}</p>
    </div>
    `;

    const pressReviewContainer = document.createElement('div');
    pressReviewContainer.classList.add('press-review-container');
    pressReviewContainer.innerHTML = template;

    pressCarousel.appendChild(pressReviewContainer);
}

/* ANIMATIONS */
let homeScrollHandler = null;
let homeSmoother = null;
let homeScrollTriggers = [];

export function setCarouselAnimations() {
    const pressCarousel = document.getElementById("press-carousel");
    const homeOverlay = document.getElementById("home-image-overlay");
    const homeImages = document.querySelectorAll(".home-image");
    const sections = gsap.utils.toArray(".press-review-container");
    const navbarListSections = document.getElementById('navbar-list-sections');

    if (!pressCarousel || !homeOverlay || homeImages.length === 0) return;

    let lastY = 0, isNavbarDisplayed = true;

    // Store scroll listener
    homeScrollHandler = () => {
        if (lastY > window.scrollY) {


            gsap.to(homeOverlay, { backdropFilter: "blur(0px) brightness(1)", duration: 0.5, overwrite: true });
            gsap.to(homeImages, { transform: "translate(-50%, -50%) scale(1)", scale: 1, duration: 0.3, overwrite: true });
            gsap.to(pressCarousel, { opacity: 0, duration: 0.2, overwrite: true });

            if (!isNavbarDisplayed) {
                isNavbarDisplayed = true;

                gsap.to(navbarListSections.children, {
                    opacity: 0,
                    stagger: {
                        amount: 0.1,
                    }
                })
            }

        } else {
            gsap.to(homeOverlay, { backdropFilter: "blur(5px) brightness(0.1)", duration: 0.4, overwrite: true });
            gsap.to(homeImages, { transform: "translate(-50%, -48%) scale(1.05)", duration: 0.5, overwrite: true });
            gsap.to(pressCarousel, { opacity: 1, duration: 0.4, overwrite: true });

            if (isNavbarDisplayed) {
                isNavbarDisplayed = false;

                gsap.to(navbarListSections.children, {
                    opacity: 1,
                    stagger: {
                        amount: 0.2,
                    }
                })
            }
        }

        lastY = window.scrollY;
    };

    window.addEventListener("scroll", homeScrollHandler);

    // Store smoother
    homeSmoother = ScrollSmoother.create({
        smooth: 2,
        smoothTouch: 0.1,
        wrapper: "#smooth-wrapper",
        content: "#smooth-content"
    });

    // Horizontal scroll animation
    const horizontalScroll = gsap.to(sections, {
        xPercent: i => -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: "#press-carousel-container",
            pin: true,
            scrub: 1,
            start: "top top",
            end: `+=${pressCarousel.offsetWidth}`,
        }
    });
    homeScrollTriggers.push(horizontalScroll.scrollTrigger);

    // Per-section timelines
    sections.forEach(section => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                containerAnimation: horizontalScroll,
                scrub: true,
                start: 'left right',
                end: 'right left'
            }
        });
        homeScrollTriggers.push(tl.scrollTrigger);

        tl.to(section, { scale: 1, opacity: 1, ease: "none" })
            .to(section, { scale: 0.9, opacity: 0.5, ease: "none" });
    });
}


export function destroyPressCarousel() {
    // Remove scroll listener
    if (homeScrollHandler) {
        window.removeEventListener("scroll", homeScrollHandler);
        homeScrollHandler = null;
    }

    // Kill ScrollTrigger instances
    homeScrollTriggers.forEach(st => st.kill());
    homeScrollTriggers = [];

    // Kill ScrollSmoother
    if (homeSmoother) {
        homeSmoother.kill();
        homeSmoother = null;
    }

    // Reset home elements (overlay, images, carousel)
    const overlay = document.getElementById('home-image-overlay');
    const images = document.querySelectorAll('.home-image');
    const carousel = document.getElementById('press-carousel');

    gsap.set([overlay, ...images, carousel], {
        opacity: 0,
        clearProps: "all", // removes transforms, scale, translate, etc.
        pointerEvents: "none"
    });
}