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
