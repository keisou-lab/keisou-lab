// include.js（共通ヘッダー・フッター読込スクリプト）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');
    if (file.startsWith('/')) file = '.' + file;
    fetch(file)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.text();
      })
      .then(html => el.innerHTML = html)
      .catch(err => {
        console.error("Include failed:", file, err);
        el.innerHTML = "<p>共通部分の読み込みに失敗しました。</p>";
      });
  });
}
