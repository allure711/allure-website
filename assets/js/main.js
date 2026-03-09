document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MOBILE NAV
  ========================= */
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* =========================
     RESERVE MODAL
  ========================= */
  const reserveTriggers = document.querySelectorAll(".openReserveModal");
  const reserveModal = document.getElementById("reserveModal");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = reserveModal ? reserveModal.querySelector(".modalBackdrop") : null;

  function openReserveModal(event) {
    if (event) event.preventDefault();
    if (!reserveModal) return;
    reserveModal.classList.add("open");
    reserveModal.setAttribute("aria-hidden", "false");
  }

  function closeReserveModal() {
    if (!reserveModal) return;
    reserveModal.classList.remove("open");
    reserveModal.setAttribute("aria-hidden", "true");
  }

  if (reserveTriggers.length && reserveModal) {
    reserveTriggers.forEach((trigger) => {
      trigger.addEventListener("click", openReserveModal);
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeReserveModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", closeReserveModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeReserveModal();
    }
  });

  /* =========================
     IMAGE FALLBACK
  ========================= */
  const allImages = document.querySelectorAll("img");

  allImages.forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";

      const parent = img.parentElement;
      if (parent) {
        parent.classList.add("imgFallback");
      }
    });
  });
});