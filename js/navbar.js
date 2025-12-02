let lastY = 0, isNavbarHidden = false;

export default function initNavbar(navbar, page) {
    destroyNavbarDisplay();
    if (page === 'index') initHomeNavbar(navbar);
    else initNotHomeNavbar(navbar);
    resetNavbarState(page);
}

function destroyNavbarDisplay() {
    document.removeEventListener('scroll', handleNavbarDisplayOnScroll);
}

function initHomeNavbar(navbar) {
    navbar.style.backgroundColor = 'transparent';
}

function initNotHomeNavbar(navbar) {
    document.addEventListener('scroll', handleNavbarDisplayOnScroll);
    const color = getComputedStyle(document.documentElement).getPropertyValue('--color-black').trim();
    navbar.style.backgroundColor = color;
}

function resetNavbarState(page) {
    lastY = window.scrollY;
    isNavbarHidden = false;

    const navbar = document.getElementById('navbar');
    if (page === 'index') {
        gsap.set(navbar, { opacity: 0 });
    } else {
        gsap.set(navbar, { yPercent: 0, opacity: 1 });
    }
}

function handleNavbarDisplayOnScroll() {
    if (window.scrollY > lastY) hideNavbar();
    else showNavbar();

    lastY = window.scrollY;
}

function hideNavbar() {
    if (isNavbarHidden) return;
    isNavbarHidden = true;

    const navbar = document.getElementById('navbar');
    gsap.to(navbar, { yPercent: -100, duration: 0.4 })
}

function showNavbar() {
    if (!isNavbarHidden) return;
    isNavbarHidden = false;

    const navbar = document.getElementById('navbar');
    gsap.to(navbar, { yPercent: 0, opacity: 1, duration: 0.5 })
}