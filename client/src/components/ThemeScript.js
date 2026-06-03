/** Inline script — runs before paint to avoid theme flash */
export default function ThemeScript() {
  const script = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var dark =
      saved === 'dark' ||
      (saved !== 'light' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
  } catch (e) {}
})();
`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
