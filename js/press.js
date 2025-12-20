document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger, ScrollSmoother, SplitText, TextPlugin)

});

const reviews = [
    { source: 'Jazz Magazine (FR)', review: 'Revelation!', link: 'https://drive.google.com/file/d/1-A1xVIa7CMxQFaIXzhZU-fxbTJZVKLLk/view' },
    { source: 'Jazz Weekly (US)', review: 'Brings fresh ideas to the post bop genre.', link: 'https://jazzweekly.com/2025/03/javier-rojo-musica-para-amansar-fieras-fuel/' },
    { source: 'Jazzwise (UK)', review: 'Rojo may be in his mid-twenties but already he is in his element with maturity and purpose.', link: '' },
    { source: 'NRW Jazz (DE)', review: "A fine, contemporary jazz record… the swing is relaxed, the boppy passages are driving, the ballads are tender and emotional - Rojo's own compositions have a lot to offer.", link: 'https://nrwjazz.net/rezensionen/neues-aus-der-cd-welt-christoph-gieses-schnelldurchlauf-vol-66' },
    { source: 'Jazzmania (BE)', review: "Jordi Pujol, head of the Fresh Sound New Talent label, knows damn well who to give a chance to. With this Javier Rojo and his sextet, it's clearly a successful move.", link: 'https://jazzmania.be/javier-rojo-musica-para-amansar-fieras/' },
    { source: 'Jazzflits (NL)', review: 'Energetic, playful, and pleasantly sentimental', link: '' },
    { source: 'PJ Portrait in Jazz (JP)', review: 'Straight-ahead energy characteristic of young musicians, making it a refreshing listen.', link: 'https://pjportraitinjazz.com/playlists/20250128_8832/' },
    { source: 'Esensja (PL)', review: 'Javier Rojo – remember this artist!', link: 'https://esensja.pl/muzyka/recenzje/tekst.html?id=36044' },
    { source: 'Jazz Views (UK)', review: 'These guys are having real musical conversations.', link: 'https://jazzviews.net/javier-rojo-musica-para-amansar-fieras/' },
    { source: 'Blue in Green (UK)', review: "The musical embodiment of wearing one's heart on their sleeve.", link: 'http://www.blueingreenradio.com/2025/01/musica-para-amansar-fieras-by-javier.html' },
    { source: 'Era Jazzu (PL)', review: 'A perfect showcase for the young European jazz scene.', link: 'https://jazz.pl/javier-rojo-musica-para-amansar-fieras-fresh-sound-new-talent/' },
];

export function initPressCarousel() {
    const pressCarousel = document.getElementById('press-carousel');
    if (pressCarousel.children.length > 1) return;

    const shuffledReviews = shuffle(reviews);

    shuffledReviews.forEach((review, index) => {
        appendPressReview(review, index);
    });

    initCarouselAnimations();
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function appendPressReview(pressReview, index) {
    const { source, review, link } = pressReview;
    const pressCarousel = document.getElementById('press-carousel');
    const side = index % 2 === 0 ? 'start' : 'end';
    const template = `
    <div class="review-content">
        <p class="review-container">"${review}"</p>
        <a class="source-container" href="${link}">&mdash; ${source}</a>
    </div>
    `;

    const pressReviewContainer = document.createElement('div');
    pressReviewContainer.classList.add('press-review-container');
    pressReviewContainer.innerHTML = template;
    pressReviewContainer.style.justifyContent = side;
    pressCarousel.appendChild(pressReviewContainer);
}

/* ANIMATIONS */
let homeClickHandler = null;
let homeSmoother = null;
let homeScrollTriggers = [];

function initCarouselAnimations() {
    const homeTitle = document.getElementById("home-title-container");
    const smoothWrapper = document.getElementById("smooth-wrapper");
    const pressCarousel = document.getElementById("press-carousel");
    const homeOverlay = document.getElementById("home-image-overlay");
    const homeImages = document.querySelectorAll(".home-image");
    const sections = gsap.utils.toArray(".press-review-container");
    const navbar = document.getElementById('navbar');

    if (!pressCarousel || !homeOverlay || homeImages.length === 0) return;

    let isCarouselDisplayed = false;
    const carouselTimeline = gsap.timeline({ paused: true });
    carouselTimeline
        .to(smoothWrapper, { zIndex: 5, duration: 0 })
        .to(homeTitle.children, { yPercent: -600, zIndex: -1, stagger: { amount: 0.1, from: 'start' }, ease: 'back.in(1.3)' })
        .to(homeOverlay, { backdropFilter: "blur(5px) brightness(0.1)", duration: 0.4, overwrite: true }, 0.5)
        .to(homeImages, { transform: "translate(-50%, -48%) scale(1.05)", duration: 0.5, overwrite: true }, 0.5)
        .to(pressCarousel, { opacity: 1, duration: 0.4, overwrite: true }, 0.5)
        .to(navbar, { opacity: 1, stagger: { amount: 0.2 } }, 0.5)
        
    homeClickHandler = (event) => {
        if (event.target.closest('li')) return;

        if (!isCarouselDisplayed) {
            carouselTimeline.play()
        } else {
            carouselTimeline.reverse();
        }
        isCarouselDisplayed = !isCarouselDisplayed;
    };

    window.addEventListener("click", homeClickHandler);

    homeSmoother = ScrollSmoother.create({
        smooth: 2,
        smoothTouch: 0.1,
        wrapper: "#smooth-wrapper",
        content: "#smooth-content"
    });

    const container = document.querySelector("#press-carousel-container");
    const verticalScroll = gsap.to(sections, {
        y: () => -150 * (sections.length - 1),
        ease: "none",
        stagger: {
            each: 0.015
        },
        scrollTrigger: {
            trigger: container,
            pin: true,
            scrub: 1,
            start: "top 20%",
            end: () => "+=" + window.innerHeight * (sections.length - 1) / 5
        }
    });
    homeScrollTriggers.push(verticalScroll.scrollTrigger);
}


export function destroyPressCarousel() {
    if (homeClickHandler) {
        window.removeEventListener("click", homeClickHandler);
        homeClickHandler = null;
    }

    homeScrollTriggers.forEach(st => st.kill());
    homeScrollTriggers = [];

    if (homeSmoother) {
        homeSmoother.kill();
        homeSmoother = null;
    }

    const overlay = document.getElementById('home-image-overlay');
    const images = document.querySelectorAll('.home-image');
    const carousel = document.getElementById('press-carousel');

    gsap.set([overlay, ...images, carousel], {
        opacity: 0,
        clearProps: "all",
        pointerEvents: "none"
    });
}