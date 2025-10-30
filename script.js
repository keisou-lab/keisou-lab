document.addEventListener("DOMContentLoaded", () => {
  const els = {
    cableType: document.getElementById("cableType"),
    voltage: document.getElementById("voltage"),
    current: document.getElementById("current"),
    distance: document.getElementById("distance"),
    dropRate: document.getElementById("dropRate"),
    result: document.getElementById("result"),
    calcBtn: document.getElementById("calcBtn")
  };

  // JSONデータを取得
  fetch("./cable_data.json")
    .then(res => res.json())
    .then(data => {
      // ケーブル一覧をプルダウンへ追加
      Object.keys(data).forEach(name => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = `${name}（${data[name].material}）`;
        els.cableType.appendChild(opt);
      });

      // 計算関数
      const calculate = () => {
        const type = els.cableType.value;
        const V = parseFloat(els.voltage.value);
        const I = parseFloat(els.current.value);
        const L = parseFloat(els.distance.value);
        const dropRate = parseFloat(els.dropRate.value);

        // 入力値チェック
        if (!type || isNaN(V) || isNaN(I) || isNaN(L) || isNaN(dropRate)) {
          els.result.innerHTML = "<p style='color:gray;'>⚙️ 数値をすべて入力してください。</p>";
          return;
        }

        const cable = data[type];
        const rho = cable.resistivity;
        const sections = cable.sections || [1.25, 2, 3.5, 5.5, 8, 14, 22];
        const maxDrop = (V * dropRate) / 100;
        const tempCoeff = 1 + 0.00393 * (25 - 20);

        let selected = null;
        for (let s of sections) {
          const R = (rho * 2 * L / s) * tempCoeff;
          const Vdrop = I * R;
          if (Vdrop <= maxDrop) {
            selected = { s, Vdrop };
            break;
          }
        }

        if (selected) {
          els.result.innerHTML = `
            <h3>${type} の計算結果</h3>
            <p>材質: ${cable.material}</p>
            <p>必要断面積: <strong>${selected.s} mm² 以上</strong></p>
            <p>予想電圧降下: ${selected.Vdrop.toFixed(2)} V（許容 ${maxDrop.toFixed(2)} V以内）</p>
          `;
        } else {
          els.result.innerHTML = `
            <p style='color:red;'>⚠️ この条件を満たす断面積が見つかりません。より太いケーブルを検討してください。</p>
          `;
        }
      };

      // 入力が変わるたびに即計算
      ["change", "keyup", "input"].forEach(eventType => {
        els.cableType.addEventListener(eventType, calculate);
        els.voltage.addEventListener(eventType, calculate);
        els.current.addEventListener(eventType, calculate);
        els.distance.addEventListener(eventType, calculate);
        els.dropRate.addEventListener(eventType, calculate);
      });

      // クリック計算（従来ボタンも残す）
      els.calcBtn.addEventListener("click", calculate);
    })
    .catch(err => {
      console.error("❌ JSON読込エラー:", err);
      els.result.innerHTML = "<p style='color:red;'>ケーブルデータを読み込めませんでした。</p>";
    });
});
