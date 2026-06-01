$(function () {
  const $hamburger = $("#hamburger");
  const $nav = $("#nav");

  /* ================= NAV TOGGLE ================= */
  $hamburger.on("click", function () {
    $nav.toggleClass("active");
  });

  $(document).on("click", function (e) {
    if (
      !$(e.target).closest("#nav").length &&
      !$(e.target).closest("#hamburger").length
    ) {
      $nav.removeClass("active");
    }
  });

  /* ================= ACCORDION ================= */
  $(".accordion-header").on("click", function () {
    $(this).toggleClass("active");
    $(this).next().toggleClass("show");
  });

  /* ================= COPY EMAIL ================= */
  window.copyEmail = function () {
    navigator.clipboard
      .writeText("elexcellence@gmail.com")
      .then(() => alert("Email copied!"))
      .catch(() => alert("Failed to copy"));
  };

  /* ================= IMAGE PRELOAD ================= */
  function preloadImage(src) {
    const img = new Image();
    img.src = src;
  }

  /* ================= PROJECT CAROUSEL (UNCHANGED) ================= */
  window.moveSlide = function (btn, direction) {
    const $carousel = $(btn).closest("[data-carousel]");
    const $slides = $carousel.find(".slide");

    let activeIndex = $slides.index($slides.filter(".active"));

    $slides.eq(activeIndex).removeClass("active");

    let newIndex = activeIndex + direction;

    if (newIndex < 0) newIndex = $slides.length - 1;
    if (newIndex >= $slides.length) newIndex = 0;

    $slides.eq(newIndex).addClass("active");

    const next = (newIndex + 1) % $slides.length;
    const prev = (newIndex - 1 + $slides.length) % $slides.length;

    const getImg = (slide) => {
      const img = $(slide).find("img")[0];
      return img.currentSrc || img.src;
    };

    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => {
        preloadImage(getImg($slides[next]));
      });
    } else {
      setTimeout(() => preloadImage(getImg($slides[next])), 200);
    }
  };

  /* ================= CERTIFICATION CAROUSEL ================= */

  window.moveCertSlide = function (btn, direction) {
    const $carousel = $(btn).closest(".cert-carousel");
    const $track = $carousel.find(".cert-track");
    const $images = $track.find("img");

    // current scroll position approximation
    const scrollAmount = $images.first().outerWidth(true);

    $track.animate(
      {
        scrollLeft: $track.scrollLeft() + direction * scrollAmount,
      },
      300,
    );
  };

  /* ================= CERT ORIENTATION DETECTOR ================= */

  $(".cert-track img").each(function () {
    const img = this;

    const applyOrientation = () => {
      if (img.naturalHeight > img.naturalWidth) {
        $(img).addClass("portrait");
      } else {
        $(img).addClass("landscape");
      }
    };

    if (img.complete) {
      applyOrientation();
    } else {
      $(img).on("load", applyOrientation);
    }
  });
});
