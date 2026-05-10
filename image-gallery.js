(() => {
  const images = Array.from(document.querySelectorAll(".image-gallery img"));

  if (images.length === 0) {
    return;
  }

  let currentImg = null;
  let currentGalleryImages = [];
  let touchStartX = 0;
  let touchEndX = 0;

  const modal = document.createElement("div");
  modal.id = "imageModal";
  modal.className = "modal";
  modal.innerHTML = `
    <button class="close icon-button" type="button" aria-label="Close image">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <button
      class="nav-arrow nav-arrow-left icon-button"
      id="prevButton"
      type="button"
      aria-label="Previous image"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="15,18 9,12 15,6"></polyline>
      </svg>
    </button>
    <button
      class="nav-arrow nav-arrow-right icon-button"
      id="nextButton"
      type="button"
      aria-label="Next image"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
    </button>
    <div class="modal-content">
      <figure>
        <img id="modalImage" src="" alt="" />
        <figcaption id="imageCaption"></figcaption>
      </figure>
    </div>
  `;
  document.body.append(modal);

  const modalImg = modal.querySelector("#modalImage");
  const caption = modal.querySelector("#imageCaption");
  const prevButton = modal.querySelector("#prevButton");
  const nextButton = modal.querySelector("#nextButton");
  const closeButton = modal.querySelector(".close");

  function openModal(img) {
    currentImg = img;
    currentGalleryImages = Array.from(
      img.closest(".image-gallery").querySelectorAll("img"),
    );
    modal.style.display = "flex";
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    caption.textContent = img.alt;
    document.body.style.overflow = "hidden";

    updateNavigationButtons();

    document.addEventListener("keydown", handleKeydown);
    modal.addEventListener("touchstart", handleTouchStart, { passive: true });
    modal.addEventListener("touchend", handleTouchEnd, { passive: true });
  }

  function closeModal() {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    currentImg = null;
    currentGalleryImages = [];

    document.removeEventListener("keydown", handleKeydown);
    modal.removeEventListener("touchstart", handleTouchStart);
    modal.removeEventListener("touchend", handleTouchEnd);
  }

  function showImage(img) {
    if (!img) {
      return;
    }

    currentImg = img;
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    caption.textContent = img.alt;

    updateNavigationButtons();
  }

  function getCurrentImageIndex() {
    return currentGalleryImages.indexOf(currentImg);
  }

  function showNextImage() {
    showImage(currentGalleryImages[getCurrentImageIndex() + 1]);
  }

  function showPreviousImage() {
    showImage(currentGalleryImages[getCurrentImageIndex() - 1]);
  }

  function updateNavigationButtons() {
    const currentIndex = getCurrentImageIndex();

    nextButton.style.display =
      currentIndex < currentGalleryImages.length - 1 ? "block" : "none";
    prevButton.style.display = currentIndex > 0 ? "block" : "none";
  }

  function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
  }

  function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) <= swipeThreshold) {
      return;
    }

    if (swipeDistance > 0) {
      showPreviousImage();
    } else {
      showNextImage();
    }
  }

  function handleKeydown(event) {
    switch (event.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        showPreviousImage();
        break;
      case "ArrowRight":
        showNextImage();
        break;
    }
  }

  closeButton.addEventListener("click", closeModal);
  prevButton.addEventListener("click", showPreviousImage);
  nextButton.addEventListener("click", showNextImage);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  images.forEach((img) => {
    img.tabIndex = 0;
    img.addEventListener("click", () => openModal(img));
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(img);
      }
    });
  });
})();
