// Options builder
export default function setOptions({
    animType,
    eventType,
    from, 
    to,
    reverse,
    reverseDelay,
    scroll: {
        stepRatio,
        effectRange,
        stickyPosition,
        scrollBuffer
    },
    auto: {
        duration,
        delay,
        animEasing,
        delayEasing
    },
    intersection: {
        root,
        rootMargin,
        threshold
    },
}) {
    return {
        animType,
        eventType,
        from,
        to,
        reverse,
        reverseDelay,
        scroll: {
            stepRatio,
            effectRange,
            stickyPosition,
            scrollBuffer
        },
        auto: {
            duration,
            delay,
            animEasing,
            delayEasing
        },
        intersection: {
            root,
            rootMargin,
            threshold
        },
    }
}