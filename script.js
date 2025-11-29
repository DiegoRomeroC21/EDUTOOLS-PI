// NAV MOBILE
const burger = document.getElementById("burger");
const navbar = document.getElementById("navbar");

if (burger && navbar) {
  burger.addEventListener("click", () => {
    navbar.classList.toggle("nav-mobile-open");
  });
}

// SLIDER
const sliderTrack = document.getElementById("sliderTrack");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;

function updateSlider() {
  if (!sliderTrack) return;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle("active", i === currentSlide));
}

const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    currentSlide = (currentSlide - 1 + 3) % 3;
    updateSlider();
  });

  nextBtn.addEventListener("click", () => {
    currentSlide = (currentSlide + 1) % 3;
    updateSlider();
  });
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    currentSlide = parseInt(dot.dataset.slide, 10);
    updateSlider();
  });
});

// Auto slide
setInterval(() => {
  currentSlide = (currentSlide + 1) % 3;
  updateSlider();
}, 8000);

// FILTROS BÁSICOS
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");
const offerChip = document.getElementById("offerChip");
const productGrid = document.getElementById("productGrid");
const products = productGrid ? Array.from(productGrid.querySelectorAll(".product-card")) : [];

function applyFilters() {
  if (!products.length) return;

  const category = categoryFilter ? categoryFilter.value : "todos";
  const sort = sortFilter ? sortFilter.value : "relevante";
  const search = searchInput ? searchInput.value.toLowerCase() : "";
  const onlyOffers = offerChip && offerChip.classList.contains("active");

  let filtered = products.slice();

  filtered.forEach((card) => {
    const cardCategory = card.dataset.category;
    const title = card.querySelector(".product-title").textContent.toLowerCase();
    const isOffer = card.dataset.offer === "true";

    let show = true;

    if (category !== "todos" && cardCategory !== category) show = false;
    if (search && !title.includes(search)) show = false;
    if (onlyOffers && !isOffer) show = false;

    card.style.display = show ? "" : "none";
  });

  // Ordenamiento por precio
  const sorteds = products
    .filter((c) => c.style.display !== "none")
    .sort((a, b) => {
      const priceA = parseFloat(a.dataset.price);
      const priceB = parseFloat(b.dataset.price);
      if (sort === "precio-asc") return priceA - priceB;
      if (sort === "precio-desc") return priceB - priceA;
      return 0;
    });

  sorteds.forEach((card) => productGrid.appendChild(card));
}

if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);
if (sortFilter) sortFilter.addEventListener("change", applyFilters);
if (searchInput) searchInput.addEventListener("input", applyFilters);
if (offerChip) {
  offerChip.addEventListener("click", () => {
    offerChip.classList.toggle("active");
    applyFilters();
  });
}

// FAQ TOGGLE
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  question.addEventListener("click", () => {
    const open = answer.style.display === "block";
    answer.style.display = open ? "none" : "block";
    question.querySelector("span:last-child").textContent = open ? "+" : "-";
  });
});

// CHAT
const chatWidget = document.getElementById("chatWidget");
const chatToggle = document.getElementById("chatToggle");
const closeChat = document.getElementById("closeChat");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const sendChat = document.getElementById("sendChat");

function addChatMessage(text, type = "user") {
  if (!chatBody) return;
  const msg = document.createElement("div");
  msg.classList.add("chat-message", type);
  msg.textContent = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function fakeBotReply() {
  setTimeout(() => {
    addChatMessage(
      "Gracias por escribir. En esta demo el chat es solo visual, pero aquí podríamos ayudarte con tus dudas de productos y pujas.",
      "bot"
    );
  }, 600);
}

if (sendChat && chatInput) {
  sendChat.addEventListener("click", () => {
    const text = chatInput.value.trim();
    if (!text) return;
    addChatMessage(text, "user");
    chatInput.value = "";
    fakeBotReply();
  });

  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendChat.click();
    }
  });
}

if (chatToggle && chatWidget) {
  chatToggle.addEventListener("click", () => {
    chatWidget.style.display = "flex";
    chatToggle.style.display = "none";
  });
}

if (closeChat && chatWidget && chatToggle) {
  closeChat.addEventListener("click", () => {
    chatWidget.style.display = "none";
    chatToggle.style.display = "block";
  });
}

