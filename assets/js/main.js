document.addEventListener("DOMContentLoaded", function () {

  /* -------------------------
     MOBILE NAVIGATION
  ------------------------- */

  const navToggle = document.querySelector(".nav__toggle");
  const navMenu = document.querySelector(".nav__list");

  if(navToggle && navMenu){

    navToggle.addEventListener("click", function(){

      const open = navMenu.classList.toggle("is-open");

      navToggle.setAttribute(
        "aria-expanded",
        open ? "true" : "false"
      );

    });

  }



  /* -------------------------
     EVENT FLYER SLIDER
  ------------------------- */

  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".sliderDot");

  let slideIndex = 0;

  function showSlide(index){

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slides[index].classList.add("active");

    if(dots[index]){
      dots[index].classList.add("active");
    }

  }

  if(slides.length){

    showSlide(0);

    setInterval(function(){

      slideIndex++;

      if(slideIndex >= slides.length){
        slideIndex = 0;
      }

      showSlide(slideIndex);

    },5000);

  }

  dots.forEach((dot,i)=>{

    dot.addEventListener("click",function(){

      slideIndex = i;

      showSlide(slideIndex);

    });

  });



  /* -------------------------
     GALLERY LIGHTBOX
  ------------------------- */

  const galleryCards = document.querySelectorAll(".galleryCard");

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");

  if(galleryCards.length && lightbox){

    galleryCards.forEach(card => {

      card.addEventListener("click", function(){

        const img = card.querySelector("img");

        lightboxImg.src = img.src;

        lightboxCaption.textContent =
          img.alt || "Allure Bar & Lounge";

        lightbox.classList.add("open");

      });

    });

  }

  if(lightboxClose){

    lightboxClose.addEventListener("click", function(){

      lightbox.classList.remove("open");

    });

  }

  if(lightbox){

    lightbox.addEventListener("click", function(e){

      if(e.target.classList.contains("lightboxBackdrop")){

        lightbox.classList.remove("open");

      }

    });

  }



  /* -------------------------
     VIP RESERVATION MODAL
  ------------------------- */

  const reserveBtns = document.querySelectorAll(".openReserveModal");

  const reserveModal = document.getElementById("reserveModal");

  const modalClose = document.getElementById("modalClose");

  if(reserveBtns.length && reserveModal){

    reserveBtns.forEach(btn => {

      btn.addEventListener("click", function(){

        reserveModal.classList.add("open");

      });

    });

  }

  if(modalClose){

    modalClose.addEventListener("click", function(){

      reserveModal.classList.remove("open");

    });

  }

  if(reserveModal){

    reserveModal.addEventListener("click", function(e){

      if(e.target.classList.contains("modalBackdrop")){

        reserveModal.classList.remove("open");

      }

    });

  }



  /* -------------------------
     IMAGE FALLBACK
     prevents broken images
  ------------------------- */

  const images = document.querySelectorAll("img");

  images.forEach(img => {

    img.addEventListener("error", function(){

      img.classList.add("imgFallback");

      img.src = "";

    });

  });



});