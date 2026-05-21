const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("mouseenter", () => {
  nav.classList.add("active");
});

nav.addEventListener("mouseleave", () => {
  nav.classList.remove("active");
});

