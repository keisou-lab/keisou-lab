// include.js（GitHub Pages完全対応版）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');

    // ✅ 現在のスクリプト(include.js)の位置を基準に共通パスを算出
    const scriptPath = document.currentScript ? document.currentScript.src : new URL('include.js', document.baseURI).href;
    const baseURL = new URL('./', scriptPath); // ← 相対でcommon/を解決できるように修正

    // common配下のみ共通読み込み（header/footer）
    if (file.includes('header.html')) file = new URL('common/header.html', baseURL);
    else if (file.includes('footer.html')) file = new URL('common/footer.html', baseURL);

    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => (el.innerHTML = html))
      .catch(err => {
        console.error(`Include failed: ${file}`, err);
        el.innerHTML = "<p>共通部分の読み込みに失敗しました。</p>";
      });
  });
}
document.addEventListener('DOMContentLoaded', includeHTML);
