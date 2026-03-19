document.addEventListener("DOMContentLoaded", () => {

  const STAFF_PIN = "2024";

  injectStyles();

  function injectStyles(){
    if(document.getElementById("hybridStyles")) return;

    const style = document.createElement("style");
    style.id = "hybridStyles";
    style.textContent = `
    .hybridGame{display:grid;gap:16px;text-align:center}
    .mysteryGrid{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}
    .mysteryBox{
      border:1px solid rgba(255,255,255,.15);
      border-radius:10px;
      padding:10px;
      font-size:11px;
      font-weight:900;
      background:rgba(255,255,255,.05);
      cursor:pointer;
    }
    .mysteryBox.is-open{background:#d7b46a;color:#000}
    .mysteryBox.is-locked{opacity:.4}
    .reveal{font-size:18px;font-weight:900;margin-top:10px}
    .code{font-size:12px;color:#d7b46a;margin-top:5px}

    .puzzleGrid{
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
      max-width:260px;
      margin:10px auto;
    }

    .puzzlePiece{
      padding:12px;
      border-radius:10px;
      background:#222;
      color:#fff;
      border:1px solid rgba(255,255,255,.2);
      cursor:pointer;
      font-weight:900;
    }

    .puzzlePiece.correct{
      background:#d7b46a;
      color:#000;
    }

    .btn{
      padding:8px 14px;
      border-radius:8px;
      border:none;
      font-weight:900;
      cursor:pointer;
    }

    .gold{background:#d7b46a;color:#000}
    .ghost{background:#111;color:#fff;border:1px solid rgba(255,255,255,.2)}
    `;
    document.head.appendChild(style);
  }

  function renderGame(container){

    container.innerHTML = `
      <div class="hybridGame">

        <h3>ALLURE MYSTERY BOXES</h3>

        <div class="mysteryGrid">
          ${Array.from({length:24}).map((_,i)=>`
            <button class="mysteryBox">Box ${i+1}</button>
          `).join("")}
        </div>

        <div class="reveal">Pick a box</div>
        <div class="code"></div>

        <button class="btn gold" id="reset">New Round</button>

        <h4>Bonus Puzzle</h4>

        <div class="puzzleGrid">
          <button class="puzzlePiece" data="A">A</button>
          <button class="puzzlePiece" data="L">L</button>
          <button class="puzzlePiece" data="L">L</button>
          <button class="puzzlePiece" data="U">U</button>
          <button class="puzzlePiece" data="R">R</button>
          <button class="puzzlePiece" data="E">E</button>
        </div>

        <div id="puzzleText">Unlock reward first</div>

        <input type="password" placeholder="Staff PIN" id="pin">
        <button class="btn ghost" id="unlock">Staff Mode</button>

      </div>
    `;

    const boxes = [...container.querySelectorAll(".mysteryBox")];
    const reveal = container.querySelector(".reveal");
    const codeEl = container.querySelector(".code");

    let picks = 0;
    let maxPicks = 1;
    let win = null;

    const items = shuffle([
      "Free Shot","$2 Off","10% Off","VIP Skip",
      "Try Again","Try Again","Instagram","Address",
      "Phone","Special","Try Again","Vibes",
      "Free Shot","Try Again","$2 Off","Try Again",
      "VIP","Try Again","Instagram","Try Again",
      "Special","Try Again","$2 Off","Try Again"
    ]);

    boxes.forEach((box,i)=>{
      box.onclick=()=>{
        if(box.classList.contains("is-open")||picks>=maxPicks)return;

        box.classList.add("is-open");
        box.innerText=items[i];
        picks++;

        if(items[i].includes("Free")||items[i].includes("Off")||items[i]=="VIP"){
          win=items[i];
          const code="ALR-"+Math.floor(Math.random()*999999);
          reveal.innerText=win;
          codeEl.innerText=code;
        }else{
          reveal.innerText=items[i];
        }

        if(picks>=maxPicks){
          boxes.forEach(b=>!b.classList.contains("is-open")&&b.classList.add("is-locked"));
        }
      };
    });

    document.getElementById("reset").onclick=()=>renderGame(container);

    document.getElementById("unlock").onclick=()=>{
      const val=document.getElementById("pin").value;
      if(val==="2024"){
        maxPicks=2;
        alert("Staff mode ON");
      }
    };

    // puzzle
    const answer=["A","L","L","U","R","E"];
    let step=0;

    container.querySelectorAll(".puzzlePiece").forEach(btn=>{
      btn.onclick=()=>{
        if(!win){
          document.getElementById("puzzleText").innerText="Win first";
          return;
        }

        if(btn.dataset===answer[step]){
          btn.classList.add("correct");
          step++;
          if(step===answer.length){
            document.getElementById("puzzleText").innerText="BONUS UNLOCKED";
          }
        }else{
          step=0;
          document.querySelectorAll(".puzzlePiece").forEach(b=>b.classList.remove("correct"));
        }
      };
    });

  }

  function shuffle(a){
    return a.sort(()=>Math.random()-0.5);
  }

  // 🔥 attach to your menu panel
  const panel = document.querySelector(".menuPanelBody");
  if(panel){
    renderGame(panel);
  }

});