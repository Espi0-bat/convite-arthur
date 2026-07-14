const WHATSAPP_NUMBER = "5561985923161";
const PIX_CODE = "00020101021126330014br.gov.bcb.pix0111049644681945204000053039865802BR5924ALINE GERHARDT RODRIGUES6009SAO PAULO622905251KXENZFPJ57V5YPDM70TA7PPW6304A311";

const PHOTOS = [
  "arthur-01.jpeg", "arthur-02.jpeg", "arthur-03.jpeg", "arthur-04.jpeg",
  "arthur-07.jpeg", "arthur-08.jpeg", "arthur-09.jpeg", "arthur-10.jpeg",
  "arthur-11.jpeg", "arthur-12.jpeg", "arthur-13.jpeg", "arthur-14.jpeg",
  "arthur-15.jpeg", "arthur-16.jpeg", "arthur-17.jpeg", "arthur-18.jpeg",
  "arthur-19.jpeg",
];

// ---- Carousel ----
const track = document.getElementById("carouselTrack");
const dotsWrap = document.getElementById("carouselDots");
let current = 0;
let autoplayTimer;

PHOTOS.forEach((file, i) => {
  const img = document.createElement("img");
  img.src = `assets/img/${file}`;
  img.alt = `Foto do Arthur ${i + 1}`;
  img.loading = i === 0 ? "eager" : "lazy";
  track.appendChild(img);

  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Ir para foto ${i + 1}`);
  dot.addEventListener("click", () => goTo(i));
  dotsWrap.appendChild(dot);
});

function goTo(index) {
  current = (index + PHOTOS.length) % PHOTOS.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dotsWrap.children].forEach((d, i) => d.classList.toggle("active", i === current));
}

function resetAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => goTo(current + 1), 4000);
}

document.getElementById("prevBtn").addEventListener("click", () => { goTo(current - 1); resetAutoplay(); });
document.getElementById("nextBtn").addEventListener("click", () => { goTo(current + 1); resetAutoplay(); });

goTo(0);
resetAutoplay();

// ---- Google Calendar link ----
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

function sendRsvp(going) {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    nameInput.style.borderColor = "#c0392b";
    return;
  }
  nameInput.style.borderColor = "";

  const companions = parseInt(companionsInput.value, 10) || 0;
  let message;
  if (going) {
    message = `Oi! Aqui é ${name}. Confirmando presença na festa de 1 aninho do Arthur! 🎉`;
    if (companions > 0) {
      message += ` Vamos ${companions + 1} pessoas (com acompanhante${companions > 1 ? "s" : ""}).`;
    }
  } else {
    message = `Oi! Aqui é ${name}. Infelizmente não conseguiremos ir na festa do Arthur, mas obrigado pelo convite! 💛`;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener");
}

document.getElementById("rsvpYes").addEventListener("click", () => sendRsvp(true));
document.getElementById("rsvpNo").addEventListener("click", () => sendRsvp(false));

// ---- Copiar código Pix ----
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

// ---- Modal de presente via Pix ----
const giftModal = document.getElementById("giftModal");
const giftModalTitle = document.getElementById("giftModalTitle");

document.querySelectorAll(".gift-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const gift = btn.dataset.gift;
    const emoji = btn.dataset.emoji;
    giftModalTitle.textContent = `${emoji} ${gift}`;
    giftModal.classList.add("open");
    document.body.style.overflow = "hidden";
  });
});

function closeGiftModal() {
  giftModal.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("giftModalClose").addEventListener("click", closeGiftModal);
giftModal.addEventListener("click", (e) => {
  if (e.target === giftModal) closeGiftModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && giftModal.classList.contains("open")) closeGiftModal();
});

document.getElementById("giftModalCopyBtn").addEventListener("click", (e) => copyPix(e.currentTarget));
