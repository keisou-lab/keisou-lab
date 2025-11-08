/* 電線の必要断面積計算ツール keisou-lab（GitHub Pages完全対応） */
const repo = window.location.pathname.split('/')[1];
const JSON_URL = `${window.location.origin}/${repo}/cable_data.json`;  // ✅ リポ名を自動付与して絶対URLにする

const cableTypeSel = document.getElementById("cableType");
const voltageInput = document.getElementById("voltage");
const currentInput = document.getElementById("current");
const distanceInput = document.getElementById("distance");
const dropInput = document.getElementById("dropRate");
const resultBox = document.getElementById("result");

let cableData = {};

// ==== ケーブルデータ読込 ====
fetch(JSON_URL)
  .then(r => {
    if (!r.ok) throw new Error("cable_data.json が読み込めませんでした");
    return r.json();
  })
  .then(json => {
    cableData = json;
    Object.keys(json).forEach(type => {
      const opt = document.createElement("option");
      opt.value = type;
      opt.textContent = `${type}（${json[type].material}）`;
      cableTypeSel.appendChild(opt);
    });
  })
  .catch(err => {
    console.error(err);
    alert("ケーブルデータの読み込みに失敗しました");
  });

// ==== 計算ボタン ====
document.getElementById("calcBtn").addEventListener("click", () => {
  const type = cableTypeSel.value;
  const V = Number(voltageInput.value);
  const I = Number(currentInput.value);
  const L = Number(distanceInput.value);
  const dropRate = Number(dropInput.value) / 100;

  if (!type || !V || !I || !L || !dropRate) {
    alert("ケーブル種類・電圧・電流・距離を入力してください。");
    return;
  }

  const rho = cableData[type]?.resistivity || 0.01724;
  const VdropAllow = V * dropRate;
  const Rmax = VdropAllow / (2 * I * L);
  const Areq = rho / Rmax;

  const nearest = (cableData[type]?.sections || []).find(a => a >= Areq) || "該当なし";

  resultBox.innerHTML = `
    <b>必要断面積：</b> ${Areq.toFixed(2)} mm²<br>
    <b>推奨サイズ：</b> ${
      nearest !== "該当なし"
        ? nearest + " mm²"
        : "<span style='color:red'>該当ケーブルなし</span>"
    }
  `;
});
