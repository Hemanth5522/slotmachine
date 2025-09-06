let balance = 0;
const MAX_LINES = 3;
const MIN_BET = 1;
const MAX_BET = 100;

const symbol_count = {
  "🍒": 2,
  "🍋": 4,
  "💎": 6,
  "⭐": 8
};

const symbol_value = {
  "🍒": 5,
  "🍋": 4,
  "💎": 3,
  "⭐": 2
};

const depositBtn = document.getElementById("deposit-btn");
const depositInput = document.getElementById("deposit-input");
const balanceDisplay = document.getElementById("balance-display");
const betInput = document.getElementById("bet-input");
const linesInput = document.getElementById("lines-input");
const spinButton = document.getElementById("spin-btn");
const reels = document.querySelectorAll(".reel");

// Show message helper
function showMessage(msg, type="notify") {
  const box = document.getElementById("message-display");
  box.innerText = msg;
  box.className = type;
}

// Update balance display
function updateBalance() {
  balanceDisplay.innerText = `Balance: $${balance}`;
}

// Generate random slot spin
function getSlotMachineSpin() {
  const symbols = [];
  for (const [symbol, count] of Object.entries(symbol_count)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  const columns = [];
  for (let i = 0; i < reels.length; i++) {
    const column = [];
    const currentSymbols = [...symbols];
    for (let j = 0; j < 1; j++) {
      const randIndex = Math.floor(Math.random() * currentSymbols.length);
      column.push(currentSymbols[randIndex]);
      currentSymbols.splice(randIndex, 1);
    }
    columns.push(column);
  }
  return columns;
}

// Check winnings
function checkWinnings(columns, lines, bet) {
  let winnings = 0;
  for (let line = 0; line < lines; line++) {
    const symbol = columns[0][line % columns[0].length];
    let won = true;
    for (let col of columns) {
      if (col[line % col.length] !== symbol) {
        won = false;
        break;
      }
    }
    if (won) {
      winnings += symbol_value[symbol] * bet;
    }
  }
  return winnings;
}

// Deposit button
depositBtn.addEventListener("click", () => {
  const amount = parseInt(depositInput.value);
  if (isNaN(amount) || amount <= 0) {
    showMessage("⚠️ Enter a valid deposit amount.", "lose");
    return;
  }
  balance += amount;
  updateBalance();
  showMessage(`✅ You deposited $${amount}`, "notify");
  depositInput.value = "";
});

// Spin button
spinButton.addEventListener("click", () => {
  const bet = parseInt(betInput.value);
  const lines = parseInt(linesInput.value);

  if (isNaN(bet) || bet < MIN_BET || bet > MAX_BET) {
    showMessage(`⚠️ Bet must be between $${MIN_BET} and $${MAX_BET}.`, "lose");
    return;
  }
  if (isNaN(lines) || lines < 1 || lines > MAX_LINES) {
    showMessage(`⚠️ Lines must be between 1 and ${MAX_LINES}.`, "lose");
    return;
  }

  const totalBet = bet * lines;
  if (totalBet > balance) {
    showMessage(`❌ Not enough balance. Current balance: $${balance}`, "lose");
    return;
  }

  balance -= totalBet;
  updateBalance();

  // Start animation
  reels.forEach(reel => {
    reel.classList.add("spin");
    reel.textContent = "🎲";
  });

  // Stop animation and show result
  setTimeout(() => {
    const columns = getSlotMachineSpin();
    for (let i = 0; i < reels.length; i++) {
      reels[i].classList.remove("spin");
      reels[i].textContent = columns[i][0];
    }

    const winnings = checkWinnings(columns, lines, bet);
    balance += winnings;
    updateBalance();

    if (winnings > 0) {
      showMessage(`🎉 You won $${winnings}!`, "win");
    } else {
      showMessage("😢 You lost this round.", "lose");
    }
  }, 1500);
});
