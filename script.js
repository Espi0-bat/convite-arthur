const WHATSAPP_NUMBER = "5561985923161";
const PIX_CODE = "00020101021126330014br.gov.bcb.pix0111049644681945204000053039865802BR5924ALINE GERHARDT RODRIGUES6009SAO PAULO622905251KXENZFPJ57V5YPDM70TA7PPW6304A311";

const PHOTOS = [
  "arthur-01.jpeg", "arthur-02.jpeg", "arthur-03.jpeg", "arthur-04.jpeg",
  "arthur-07.jpeg", "arthur-08.jpeg", "arthur-09.jpeg", "arthur-10.jpeg",
  "arthur-11.jpeg", "arthur-12.jpeg", "arthur-13.jpeg", "arthur-14.jpeg",
  "arthur-15.jpeg", "arthur-16.jpeg", "arthur-17.jpeg", "arthur-18.jpeg",
  "arthur-19.jpeg",
];

// ---- Carrossel ----
const carousel = document.getElementById("carousel");
const track = document.getElementById("carouselTrack");
const dotsWrap = document.getElementById("carouselDots");
let current = 0;
let autoplayTimer;

PHOTOS.forEach((file, i) => {
  const photo = document.createElement("img");
  photo.className = "carousel-photo";
  photo.src = `assets/img/${file}`;
  photo.alt = `Foto do Arthur ${i + 1}`;
  photo.loading = i === 0 ? "eager" : "lazy";
  photo.decoding = "async";
  track.appendChild(photo);

  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Ir para foto ${i + 1}`);
  dot.addEventListener("click", () => { goTo(i); resetAutoplay(); });
  dotsWrap.appendChild(dot);
});

function goTo(index) {
  current = (index + PHOTOS.length) % PHOTOS.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dotsWrap.children].forEach((d, i) => d.classList.toggle("active", i === current));

  // pré-carrega a próxima foto para a troca ser instantânea
  const next = track.children[(current + 1) % PHOTOS.length];
  if (next) next.loading = "eager";
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}

function resetAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => goTo(current + 1), 4000);
}

document.getElementById("prevBtn").addEventListener("click", () => { goTo(current - 1); resetAutoplay(); });
document.getElementById("nextBtn").addEventListener("click", () => { goTo(current + 1); resetAutoplay(); });

// pausa o autoplay enquanto o convidado olha/interage; retoma depois
carousel.addEventListener("mouseenter", stopAutoplay);
carousel.addEventListener("mouseleave", resetAutoplay);

// swipe no celular
let touchStartX = null;
let touchStartY = null;

carousel.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  stopAutoplay();
}, { passive: true });

carousel.addEventListener("touchend", (e) => {
  if (touchStartX !== null) {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      goTo(dx < 0 ? current + 1 : current - 1);
    }
  }
  touchStartX = null;
  touchStartY = null;
  resetAutoplay();
}, { passive: true });

// não desperdiça dados trocando fotos com a aba escondida
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAutoplay();
  else resetAutoplay();
});

goTo(0);
resetAutoplay();

// ---- Link do Google Agenda ----
const googleCalBtn = document.getElementById("googleCalBtn");
const calParams = new URLSearchParams({
  action: "TEMPLATE",
  text: "Aniversário de 1 aninho do Arthur",
  dates: "20260822T200000Z/20260822T230000Z",
  details: "Vem celebrar com a gente o primeiro aninho do Arthur!",
  location: "Cond Maxximo Garden, Jardim Botânico (Lago Sul), Brasília/DF",
});
googleCalBtn.href = `https://www.google.com/calendar/render?${calParams.toString()}`;

// ---- RSVP via WhatsApp ----
const nameInput = document.getElementById("rsvpName");
const companionsInput = document.getElementById("rsvpCompanions");

// mantém o número de acompanhantes dentro de limites razoáveis
companionsInput.addEventListener("change", () => {
  const n = parseInt(companionsInput.value, 10);
  companionsInput.value = isNaN(n) ? 0 : Math.min(20, Math.max(0, n));
});

function sendRsvp(going) {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = "#c0392b";
    return;
  }
  nameInput.style.borderColor = "";

  const companions = Math.min(20, Math.max(0, parseInt(companionsInput.value, 10) || 0));
  let message;
  if (going) {
    message = `Oiii! Aqui é ${name} 💛 Passando pra confirmar que vou estar na festinha de 1 aninho do Arthur, mal posso esperar! 🎉🦁`;
    if (companions > 0) {
      message += ` Vou levar mais ${companions} acompanhante${companions > 1 ? "s" : ""}, somos ${companions + 1} ao todo!`;
    }
  } else {
    message = `Oiii! Aqui é ${name} 💛 Infelizmente não vou conseguir ir na festinha do Arthur dessa vez, mas fico na torcida e já mando um beijo grande pra ele! Agradeço muito o convite 🥰`;
  }

  // navegação na mesma aba: nunca é bloqueada por webviews (WhatsApp, Instagram)
  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.getElementById("rsvpYes").addEventListener("click", () => sendRsvp(true));
document.getElementById("rsvpNo").addEventListener("click", () => sendRsvp(false));

// ---- Copiar código Pix ----
const pixCodeInput = document.getElementById("pixCode");
pixCodeInput.value = PIX_CODE;

async function copyPix(button) {
  try {
    await navigator.clipboard.writeText(PIX_CODE);
  } catch (e) {
    const helper = document.createElement("textarea");
    helper.value = PIX_CODE;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
  const original = button.textContent;
  button.textContent = "Copiado! ✓";
  setTimeout(() => { button.textContent = original; }, 2000);
}

document.getElementById("copyPixBtn").addEventListener("click", (e) => copyPix(e.currentTarget));

// ---- Mostrar/esconder o card do Pix ----
const togglePixBtn = document.getElementById("togglePixBtn");
const pixCard = document.getElementById("pixCard");

togglePixBtn.addEventListener("click", () => {
  const isHidden = pixCard.hasAttribute("hidden");
  if (isHidden) {
    pixCard.removeAttribute("hidden");
    pixCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } else {
    pixCard.setAttribute("hidden", "");
  }
  togglePixBtn.setAttribute("aria-expanded", String(isHidden));
});
