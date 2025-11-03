// include.js（共通ヘッダー・フッター読込スクリプト）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    const file = el.getAttribute('data-include');
    fetch(file)
      .then(res => res.text())
      .then(html => el.innerHTML = html)
      .catch(() => el.innerHTML = "<p>共通部分の読み込みに失敗しました。</p>");
  });
}
document.addEventListener('DOMContentLoaded', includeHTML);
