// include.js（GitHub Pages完全対応：どのフォルダ階層でも共通HTMLを正しく読み込む）
function includeHTML() {
  document.querySelectorAll('[data-include]').forEach(el => {
    let file = el.getAttribute('data-include');

    // ✅ 現在のリポジトリ名を自動抽出（例: keisou-lab-site）
    const repo = window.location.pathname.split('/')[1];

    // ✅ 正しい共通ファイルURLを生成（常にルート直下の common/ を指す）
    const baseURL = `${window.location.origin}/${repo}/common/`;

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
