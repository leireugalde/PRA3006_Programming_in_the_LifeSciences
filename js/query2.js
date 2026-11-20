// ===== query2.js: Section 2, other drugs and what they treat =====
// Uses loadQuery and runQuery from wikidata.js, and Chart from Chart.js

// ---------- Helpers for Section 2: cards and chart ----------

// Group the rows by drug: { "dantrolene": { link: "...", conditions: [...] }, ... }
function groupByDrug(rows) {
  const groups = {};
  rows.forEach(row => {
    const name = row.drugLabel.value;
    if (!groups[name]) {
      groups[name] = { link: row.drug.value, conditions: [] };
    }
    groups[name].conditions.push(row.conditionLabel.value);
  });
  return groups;
}

// One card per drug, with its conditions as pills
function showDrugCards(groups) {
  const container = document.getElementById('query2-cards');
  container.innerHTML = '';

  Object.keys(groups).forEach(name => {
    const card = document.createElement('div');
    card.className = 'drug-card';

    const title = document.createElement('h4');
    const link = document.createElement('a');
    link.href = groups[name].link;
    link.target = '_blank';
    link.textContent = name;
    title.appendChild(link);

    const count = document.createElement('p');
    count.className = 'count';
    count.textContent = groups[name].conditions.length + ' condition(s) treated';

    card.appendChild(title);
    card.appendChild(count);

    groups[name].conditions.forEach(condition => {
      const pill = document.createElement('span');
      pill.className = 'pill';
      pill.textContent = condition;
      card.appendChild(pill);
    });

    container.appendChild(card);
  });
}

// Bar chart: number of conditions per drug
function showDrugChart(groups) {
  const names = Object.keys(groups);
  const counts = names.map(name => groups[name].conditions.length);

  new Chart(document.getElementById('query2-chart'), {
    type: 'bar',
    data: {
      labels: names,
      datasets: [{
        label: 'Number of conditions treated',
        data: counts,
        backgroundColor: '#e8743b',
        borderRadius: 6
      }]
    },
    options: {
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

// ---------- Query 2: other drugs and what they treat ----------
async function showQuery2() {
  const query = await loadQuery('queries/query2.rq');

  document.getElementById('query2-code').textContent = query;
  document.getElementById('query2-link').href =
    'https://query.wikidata.org/#' + encodeURIComponent(query);

  const rows = await runQuery(query);

  // cards and bar chart
  const groups = groupByDrug(rows);
  showDrugCards(groups);
  showDrugChart(groups);

  // full table
  const table = document.getElementById('query2-results');
  table.innerHTML = '';
  document.getElementById('query2-count').textContent = rows.length;

  rows.forEach(row => {
    const tr = document.createElement('tr');

    const drugCell = document.createElement('td');
    const drugLink = document.createElement('a');
    drugLink.href = row.drug.value;
    drugLink.target = '_blank';
    drugLink.textContent = row.drugLabel.value;
    drugCell.appendChild(drugLink);

    const conditionCell = document.createElement('td');
    const conditionLink = document.createElement('a');
    conditionLink.href = row.condition.value;
    conditionLink.target = '_blank';
    conditionLink.textContent = row.conditionLabel.value;
    conditionCell.appendChild(conditionLink);

    tr.appendChild(drugCell);
    tr.appendChild(conditionCell);
    table.appendChild(tr);
  });
}

showQuery2().catch(error => {
  console.error(error);
  document.getElementById('query2-cards').textContent =
    'Could not load the data: ' + error.message;
});