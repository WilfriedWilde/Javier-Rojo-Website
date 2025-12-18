export default function transitionPage(current, next) {
    const transitionIn = gsap.timeline();
console.log(current.container, next.container)
    transitionIn
        .to(current.container, { xPercent: -100, duration: 0.2 })
        .to(next.container, { xPercent: 0, duration: 0.2 })

    return transitionIn;
}