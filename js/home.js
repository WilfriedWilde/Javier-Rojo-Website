import { initPressCarousel } from './press.js';

export default async function initHome() {
    initImageResize();
    initPressCarousel();
}

function initImageResize() {
    window.addEventListener('resize', resizeImageToScreenSize);
}

export function resizeImageToScreenSize() {
    const image = document.querySelector('.home-image');
    if (!image) return;
    const root = document.documentElement;

    const { innerWidth, innerHeight } = window;
    const { offsetWidth, offsetHeight } = image;

    let newSizeValues = { height: 'auto', width: '100%' };

    if (offsetHeight <= innerHeight) {
        newSizeValues = { height: '100%', width: 'auto' };
    } else if (offsetWidth <= innerWidth) {
        newSizeValues = { height: 'auto', width: '100%' };
    }

    root.style.setProperty('--home-image-height', newSizeValues.height);
    root.style.setProperty('--home-image-width', newSizeValues.width);
}