// Estado inicial del chat según el tamaño de pantalla
if (chatWidget && chatToggle) {
  if (window.innerWidth <= 768) {
    // MÓVIL: chat cerrado, botón visible
    chatWidget.style.display = "none";
    chatToggle.style.display = "flex"; // o "block"
  } else {
    // DESKTOP: chat abierto, botón oculto
    chatWidget.style.display = "flex";
    chatToggle.style.display = "none";
  }
}

// MODAL DE PRODUCTO
const overlay = document.getElementById("productOverlay");
const modalClose = document.getElementById("modalClose");

let currentProductCard = null; // <- aquí guardamos qué tarjeta está abierta

const modalImage = document.getElementById("modalImage");
const modalBadge = document.getElementById("modalBadge");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalPrice = document.getElementById("modalPrice");
const modalBid = document.getElementById("modalBid");
const modalOffersList = document.getElementById("modalOffersList");
const modalFeedback = document.getElementById("modalFeedback");

// Función principal para abrir el modal
function openProductModal(card, actionType) {
  if (!overlay) return;

  // Guardamos la tarjeta actual
  currentProductCard = card;

  // 1. Imagen principal (copiamos el contenido del .product-img)
  const imgBlock = card.querySelector(".product-img");
  if (imgBlock && modalImage) {
    modalImage.innerHTML = imgBlock.innerHTML;
  }

  // 2. Badge
  const badge = card.querySelector(".product-badge");
  if (badge && modalBadge) {
    modalBadge.textContent = badge.textContent.trim();
    modalBadge.style.display = "inline-flex";
  } else if (modalBadge) {
    modalBadge.style.display = "none";
  }

  // 3. Título
  const titleEl = card.querySelector(".product-title");
  if (titleEl && modalTitle) {
    modalTitle.textContent = titleEl.textContent.trim();
  }

  // 4. Subtítulo (tomamos la parte de estado/meta)
  const metaEl = card.querySelector(".product-meta");
  if (metaEl && modalSubtitle) {
    modalSubtitle.textContent = metaEl.textContent.replace(/\s+/g, " ").trim();
  }

  // 5. Precio y puja
  const priceEl = card.querySelector(".price-main");
  const bidEl = card.querySelector(".bid-info");

  if (priceEl && modalPrice) {
    modalPrice.textContent = priceEl.textContent.replace(/\s+/g, " ").trim();
  }
  if (bidEl && modalBid) {
    modalBid.textContent = bidEl.textContent.trim();
  }

  // 6. Historial de ofertas (demo)
  if (modalOffersList) {
    const basePrice = parseFloat(card.dataset.price || "0");
    const oferta1 = basePrice ? (basePrice - basePrice * 0.05).toFixed(0) : "";
    const oferta2 = basePrice ? (basePrice - basePrice * 0.02).toFixed(0) : "";

    modalOffersList.innerHTML = `
      <li>Última oferta: ${oferta1 ? "$" + oferta1 + " MXN" : "—"}</li>
      <li>Oferta anterior: ${oferta2 ? "$" + oferta2 + " MXN" : "—"}</li>
      <li>Precio publicado: ${modalPrice.textContent || "—"}</li>
    `;
  }

  // 7. Estado del botón "Seguir" dentro del modal
  const modalFollowBtn = document.querySelector('[data-modal-action="seguir"]');
  const isFollowing = card.dataset.following === "true";

  if (modalFollowBtn) {
    modalFollowBtn.textContent = isFollowing ? "Siguiendo ✅" : "Seguir";
  }

  // 8. Limpiar mensaje de feedback
  if (modalFeedback) {
    modalFeedback.style.display = "none";
    modalFeedback.textContent = "";
  }

  // 9. Mostrar modal + bloquear scroll
  overlay.classList.add("open");
  document.body.classList.add("no-scroll");
}

// Asociar eventos a los botones de cada tarjeta
document.querySelectorAll(".product-card").forEach((card) => {
  const buttons = card.querySelectorAll(".product-actions .btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const actionType = btn.textContent.toLowerCase();
      openProductModal(card, actionType);
    });
  });
});

