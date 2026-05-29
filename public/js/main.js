const hamburger = $("#hamburger");
const nav = $("#nav");

// Hamburger menu
hamburger.on("mouseenter", function () {
  nav.addClass("active");
});

nav.on("mouseleave", function () {
  nav.removeClass("active");
});

// Accordion
$(".accordion-header").on("click", function () {
  $(this).toggleClass("active");
  $(this).next().toggleClass("show");
});

// Copy email
function copyEmail() {
  navigator.clipboard.writeText("elexcellence@gmail.com");
  alert("Email copied!");
}

// Carousel slides
function moveSlide(button, direction) {
  const carousel = $(button).closest("[data-carousel]");
  const slides = carousel.find(".slide");

  let currentIndex = slides.index(slides.filter(".active"));

  slides.eq(currentIndex).removeClass("active");

  let nextIndex = currentIndex + direction;

  if (nextIndex < 0) nextIndex = slides.length - 1;
  if (nextIndex >= slides.length) nextIndex = 0;

  slides.eq(nextIndex).addClass("active");
}

// Project slider
function moveProject(button, direction) {
  const slider = $(button).closest(".project-slider");
  const projects = slider.find(".project-card");

  let currentIndex = projects.index(projects.filter(".active"));

  projects.eq(currentIndex).removeClass("active");

  currentIndex += direction;

  if (currentIndex >= projects.length) {
    currentIndex = 0;
  }

  if (currentIndex < 0) {
    currentIndex = projects.length - 1;
  }

  projects.eq(currentIndex).addClass("active");
}
