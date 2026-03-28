document.addEventListener("DOMContentLoaded", () => {
  const CATEGORY_CONTENT = window.MENU_CATEGORY_CONTENT || {};

  /* =========================
     MOBILE DETECTION
  ========================= */
  function isMobile() {
    return window.innerWidth <= 768;
  }

  /* =========================
     FULLSCREEN GAME (VIP)
  ========================= */
  function openFullScreenGame(contentHTML) {
    if (!isMobile()) return null;

    const overlay = document.createElement("div");
    overlay.className = "vipGameOverlay";

    overlay.innerHTML = `
      <div class="vipGameContainer">
        ${contentHTML}
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    return overlay;
  }

  function closeFullScreenGame(overlay) {
    if (!overlay) return;
    overlay.remove();
    document.body.style.overflow = "";
  }

  /* =========================
     STYLE INJECTION (VIP)
  ========================= */
  function injectVIPStyles() {
    if (document.getElementById("vipGameStyles")) return;

    const style = document.createElement("style");
    style.id = "vipGameStyles";

    style.textContent = `
      .vipGameOverlay{
        position:fixed;
        inset:0;
        z-index:99999;
        background:#000;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .vipGameContainer{
        width:100%;
        height:100%;
        overflow:auto;
        padding:20px;
      }

      .mysteryGrid{
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:10px;
      }

      .mysteryBox{
        height:60px;
        border-radius:12px;
        background:linear-gradient(135deg,#111,#222);
        border:1px solid rgba(215,180,106,.3);
        color:#fff;
        font-weight:900;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;

        animation:vipPulse 2s infinite;
      }

      .mysteryBox:hover{
        transform:scale(1.05);
      }

      .mysteryBox.win{
        background:linear-gradient(135deg,#d4af37,#ffd700);
        color:#000;
        animation:vipWinFlash .5s ease;
      }

      @keyframes vipPulse{
        0%{box-shadow:0 0 0 rgba(215,180,106,0)}
        50%{box-shadow:0 0 20px rgba(215,180,106,.4)}
        100%{box-shadow:0 0 0 rgba(215,180,106,0)}
      }

      @keyframes vipWinFlash{
        0%{transform:scale(1)}
        50%{transform:scale(1.2)}
        100%{transform:scale(1)}
      }
    `;

    document.head.appendChild(style);
  }

  injectVIPStyles();

  /* =========================
     GAME LOGIC
  ========================= */
  function renderGame(panel) {
    const rewards = [
      "Free Shot",
      "$5 Off Hookah",
      "VIP Line Skip",
      "Free Mixer",
      "Try Again",
      "10% Off Food",
      "Free Red Bull",
      "$10 Off Bottle"
    ];

    const pool = [...rewards, ...rewards, ...rewards];

    const html = `
      <div class="hybridGame">
        <div class="hybridTitle">🎁 Mystery Box Game</div>
        <div class="mysteryGrid">
          ${Array.from({ length: 24 }).map((_, i) => `
            <div class="mysteryBox" data-box="${i}">
              ${i + 1}
            </div>
          `).join("")}
        </div>
      </div>
    `;

    let overlay = null;

    if (isMobile()) {
      overlay = openFullScreenGame(html);
      panel = overlay.querySelector(".vipGameContainer");
    } else {
      panel.innerHTML = html;
    }

    const boxes = [...panel.querySelectorAll(".mysteryBox")];
    let used = false;

    boxes.forEach((box, i) => {
      box.addEventListener("click", () => {
        if (used) return;
        used = true;

        const reward = pool[Math.floor(Math.random() * pool.length)];

        box.classList.add("win");
        box.textContent = "🎉";

        setTimeout(() => {
          alert("You won: " + reward);

          setTimeout(() => {
            if (overlay) closeFullScreenGame(overlay);
          }, 1500);

        }, 500);
      });
    });
  }

  /* =========================
     BUTTON HOOK
  ========================= */
  document.querySelectorAll("[data-cat='24box']").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = document.querySelector(".menuPanelBody");
      renderGame(panel);
    });
  });

});