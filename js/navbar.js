let lastY = 0, navbarHidden = false;

export default function initNavbar(navbar, page) {
    destroyNavbarDisplay();
    if (page === 'index') initHomeNavbar(navbar);
    else initNotHomeNavbar(navbar);
    resetNavbarState();
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

function resetNavbarState() {
    lastY = 0;
    navbarHidden = false;

    const navbarListSections = document.getElementById('navbar-list-sections');
    gsap.set(navbarListSections.children, { opacity: 0 });
}

function handleNavbarDisplayOnScroll() {
    if (window.scrollY > lastY) hideNavbar();
    else showNavbar();

    lastY = window.scrollY;
}

function hideNavbar() {
    if (navbarHidden) return;
    navbarHidden = true;

    const navbar = document.getElementById('navbar');
    gsap.to(navbar, { yPercent: -100, duration: 0.4 })
}

function showNavbar() {
    if (!navbarHidden) return;
    navbarHidden = false;

    const navbar = document.getElementById('navbar');
    const navbarListSections = document.getElementById('navbar-list-sections');
    gsap.to(navbar, { yPercent: 0, duration: 0.5 })
    gsap.to(navbarListSections.children, { opacity: 1, duration: 0.4 });
}