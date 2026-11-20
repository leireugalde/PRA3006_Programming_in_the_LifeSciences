// ===== query1.js: Section 1, caffeine's receptors =====
// Uses loadQuery and runQuery from wikidata.js

// ---------- Query 1: caffeine's receptors ----------
async function showQuery1() {
  const query = await loadQuery('queries/query1.rq');

  document.getElementById('query1-code').textContent = query;
  document.getElementById('query1-link').href =
    'https://query.wikidata.org/#' + encodeURIComponent(query);

  const rows = await runQuery(query);
  const table = document.getElementById('query1-results');
  table.innerHTML = '';
  document.getElementById('query1-count').textContent = rows.length;

  rows.forEach(row => {
    const link = row.protein.value;
    const tr = document.createElement('tr');

    const nameCell = document.createElement('td');
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.textContent = row.proteinLabel.value;
    nameCell.appendChild(a);

    const idCell = document.createElement('td');
    idCell.textContent = link.split('/').pop();

    tr.appendChild(nameCell);
    tr.appendChild(idCell);
    table.appendChild(tr);
  });
}

showQuery1().catch(error => {
  console.error(error);
  const table = document.getElementById('query1-results');
  table.innerHTML = '';
  const tr = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = 2;
  cell.textContent = 'Could not load the data: ' + error.message;
  tr.appendChild(cell);
  table.appendChild(tr);
});