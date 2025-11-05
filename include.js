// include.js（共通ヘッダー・フッター読込スクリプト）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');
    // 絶対パス指定（/common/...）を相対参照（./common/...）に自動補正
    if (file.startsWith('/')) {
      file = '.' + file;
    }
    fetch(file)
      .then(res => res.text())
      .then(html => el.innerHTML = html)
      .catch(() => el.innerHTML = "<p>共通部分の読み込みに失敗しました。</p>");
  });
}
document.addEventListener('DOMContentLoaded', includeHTML);
