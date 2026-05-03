document.addEventListener('DOMContentLoaded', () => {
  // عناصر مهمة
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;
  const body = document.body;

  /* ========= Theme (light/dark) ========= */
  const savedTheme = localStorage.getItem('krava-theme'); // 'dark' or 'light'
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    // default mode (light)
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-pressed', 'false');
  }

  // toggle
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('krava-theme', 'light');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('krava-theme', 'dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });
});

  // chef-belly