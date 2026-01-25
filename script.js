const tierNames = ["Unranked", "S+", "S", "A", "B", "C", "D", "F"];

const state = {};
tierNames.forEach(t => state[t] = []);

const tiersEl = document.getElementById("tiers");
const nameInput = document.getElementById("nameInput");
const addBtn = document.getElementById("addBtn");
const importBtn = document.getElementById("importBtn");
const exportBtn = document.getElementById("exportBtn");
const fileInput = document.getElementById("fileInput");

tierNames.forEach(tier => {
  const row = document.createElement("div");
  row.className = "tier";
  row.dataset.tier = tier;

  const label = document.createElement("div");
  label.className = "tier-label";
  label.textContent = tier;

  const content = document.createElement("div");
  content.className = "tier-content";

  row.addEventListener("dragover", e => e.preventDefault());

  row.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);

    const cards = [...content.children];
    const after = cards.find(c =>
      e.clientX < c.getBoundingClientRect().left + c.offsetWidth / 2
    );

    if (after) content.insertBefore(card, after);
    else content.appendChild(card);

    rebuildState();
  });

  row.append(label, content);
  tiersEl.appendChild(row);
});

function skullUrl(name) {
  return `https://mc-heads.net/avatar/${name}/64`;
}

function rebuildState() {
  tierNames.forEach(tier => {
    const cards = document.querySelectorAll(
      `[data-tier="${tier}"] .card`
    );
    state[tier] = Array.from(cards).map(c => c.dataset.name);
  });
}

function addPlayer(name = null, tier = "Unranked") {
  const playerName = name || nameInput.value.trim();
  if (!playerName) return;

  const card = document.createElement("div");
  card.className = "card";
  card.id = `card-${playerName}`;
  card.dataset.name = playerName;
  card.draggable = true;

  card.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text/plain", card.id);
  });

  card.innerHTML = `
    <img src="${skullUrl(playerName)}" draggable="false" />
    <span>${playerName}</span>
  `;

  document
    .querySelector(`[data-tier="${tier}"] .tier-content`)
    .appendChild(card);

  rebuildState();
  if (!name) nameInput.value = "";
}

function exportJSON() {
  rebuildState();
  const blob = new Blob(
    [JSON.stringify(state, null, 2)],
    { type: "application/json" }
  );
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "tierlist.json";
  a.click();
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);

      tierNames.forEach(tier => {
        const container = document.querySelector(
          `[data-tier="${tier}"] .tier-content`
        );
        container.innerHTML = "";
        state[tier] = [];
      });

      Object.entries(data).forEach(([tier, players]) => {
        if (!tierNames.includes(tier)) return;
        players.forEach(name => addPlayer(name, tier));
      });
    } catch {
      alert("Invalid JSON file!");
    }
  };
  reader.readAsText(file);
}

addBtn.addEventListener("click", () => addPlayer());
exportBtn.addEventListener("click", exportJSON);
importBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", e => {
  if (e.target.files.length) importJSON(e.target.files[0]);
});

nameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addPlayer();
});

window.addEventListener("beforeunload", e => {
  e.preventDefault();
  e.returnValue = "";
});