// Cerrar modal
function closeProductModal() {
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

if (modalClose) {
  modalClose.addEventListener("click", closeProductModal);
}

// Cerrar si clicas fuera del cuadro
if (overlay) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeProductModal();
    }
  });
}

// Cerrar con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay && overlay.classList.contains("open")) {
    closeProductModal();
  }
});

// ACCIONES DENTRO DEL MODAL (Seguir, Pujar, Comprar)
const modalActionButtons = document.querySelectorAll(".modal-actions .btn");

function showFeedback(message) {
  if (!modalFeedback) return;
  modalFeedback.textContent = message;
  modalFeedback.style.display = "block";
}

modalActionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!currentProductCard) return;

    const action = btn.dataset.modalAction;

    if (action === "seguir") {
      // Toggle estado seguir
      const currentlyFollowing = currentProductCard.dataset.following === "true";
      const newState = !currentlyFollowing;
      currentProductCard.dataset.following = newState ? "true" : "false";

      // Cambiar texto del botón dentro del modal
      btn.textContent = newState ? "Siguiendo ✅" : "Seguir";

      // Cambiar texto del botón en la tarjeta (si existe "Seguir")
      const cardButtons = currentProductCard.querySelectorAll(".product-actions .btn");
      cardButtons.forEach((b) => {
        const txt = b.textContent.toLowerCase();
        if (txt.includes("seguir") || txt.includes("siguiendo")) {
          b.textContent = newState ? "Siguiendo ✅" : "Seguir";
        }
      });

      showFeedback(
        newState
          ? "Ahora estás siguiendo este producto (demo)."
          : "Dejaste de seguir este producto (demo)."
      );
    }

    if (action === "pujar") {
      showFeedback(
        "Tu puja ha sido registrada (demo). En una versión real aquí ingresarías el monto."
      );
    }

    if (action === "comprar") {
      showFeedback(
        "Compra simulada (demo). En una versión real te llevaríamos al checkout."
      );
    }
  });
});

// LOGIN MODAL
const openLoginBtn = document.getElementById("openLogin");
const loginOverlay = document.getElementById("loginOverlay");
const loginClose = document.getElementById("loginClose");
const loginForm = document.getElementById("loginForm");
const loginFeedback = document.getElementById("loginFeedback");
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginExtraMsg = document.getElementById("loginExtraMsg");
const loginExtraBar = document.getElementById("loginExtraBar");


// reason puede ser: "default" o "publish"
function openLoginModal(reason = "default") {
  if (!loginOverlay) return;
  loginOverlay.classList.add("open");
  document.body.classList.add("no-scroll");

  // limpiar feedback
  // mensaje especial según razón
if (loginExtraMsg) {
  // limpiamos mensaje visualmente
  loginExtraMsg.classList.remove("show");
  loginExtraMsg.style.display = "none";
}

// limpiamos barra
if (loginExtraBar) {
  loginExtraBar.style.display = "none";
  loginExtraBar.classList.remove("run");
}

if (reason === "publish" && loginExtraMsg) {
  loginExtraMsg.textContent =
    "Por favor inicia sesión primero para ofertar tus productos y podamos seguir apoyándote en el proceso.";

  // Mostrar mensaje con animación
  loginExtraMsg.style.display = "block";
  setTimeout(() => loginExtraMsg.classList.add("show"), 20);

  // Mostrar barra y reiniciar su animación
  if (loginExtraBar) {
    loginExtraBar.style.display = "block";
    loginExtraBar.classList.remove("run");
    void loginExtraBar.offsetWidth;   // truco para reiniciar animación
    loginExtraBar.classList.add("run");
  }

  // Ocultar mensaje + barra después de 5s
  setTimeout(() => {
    loginExtraMsg.classList.remove("show");
    if (loginExtraBar) loginExtraBar.classList.remove("run");

    setTimeout(() => {
      loginExtraMsg.style.display = "none";
      if (loginExtraBar) loginExtraBar.style.display = "none";
    }, 300); // da tiempo al fade out
  }, 5000);
 }
}

