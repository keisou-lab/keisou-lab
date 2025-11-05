// include.js（GitHub Pages完全対応版）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');

    // GitHub PagesのルートURLを自動判定
    const baseURL = window.location.origin + '/common/';

    // common配下のみ共通読み込み（header/footer）
    if (file.includes('header.html')) file = baseURL + 'header.html';
    else if (file.includes('footer.html')) file = baseURL + 'footer.html';

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
