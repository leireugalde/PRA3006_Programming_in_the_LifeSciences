// ===== query2.js: Section 2, other drugs and what they treat =====
// Uses loadQuery and runQuery from wikidata.js, and Chart from Chart.js

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
      indexAxis: 'y',                              // horizontal bars
      plugins: { legend: { display: false } },
      scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
    }
  });
}

// Query 2: show the query, make the link, draw the chart, fill the table
async function showQuery2() {
  const query = await loadQuery('queries/query2.rq');

  document.getElementById('query2-code').textContent = query;
  document.getElementById('query2-link').href =
    'https://query.wikidata.org/#' + encodeURIComponent(query);

  const rows = await runQuery(query);

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

  // bar chart (last, so a chart problem can never stop the table from showing)
  try {
    showDrugChart(groupByDrug(rows));
  } catch (error) {
    console.error(error);
    document.getElementById('query2-chart').replaceWith(
      document.createTextNode('(The chart could not be drawn: ' + error.message + ')')
    );
  }
}

showQuery2().catch(error => {
  console.error(error);
  document.getElementById('query2-count').textContent =
    '(could not load the data: ' + error.message + ')';
});