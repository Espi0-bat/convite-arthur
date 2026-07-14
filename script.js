const WHATSAPP_NUMBER = "5561985923161";
const PHOTO_COUNT = 19;

// ---- Carousel ----
const track = document.getElementById("carouselTrack");
const dotsWrap = document.getElementById("carouselDots");
let current = 0;
let autoplayTimer;

for (let i = 1; i <= PHOTO_COUNT; i++) {
  const img = document.createElement("img");
  img.src = `assets/img/arthur-${String(i).padStart(2, "0")}.jpeg`;
  img.alt = `Foto do Arthur ${i}`;
  img.loading = i === 1 ? "eager" : "lazy";
  track.appendChild(img);

  const dot = document.createElement("button");
  dot.setAttribute("aria-label", `Ir para foto ${i}`);
  dot.addEventListener("click", () => goTo(i - 1));
  dotsWrap.appendChild(dot);
}

function goTo(index) {
  current = (index + PHOTO_COUNT) % PHOTO_COUNT;
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

// ---- Copy Pix code ----
const copyPixBtn = document.getElementById("copyPixBtn");
const pixCodeInput = document.getElementById("pixCode");

copyPixBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(pixCodeInput.value);
  } catch (e) {
    pixCodeInput.select();
    document.execCommand("copy");
  }
  const original = copyPixBtn.textContent;
  copyPixBtn.textContent = "Copiado! ✓";
  setTimeout(() => { copyPixBtn.textContent = original; }, 2000);
});
