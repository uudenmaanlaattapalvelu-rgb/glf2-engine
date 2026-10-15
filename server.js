const http = require('http');
const PORT = process.env.PORT || 10000;

// HTTP Health Check Listener for Render
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('GLF2 Engine Mock Simulation Active 24/7\n');
}).listen(PORT, () => {
  console.log(`🌐 GLF2 Health Check Listener active on port ${PORT}`);
});

// Engine Configuration
const CHECK_INTERVAL_MS = 10000; // Runs every 10 seconds in mock mode

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
 🚀 GLF2 (GoodLifeFor2) SIMULATION ENGINE ONLINE
 🎯 TARGET ODDS RANGE: 1.01 - 1.05
 🔄 SPLIT MODEL: €100 -> €200 (Auto-Multiplication)
 🧪 MODE: MOCK DATA SIMULATOR (0 API Credits Used)
===================================================
`);

// Mock Data Generator
function generateMockMatch() {
  const sports = ['Soccer - Premier League', 'Tennis - ATP', 'Basketball - NBA', 'Soccer - La Liga'];
  const teams = [
    { home: 'Real Madrid', away: 'Getafe', pick: 'Real Madrid Win' },
    { home: 'Man City', away: 'Burnley', pick: 'Man City Win' },
    { home: 'Alcaraz', away: 'Qualifier', pick: 'Alcaraz Win' },
    { home: 'Celtic', away: 'Dundee', pick: 'Celtic Win' }
  ];

  const match = teams[Math.floor(Math.random() * teams.length)];
  const sport = sports[Math.floor(Math.random() * sports.length)];
  const odds = parseFloat((1.01 + Math.random() * 0.04).toFixed(2));

  return {
    id: `mock-${Date.now()}`,
    sport: sport,
    homeTeam: match.home,
    awayTeam: match.away,
    selection: match.pick,
    odds: odds,
    bookmaker: 'Simulated Bookmaker'
  };
}

function runEngineCycle() {
  console.log(`\n[GLF2 Engine] Scanning simulated sports markets...`);
  
  const huntingThread = systemState.activeThreads.find(t => t.status === 'HUNTING');
  if (!huntingThread) {
    console.log(`⏳ [GLF2 Status] All ${systemState.activeThreads.length} thread(s) currently busy in trades.`);
    return;
  }

  const match = generateMockMatch();
  executeGLF2Trade(match, huntingThread);
}

function executeGLF2Trade(matchData, thread) {
  thread.status = 'IN_PLAY';
  
  console.log(`---------------------------------------------------`);
  console.log(`⚡ [GLF2 ORDER PLACED] ${thread.id}`);
  console.log(`🏆 Sport: ${matchData.sport} (${matchData.bookmaker})`);
  console.log(`⚔️ Match: ${matchData.homeTeam} vs ${matchData.awayTeam}`);
  console.log(`🎯 Pick: ${matchData.selection} @ Odds: ${matchData.odds}`);
  console.log(`💰 Stake: €100.00`);
  console.log(`---------------------------------------------------`);

  setTimeout(() => {
    handleTradeResult(thread, matchData.odds);
  }, 3000);
}

function handleTradeResult(thread, odds) {
  const profit = 100 * (odds - 1);
  thread.balance += profit;
  systemState.completedBets++;
  thread.status = 'HUNTING';

  console.log(`✅ [GLF2 WIN] ${thread.id} won +€${profit.toFixed(2)}! New Thread Balance: €${thread.balance.toFixed(2)}`);

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

    console.log(`✅ ${newThreadId} CREATED WITH €100.00! Active Threads: ${systemState.activeThreads.length}`);
  }

  updateSystemSummary();
}

function updateSystemSummary() {
  systemState.totalSystemEquity = systemState.activeThreads.reduce((sum, t) => sum + t.balance, 0);
  console.log(`📊 [GLF2 METRICS] Active Threads: ${systemState.activeThreads.length} | Equity: €${systemState.totalSystemEquity.toFixed(2)} | Total Bets: ${systemState.completedBets} | Splits: ${systemState.totalSplits}\n`);
}

runEngineCycle();
setInterval(runEngineCycle, CHECK_INTERVAL_MS);