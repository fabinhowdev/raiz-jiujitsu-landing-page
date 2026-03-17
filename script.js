const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.setAttribute("role", "button");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  menuToggle.setAttribute("aria-expanded", "false");

  const closeMenu = () => {
    navLinks.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    const isOpen = navLinks.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (!navLinks.classList.contains("active")) return;
    if (navLinks.contains(target) || menuToggle.contains(target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  navLinks.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPath = href.split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("is-current");
      link.setAttribute("aria-current", "page");
    }
  });
}

const navbar = document.getElementById("navbar");
if (navbar) {
  const updateHeader = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

const animatedItems = [...document.querySelectorAll(".animate")];
animatedItems.forEach((item, index) => {
  if (!item.style.getPropertyValue("--delay")) {
    item.style.setProperty("--delay", `${(index % 6) * 0.08}s`);
  }
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("active");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
  );

  animatedItems.forEach((item) => observer.observe(item));
} else {
  animatedItems.forEach((item) => item.classList.add("active"));
}

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (parallaxItems.length && !reduceMotion) {
  let ticking = false;

  const handleParallax = () => {
    const scrolled = window.scrollY;
    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.parallax || 0.08);
      item.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(handleParallax);
  };

  handleParallax();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const carousels = [...document.querySelectorAll("[data-carousel]")];

carousels.forEach((carousel) => {
  const track = carousel.querySelector("[data-carousel-track]");
  const slides = [...carousel.querySelectorAll("[data-carousel-slide]")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];

  if (!(track instanceof HTMLElement) || slides.length < 2) return;

  const intervalMs = Number(carousel.getAttribute("data-interval")) || 4200;
  let currentIndex = 0;
  let timerId = null;

  const goTo = (nextIndex) => {
    currentIndex = (nextIndex + slides.length) % slides.length;
    track.style.transform = `translate3d(-${currentIndex * 100}%, 0, 0)`;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
      const active = index === currentIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-current", String(active));
    });
  };

  const stopAutoPlay = () => {
    if (timerId === null) return;
    window.clearInterval(timerId);
    timerId = null;
  };

  const startAutoPlay = () => {
    if (document.hidden) return;
    stopAutoPlay();
    timerId = window.setInterval(() => {
      goTo(currentIndex + 1);
    }, intervalMs);
  };

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goTo(index);
      startAutoPlay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);
  carousel.addEventListener("focusin", stopAutoPlay);
  carousel.addEventListener("focusout", (event) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && carousel.contains(nextTarget)) return;
    startAutoPlay();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoPlay();
      return;
    }
    startAutoPlay();
  });

  goTo(0);
  startAutoPlay();
});
