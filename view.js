const tierNames = ["Unranked", "S+", "S", "A", "B", "C", "D", "F"];
const tiersEl = document.getElementById("tiers");

tierNames.forEach(tier => {
  const row = document.createElement("div");
  row.className = "tier";
  row.dataset.tier = tier;

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
    Object.entries(data).forEach(([tier, players]) => {
      if (!tierNames.includes(tier)) return;

      const container = document.querySelector(
        `[data-tier="${tier}"] .tier-content`
      );

      players.forEach(name => {
        const card = document.createElement("div");
        card.title = name;
        card.className = "card";
        card.innerHTML = `
          <img src="${skullUrl(name)}" />
          <span>${name}</span>
        `;
        container.appendChild(card);
      });
    });
  })
  .catch(() => {});
