const { extractMainType } = require('./src/utils/scryfallApi.js'); // Cannot require ts file easily without transpiling.

async function testFetch() {
  const query = `t:creature r<=uncommon f:standard`;
  console.log("Fetching: " + `https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=edhrec&dir=desc`);
  const start = Date.now();
  try {
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(query)}&order=edhrec&dir=desc`);
    const data = await response.json();
    console.log("Success in", Date.now() - start, "ms");
    console.log("Total cards:", data.total_cards);
  } catch (e) {
    console.error("Error", e);
  }
}
testFetch();
