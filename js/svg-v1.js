// DECLARATIONS
const navInfo = ['biography', 'medias', 'concerts', 'contact'];

const urls = {
    navbar: () => navInfo.map(info => {
            return { url: `../logos/navbar/${info}.svg`, id: `${info}`, href: `./${info}.html` }
        }),

    socialMedias: [
        { url: '../logos/social_medias/facebook.svg', id: 'facebook', href: 'https://www.facebook.com/javier.sanchezrojo.9' },
        { url: '../logos/social_medias/instagram.svg', id: 'instagram', href: 'https://www.instagram.com/javiersrojo/' },
        { url: '../logos/social_medias/spotify.svg', id: 'spotify', href: 'https://open.spotify.com/intl-fr/artist/4Mg2B60aGou7zXTRlbAmeH?si=yEht4fvUSbi2bO2alAGLng' },
        { url: '../logos/social_medias/apple.svg', id: 'apple', href: 'https://music.apple.com/es/artist/javier-rojo/1478744089' },
        { url: '../logos/social_medias/tidal.svg', id: 'tidal', href: 'https://tidal.com/artist/16729922/' }
    ]
};

const linksInfo = {
    navbar: {
        linksNum: 4, className: 'link-navbar'
    },
    socialMedias: {
        linksNum: 5, className: 'link-social-media'
    },
};

// FUNCTIONs
// instagram icon animation

export function handleInstagramHover() {
    const instagramIcon = document.getElementById('instagram');
    const instagramColors = document.querySelectorAll('.instagram-color');
    const animNumber = ['one', 'two', 'three', 'four'];

    let isHovered = false;

    function handleColorTransition() {
        for (const number of animNumber) {
            for (const color of instagramColors) {
                if (color.classList.contains(number)) {
                    if (isHovered) {
                        color.classList.remove(`insta-anim-out-${number}`);
                        color.classList.add(`insta-anim-in-${number}`);
                    } else {
                        color.classList.remove(`insta-anim-in-${number}`);
                        color.classList.add(`insta-anim-out-${number}`);
                    }
                }
            }
        }
    }

    instagramIcon.addEventListener('mouseenter', () => {
        isHovered = true;
        handleColorTransition();
    });

    instagramIcon.addEventListener('mouseleave', () => {
        isHovered = false;
        handleColorTransition();
    });
}

async function fetchSVG(url) {
    const response = await fetch(url);
    const svg = await response.text();
    return svg;
}

async function appendIcons(container, urls, info) {
    async function appendLink(index, info) {
        const listOption = document.createElement('li');
        const link = document.createElement('a');
        const svg = await fetchSVG(urls[index].url);

        link.innerHTML = svg;
        link.id = urls[index].id;
        listOption.classList.add(info.className);
        link.href = urls[index].href;

        listOption.appendChild(link);
        container.appendChild(listOption);
    }

    for (let i = 0; i < info.linksNum; i++) {
        await appendLink(i, info);
    }
}

export async function appendSocialMediaIcons(container) {
    await appendIcons(container, urls.socialMedias, linksInfo.socialMedias);
}

export async function appendNavIcons(container) {
    await appendIcons(container, urls.navbar(), linksInfo.navbar);

    const homeLink = document.getElementById('home');
    homeLink.innerHTML = await fetchSVG('./logos/navbar/home.svg');
}
