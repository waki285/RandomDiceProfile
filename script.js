const dice = [
  "沈黙", "養分", "召喚", "成長", "圧縮", "原子", "地震", "地獄", "地雷", "暗殺",
  "コンボ", "光の剣", "陰陽", "太陽", "台風", "核", "流れ", "バブル", "点火", "ジョーカー",
  "盾", "砂", "ロイヤル", "月", "吹雪", "過熱", "ix10", "雷雲", "星", "守護者",
  "充電", "スコープ" , "時間逆行", "転移", "時間", "銃", "重力操作"
]

let current = 0;

const favoritedice = document.getElementById("favoritedice");
favoritedice.innerHTML = dice.map((d, i) => `<option value="${i}">${d}</option>`).join("");


document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const status = document.getElementById("status");
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  if (location.search === "?debug") {
    document.getElementById("canvas").style.display = "block";
    document.getElementById("canvas").style.visibility = "visible";
  }
  console.log(data);
  if (data["deck-pvp"] && data["deck-pvp"].split("\n").length > 2) {
    alert("デッキは2行までにしてください");
    return;
  }
  if (data["deck-pve"] && data["deck-pve"].split("\n").length > 2) {
    alert("デッキは2行までにしてください");
    return;
  }
  current = 1;
  status.innerText = "描画中...";
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(document.getElementById("image"), 0, 0);

  function fillText(text, baseX, baseY, maxWidth, firstFontSize = 50) {
    let fontSize = firstFontSize + 1;
    do {
      fontSize--;
      ctx.font = `${fontSize}px ${data["font"] || '"Noto Sans JP", Arial, sans-serif'}`;
    } while (ctx.measureText(text).width > maxWidth);
    if (text.includes("\n")) {
      const [first, second] = text.split("\n");
      fillText(first, baseX, baseY - fontSize / 2, maxWidth, fontSize);
      fillText(second, baseX, baseY + fontSize / 2, maxWidth, fontSize);
      return;
    }
    ctx.fillText(text, baseX + (maxWidth - ctx.measureText(text).width) / 2, baseY + fontSize / 2);
  }
  function arc(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  function ellipse(x, y, w, h) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
  const isE = (data) => data === ""

  ctx.beginPath();
  ctx.fillStyle = data["text-color"] || "black";

  fillText(data.nickname, 72, 330, 400);
  fillText(data.crew || "なし", 500, 330, 400);
  fillText((isE(data.classmax) ? "(最大)" : "") + (data.classtype + data.classnum), 68, 463, 400);
  fillText(data.crit + "%", 500, 463, 400);

  ctx.strokeStyle = data["circle-color"] || "black";
  ctx.lineWidth = data["circle-width"] || 2;

  isE(data["f-pvp"]) && arc(202, 620, 50);
  isE(data["f-pve"]) && arc(372, 620, 50);
  isE(data["f-arcade"]) && arc(550, 620, 50);
  isE(data["f-crew"]) && arc(720, 620, 50);

  isE(data["s-discord"]) && arc(215, 795, 50);
  isE(data["s-twitter"]) && arc(377, 795, 50);
  isE(data["s-line"]) && arc(545, 795, 50);
  isE(data["s-kakao"]) && arc(725, 795, 50);

  isE(data["t-weekday"]) && ellipse(150, 955, 60, 25);
  isE(data["t-holiday"]) && ellipse(310, 955, 60, 25);
  isE(data["t-morning"]) && ellipse(450, 955, 50, 25);
  isE(data["t-noon"]) && ellipse(570, 955, 50, 25);
  isE(data["t-night"]) && ellipse(685, 955, 50, 25);
  isE(data["t-midnight"]) && ellipse(820, 955, 50, 25);

  isE(data["p-beginner"]) && ellipse(175, 1115, 80, 30);
  isE(data["p-adv"]) && ellipse(370, 1115, 80, 30);
  isE(data["p-bill"]) && ellipse(560, 1115, 80, 30);
  isE(data["p-nobill"]) && ellipse(775, 1115, 100, 30);

  data["deck-pvp"] && fillText(data["deck-pvp"], 931, 137, 805, 50);
  data["deck-pve"] && fillText(data["deck-pve"], 931, 330, 805, 50);
  data["comment"] && fillText(data["comment"], 931, 900, 805, 50);

  const selected = [...favoritedice].filter((d) => d.selected).map((d) => d.value);

  const selected2 = selected.map((s) => [s % 10, Math.floor(s / 10)]);

  for (const s of selected2) {
    arc(987 + s[0] * 75, 530 + s[1] * 66, 30);
  }

  status.innerText = "描画完了。出力中...";
  const dat = canvas.toDataURL("image/png");
  const generated = document.getElementById("generated");
  generated.src = dat;
  generated.style.display = "block";
  generated.width = 600;
  generated.height = 400;
  status.innerText = "出力完了";
  document.getElementById("download").disabled = false;
  current = 2;
});

document.getElementById("download").addEventListener("click", (e) => {
  if (current !== 2) return;
  const a = document.createElement("a");
  a.href = document.getElementById("generated").src;
  a.download = "generated.png";
  a.click();

});