(() => {
  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__list");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  const imageNodes = document.querySelectorAll("img[data-fallback], .has-fallback img, .flyerPoster img, .galleryCard img, .featuredPoster img, .previewCard img, .heroVisual img");
  imageNodes.forEach((img) => {
    img.addEventListener("error", () => {
      img.style.display = "none";
      if (img.parentElement) {
        img.parentElement.classList.add("imgFallback");
      }
    });
  });

  const modal = document.getElementById("bookingModal");
  if (modal) {
    const modalBackdrop = modal.querySelector(".modalBackdrop");
    const modalClose = modal.querySelector(".modalClose");
    const openButtons = document.querySelectorAll(".openBooking");

    function openModal(e){
      if (e) e.preventDefault();
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    }

    function closeModal(){
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
    }

    openButtons.forEach((button) => {
      button.addEventListener("click", openModal);
    });

    if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
    if (modalClose) modalClose.addEventListener("click", closeModal);

    const bookingForm = document.getElementById("bookingForm");
    if (bookingForm) {
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("bookName")?.value.trim() || "";
        const phone = document.getElementById("bookPhone")?.value.trim() || "";
        const date = document.getElementById("bookDate")?.value.trim() || "";
        const guests = document.getElementById("bookGuests")?.value.trim() || "";
        const pack = document.getElementById("bookPackage")?.value.trim() || "";
        const time = document.getElementById("bookTime")?.value.trim() || "";
        const notes = document.getElementById("bookNotes")?.value.trim() || "";

        const smsBody =
          `VIP Booking Request%0A` +
          `Name: ${name || "-"}%0A` +
          `Phone: ${phone || "-"}%0A` +
          `Date: ${date || "-"}%0A` +
          `Guests: ${guests || "-"}%0A` +
          `Package: ${pack || "-"}%0A` +
          `Preferred Time: ${time || "-"}%0A` +
          `Notes: ${notes || "-"}`;

        window.location.href = `sms:2022974949?body=${smsBody}`;
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  const lightbox = document.getElementById("siteLightbox");
  if (lightbox) {
    const lightboxBackdrop = lightbox.querySelector(".lightboxBackdrop");
    const lightboxClose = lightbox.querySelector(".lightboxClose");
    const lightboxImg = document.getElementById("lightboxImg");
    const lightboxCaption = document.getElementById("lightboxCaption");

    function openLightbox(src, title){
      if (!lightboxImg) return;
      lightboxImg.src = src;
      lightboxImg.alt = title || "";
      if (lightboxCaption) lightboxCaption.textContent = title || "";
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    }

    function closeLightbox(){
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      if (lightboxImg) lightboxImg.src = "";
    }

    document.querySelectorAll("[data-lightbox-src]").forEach((node) => {
      node.addEventListener("click", (e) => {
        if (e.target.closest(".btnGold") || e.target.closest(".btnGhost")) return;
        openLightbox(node.dataset.lightboxSrc, node.dataset.lightboxTitle || "");
      });
    });

    if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }
})();
