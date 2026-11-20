// ===== tabs.js: switches between the tabs =====

// ---------- Tabs ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

function showTab(id) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === id));
  panels.forEach(p => p.classList.toggle('active', p.id === id));
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-tab]').forEach(button => {
  button.addEventListener('click', () => showTab(button.dataset.tab));
});
