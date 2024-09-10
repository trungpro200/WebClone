const container = document.querySelector(".scroll-container");
const sections = gsap.utils.toArray(".scroll-container section");

console.log(sections);

//smoth scroll
const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

//horizontal scroll
let scrollTween = gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".scroll-container",
    pin: true,
    scrub: 1,
    markers: false,
    end: "+=1500",
  },
});

//scroll animation
//scale down
gsap.utils.toArray(".scroll-section-hide").forEach((section) => {
  let scaleDown = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "50% 40%",
      end: "100% 40%",
      scrub: 1,
      containerAnimation: scrollTween,
      markers: false,
    },
  });

  let card = section.querySelectorAll("div > div");
  console.log(card);
  scaleDown.to(card, {
    scale: 0,
    opacity: 0,
    stagger: 0.1,
  });
});

//scale up
gsap.utils.toArray(".scroll-section-show").forEach((section) => {
  let scaleUp = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "-20% 50%",
      end: "40% 40%",
      scrub: 1,
      containerAnimation: scrollTween,
      markers: false,
    },
  });

  let card = section.querySelectorAll("div > div");

  scaleUp.to(card, {
    scale: 1,
    opacity: 1,
    stagger: 0.1,
  });
});
