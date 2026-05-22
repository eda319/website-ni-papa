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

function copyEmail() {
  navigator.clipboard.writeText("elexcellence@gmail.com");
  alert("Email copied!");
}

function moveSlide(button, direction) {
  const carousel = button.closest("[data-carousel]");
  const slides = carousel.querySelectorAll(".slide");

  let currentIndex = Array.from(slides).findIndex((s) =>
    s.classList.contains("active"),
  );

  slides[currentIndex].classList.remove("active");

  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) nextIndex = slides.length - 1;
  if (nextIndex >= slides.length) nextIndex = 0;

  slides[nextIndex].classList.add("active");
}