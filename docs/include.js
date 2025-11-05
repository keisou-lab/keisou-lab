// include.js（共通ヘッダー・フッター読込スクリプト）完全版
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');

    // ✅ 先頭に「/」がついていたら削除（GitHub Pagesルート対策）
    if (file.startsWith('/')) file = file.replace(/^\//, './');

    // ✅ 先頭に「./」「../」がない場合、強制的に「./」を付与
    if (!file.startsWith('.') && !file.startsWith('..')) {
      file = './' + file;
    }

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
