import setOptions from "../libs/text/options.js";

export const animOptions = {
    homeTitle: setOptions({
        animType: 'scale',
        eventType: 'intersection',
        from: 0,
        to: 1,
        reverse: false,
        reverseDelay: null,
        scroll: {
            stepRatio: 0.004,
            effectRange: 50,
            stickyPosition: 0.5,
            scrollBuffer: 0.3
        },
        auto: {
            duration: 0.8,
            delay: 0.5,
            animEasing: 'ease-in-out',
            delayEasing: 'linear'
        },
        intersection: {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
    }),

    homeSubheaders: setOptions({
        animType: 'translate',
        eventType: 'intersection',
        from: 100,
        to: 0,
        reverse: false,
        reverseDelay: null,
        scroll: {
            stepRatio: 0.004,
            effectRange: 50,
            stickyPosition: 0.5,
            scrollBuffer: 0.3
        },
        auto: {
            duration: 0.8,
            delay: 0.5,
            animEasing: 'ease-in-out',
            delayEasing: 'linear'
        },
        intersection: {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
    }),
    
    pressReview: setOptions({
        animType: 'scale',
        eventType: 'intersection',
        from: 0,
        to: 1,
        reverse: true,
        reverseDelay: null,
        scroll: {
            stepRatio: 0.004,
            effectRange: 50,
            stickyPosition: 0.5,
            scrollBuffer: 0.3
        },
        auto: {
            duration: 0.8,
            delay: 0.5,
            animEasing: 'ease-in-out',
            delayEasing: 'linear'
        },
        intersection: {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
    }),

    pressSource: setOptions({
        animType: 'translate up',
        eventType: 'intersection',
        from: 100,
        to: 0,
        reverse: true,
        reverseDelay: null,
        scroll: {
            stepRatio: 0.004,
            effectRange: 50,
            stickyPosition: 0.5,
            scrollBuffer: 0.3
        },
        auto: {
            duration: 1.3,
            delay: 0.3,
            animEasing: 'ease-in-out',
            delayEasing: 'linear'
        },
        intersection: {
            root: null,
            rootMargin: '0px',
            threshold: 0
        }
    }),
}