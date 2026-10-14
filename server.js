// GLF2 (GoodLifeFor2) - Algorithmic Sports Trading Engine
const axios = require('axios');

const API_KEY = '2262ca2e12055503c5d8cfa105b9bfa3';
const BASE_URL = 'https://api.the-odds-api.com/v4/sports';
const CHECK_INTERVAL_MS = 30000;

let systemState = {
  activeThreads: [
    { id: 'GLF2-Thread-1', balance: 100, status: 'HUNTING' }
  ],
  completedBets: 0,
  totalSplits: 0,
  totalSystemEquity: 100
};

console.log(`
===================================================
 🚀 GLF2 (GoodLifeFor2) TRADING ENGINE ONLINE
 🎯 TARGET ODDS RANGE: 1.01 - 1.05
 🔄 SPLIT MODEL: €100 -> €200 (Auto-Multiplication)
===================================================
`);

async function fetchLiveSportsOdds() {
  try {
    const sportsResponse = await axios.get(`${BASE_URL}?apiKey=${API_KEY}`);
    const activeSports = sportsResponse.data.slice(0, 5);

    console.log(`[GLF2 Engine] Scanning ${activeSports.length} active sports markets...`);

    for (const sport of activeSports) {
      const oddsResponse = await axios.get(`${BASE_URL}/${sport.key}/odds`, {
        params: {
          apiKey: API_KEY,
          regions: 'eu,us',
          markets: 'h2h',
          oddsFormat: 'decimal'
        }
      });

      processEventsForGLF2(oddsResponse.data, sport.title);
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error(`❌ [GLF2 Error] Invalid API key.`);
    } else {
      console.error(`⚠️ [GLF2 Feed Notice] Fetching odds: ${error.message}`);
    }
  }
}

function processEventsForGLF2(events, sportName) {
  for (const event of events) {
    if (!event.bookmakers || event.bookmakers.length === 0) continue;
    const bookmaker = event.bookmakers[0];
    const market = bookmaker.markets.find(m => m.key === 'h2h');
    if (!market) continue;

    for (const outcome of market.outcomes) {
      if (outcome.price >= 1.01 && outcome.price <= 1.05) {
        executeGLF2Trade({
          id: event.id,
          sport: sportName,
          homeTeam: event.home_team,
          awayTeam: event.away_team,
          selection: outcome.name,
          odds: outcome.price,
          bookmaker: bookmaker.title
        });
        return;
      }
    }
  }
}

function executeGLF2Trade(matchData) {
  let thread = systemState.activeThreads.find(t => t.status === 'HUNTING');
  if (!thread) return;

  thread.status = 'IN_PLAY';
  
  console.log(`\n---------------------------------------------------`);
  console.log(`⚡ [GLF2 ORDER PLACED] ${thread.id}`);
  console.log(`🏆 Sport: ${matchData.sport} (${matchData.bookmaker})`);
  console.log(`⚔️ Game: ${matchData.homeTeam} vs ${matchData.awayTeam}`);
  console.log(`🎯 Selection: ${matchData.selection} @ Odds: ${matchData.odds}`);
  console.log(`💰 Stake: €100.00`);
  console.log(`---------------------------------------------------\n`);

  setTimeout(() => {
    handleTradeResult(thread, matchData.odds);
  }, 5000);
}

function handleTradeResult(thread, odds) {
  const profit = 100 * (odds - 1);
  thread.balance += profit;
  systemState.completedBets++;
  thread.status = 'HUNTING';

  console.log(`✅ [GLF2 WIN] ${thread.id} won +€${profit.toFixed(2)}! New Balance: €${thread.balance.toFixed(2)}`);

  if (thread.balance >= 200) {
    systemState.totalSplits++;
    console.log(`\n🚀 [GLF2 SPLIT EVENT] ${thread.id} REACHED €200!`);
    console.log(`⚡ Splitting €200 into 2x €100 trading threads...`);

    thread.balance = 100;
    const newThreadId = `GLF2-Thread-${systemState.activeThreads.length + 1}`;
    systemState.activeThreads.push({
      id: newThreadId,
      balance: 100,
      status: 'HUNTING'
    });

    console.log(`✅ ${newThreadId} CREATED WITH €100.00! Total Threads: ${systemState.activeThreads.length}`);
  }

  updateSystemSummary();
}

function updateSystemSummary() {
  systemState.totalSystemEquity = systemState.activeThreads.reduce((sum, t) => sum + t.balance, 0);
  console.log(`\n📊 [GLF2 MONITOR] Active Threads: ${systemState.activeThreads.length} | Equity: €${systemState.totalSystemEquity.toFixed(2)} | Bets: ${systemState.completedBets}`);
}

fetchLiveSportsOdds();
setInterval(fetchLiveSportsOdds, CHECK_INTERVAL_MS);