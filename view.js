const tiers = {
  "Unranked": "Unranked",
  "S+": "S+",
  "S": "S",
  "A": "At",
  "B": "B",
  "C": "C",
  "D": "D",
  "F": "F"
};

const jsonTiers = Object.keys(tiers);
const tiersEl = document.getElementById("tiers");

jsonTiers.forEach(tierKey => {
  const row = document.createElement("div");
  row.className = "tier";
  row.dataset.tier = tierKey;

  const label = document.createElement("div");
  label.className = "tier-label";
  label.textContent = tiers[tierKey];

  const content = document.createElement("div");
  content.className = "tier-content";

  row.append(label, content);
  tiersEl.appendChild(row);
});

fetch("./tierlist.json")
  .then(r => r.json())
  .then(data => {
    Object.entries(data).forEach(([tierKey, players]) => {
      if (!jsonTiers.includes(tierKey)) return;

      const container = document.querySelector(
        `[data-tier="${tierKey}"] .tier-content`
      );

      players.forEach(name => {
        const card = document.createElement("div");
        card.className = "card";
        card.title = name;
        card.innerHTML = `
          <img src="https://mc-heads.net/avatar/${name}/64" />
          <span>${name}</span>
        `;
        container.appendChild(card);
      });
    });
  });
