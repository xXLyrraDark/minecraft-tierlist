const tierNames = ["Unranked", "S+", "S", "A", "B", "C", "D", "F"];
const tiersEl = document.getElementById("tiers");

tierNames.forEach(tier => {
  const row = document.createElement("div");
  row.className = "tier";
  row.setAttribute("data-tier", tier);

  const label = document.createElement("div");
  label.className = "tier-label";
  label.textContent = tier;

  const content = document.createElement("div");
  content.className = "tier-content";

  row.append(label, content);
  tiersEl.appendChild(row);
});

function skullUrl(name) {
  return `https://mc-heads.net/avatar/${name}/64`;
}

fetch("./tierlist.json")
  .then(r => r.json())
  .then(data => {
    let entries;
    if (Array.isArray(data)) {
      entries = data.map(item => [item.name, item.tier]);
    } else {
      entries = Object.entries(data);
    }

    entries.forEach(([name, tier]) => {
      if (!tierNames.includes(tier)) tier = "Unranked";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${skullUrl(name)}" />
        <span>${name}</span>
      `;

      const container = document.querySelector(`[data-tier="${tier}"] .tier-content`);
      if (container) container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Failed to load tierlist.json:", err);
  });
