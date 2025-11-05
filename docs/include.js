// include.js（GitHub Pages完全対応・最終版）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');

    // ✅ ルート直下 /docs 配下を共通基準に変換
    if (file.startsWith('/')) {
      file = window.location.origin + '/docs' + file;
    } else if (!file.startsWith('.') && !file.startsWith('..')) {
      file = './' + file;
    }

    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.text();
      })
      .then(html => {
        el.innerHTML = html;
      })
      .catch(err => {
        console.error(`Include failed: ${file}`, err);
        el.innerHTML = "<p>共通部分の読み込みに失敗しました。</p>";
      });
  });
}

document.addEventListener('DOMContentLoaded', includeHTML);
