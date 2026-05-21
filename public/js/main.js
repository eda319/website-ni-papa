const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("mouseenter", () => {
  nav.classList.add("active");
});

nav.addEventListener("mouseleave", () => {
  nav.classList.remove("active");
});

const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    header.classList.toggle("active");

    const content = header.nextElementSibling;

    content.classList.toggle("show");
  });
});