function closeLoginModal() {
  if (!loginOverlay) return;
  loginOverlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

if (openLoginBtn && loginOverlay) {
  openLoginBtn.addEventListener("click", () => {
    openLoginModal("default");
  });
}

if (loginClose) {
  loginClose.addEventListener("click", closeLoginModal);
}

// cerrar al hacer clic fuera del cuadro
if (loginOverlay) {
  loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) {
      closeLoginModal();
    }
  });
}

// cerrar con ESC si el modal de login está abierto
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && loginOverlay && loginOverlay.classList.contains("open")) {
    closeLoginModal();
  }
});

// "Simular" inicio de sesión
if (loginForm && loginFeedback) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userVal = loginUser.value.trim();
    const passVal = loginPass.value.trim();

    if (!userVal || !passVal) {
      loginFeedback.textContent = "Por favor completa usuario y contraseña.";
      loginFeedback.style.display = "block";
      return;
    }

    loginFeedback.textContent =
      "Inicio de sesión simulado ✅. En una versión real validaríamos tus datos con la universidad.";
    loginFeedback.style.display = "block";
  });
}

// "Simular" inicio de sesión
if (loginForm && loginFeedback) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userVal = loginUser.value.trim();
    const passVal = loginPass.value.trim();

    if (!userVal || !passVal) {
      loginFeedback.textContent = "Por favor completa usuario y contraseña.";
      loginFeedback.style.display = "block";
      return;
    }

    // Aquí podrías validar formato de correo/código, pero como demo:
    loginFeedback.textContent =
      "Inicio de sesión simulado ✅. En una versión real validaríamos tus datos con la universidad.";
    loginFeedback.style.display = "block";
  });
}

// MODAL PUBLICAR PRODUCTO
const openPublishBtn = document.getElementById("openPublish");
const publishOverlay = document.getElementById("publishOverlay");
const publishClose = document.getElementById("publishClose");
const publishForm = document.getElementById("publishForm");
const publishCancel = document.getElementById("publishCancel");

const dropzone = document.getElementById("imageDropzone");
const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const dropInfo = document.getElementById("dropInfo");

function openPublishModal() {
  if (!publishOverlay) return;
  publishOverlay.classList.add("open");
  document.body.classList.add("no-scroll");

  // resetear texto de imágenes
  if (dropInfo) {
    dropInfo.textContent = "No se han seleccionado imágenes.";
  }
}

function closePublishModal() {
  if (!publishOverlay) return;
  publishOverlay.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

if (openPublishBtn && publishOverlay) {
  openPublishBtn.addEventListener("click", () => {
    openPublishModal();
  });
}

if (publishClose) {
  publishClose.addEventListener("click", closePublishModal);
}

if (publishCancel) {
  publishCancel.addEventListener("click", closePublishModal);
}

// cerrar al hacer clic fuera del cuadro
if (publishOverlay) {
  publishOverlay.addEventListener("click", (e) => {
    if (e.target === publishOverlay) {
      closePublishModal();
    }
  });
}

// también cerrar con ESC si este modal está abierto
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && publishOverlay && publishOverlay.classList.contains("open")) {
    closePublishModal();
  }
});

// Manejo de imágenes
function handleFiles(files) {
  if (!dropInfo) return;
  if (!files || !files.length) {
    dropInfo.textContent = "No se han seleccionado imágenes.";
    return;
  }
  dropInfo.textContent = `${files.length} imagen(es) seleccionada(s).`;
}

// botón "Subir imágenes"
if (uploadBtn && imageInput) {
  uploadBtn.addEventListener("click", () => {
    imageInput.click();
  });
}

// cambio en input de archivos
if (imageInput) {
  imageInput.addEventListener("change", () => {
    handleFiles(imageInput.files);
  });
}

// drag & drop (solo efecto visual / demo)
if (dropzone) {
  ["dragenter", "dragover"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("dragging");
    });
  });

  ["dragleave", "drop"].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("dragging");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    handleFiles(files);
  });

  // También permitir click en la zona para abrir el input
  dropzone.addEventListener("click", () => {
    if (imageInput) imageInput.click();
  });
}

// Enviar formulario de publicar producto -> abre login
if (publishForm) {
  publishForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Aquí podrías validar campos, pero como demo:
    closePublishModal();
    // Abrimos login con mensaje especial
    openLoginModal("publish");
  });
}

