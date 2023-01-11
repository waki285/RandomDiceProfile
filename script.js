document.getElementById("form").addEventListener("submit", (e) => {
  e.preventDefault();
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
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(document.getElementById("image"), 0, 0);

  function fillText(text, baseX, baseY, maxWidth, firstFontSize = 50) {
    let fontSize = firstFontSize + 1;
    do {
      fontSize--;
      ctx.font = `${fontSize}px "Noto Sans JP", Arial, sans-serif`;
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
  ctx.fillStyle = "black";

  fillText(data.nickname, 72, 330, 400);
  fillText(data.crew || "なし", 500, 330, 400);
  fillText((isE(data.classmax) ? "(最大)":"") + (data.classtype + data.classnum), 68, 463, 400);
  fillText(data.crit + "%", 500, 463, 400);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

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
});