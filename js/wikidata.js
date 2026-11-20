// ===== wikidata.js: shared helpers used by every query file =====

// ---------- Helpers: load a query file and run it on Wikidata ----------

// Load a query file and return its text
async function loadQuery(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error('Could not find the file ' + path + ' (status ' + response.status + ')');
  }
  return await response.text();
}

// Send a query to Wikidata and return the result rows
async function runQuery(query) {
  const url = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(query);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Wikidata returned an error (status ' + response.status + ')');
  }
  const data = await response.json();
  return data.results.bindings;
}