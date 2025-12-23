let allCryptos = [];
let filteredCryptos = [];

const cryptoGrid = document.getElementById("cryptoGrid");
const loadingGrid = document.getElementById("loadingGrid");
const errorDiv = document.getElementById("error");
const refreshBtn = document.getElementById("refreshBtn");
console.log(refreshBtn);
const searchInput = document.getElementById("searchInput");
const lastUpdated = document.getElementById("lastUpdated");

const topCryptos = [
  "bitcoin",
  "ethereum",
  "binancecoin",
  "cardano",
  "dogecoin",
  "stellar",
  "ripple",
  "polkadot",
  "litecoin",
  "chainlink",
  "uniswap",
  "bitcoin-cash",
  "solana",
  "avalanche-2",
  "terra-luna",
  "algorand",
  "vechain",
  "filecoin",
  "tron",
  "cosmos",
  "tezos",
  "monero",
  "eos",
  "aave",
  "shiba-inu",
  "crypto-com-chain",
  "fantom",
  "hedera-hashgraph",
  "the-sandbox",
  "theta-token",
  "zcash",
  "pepecoin",
  "arweave",
  "gala",
  "immutable-x",
  "loopring",
  "enjincoin",
  "basic-attention-token",
  "sui",
  "bitget-token",
  "kucoin-token",
  "bittorrent",
  "pancakeswap-token",
  "maker",
  "neo",
  "klaytn",
  "convex-finance",
  "ecash",
  "chiliz",
  "gatechain-token",
  "ethereum-classic",
  "flow",
  "mina",
  "elrond-erd",
  "apecoin",
  "near",
  "internet-computer",
  "quant",
  "eos",
  "axie-infinity",
  "decentraland",
  "gala",
  "arweave",
  "hedera-hashgraph",
  "pepecoin",
  "loopring",
  "basic-attention-token",
  "ken",
  "arbitrum",
  "optimism",
  "base",
  "mantle",
  "polygon",
  "toncoin",
  "dogwifhat",
  "floki",
  "bonk",
  "book-of-meme",
  "render-token",
  "fetch-ai",
  "injective-protocol",
  "the-graph",
  "maker",
  "neo",
  "klaytn",
  "convex-finance",
  "ecash",
  "chiliz",
  "kucoin-token",
  "gatechain-token",
  "ethereum-classic",
  "flow",
  "mina",
  "elrond-erd",
  "apecoin",
  "near",
  "internet-computer",
  "quant",
];

async function fetchCryptoData() {
  try {
    showLoading(true);
    hideError();

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${topCryptos.join(
        ","
      )}&order=market_cap_desc&per_page=100&page=1&sparkline=falseprice_change_percentage=1h,24h,7d`
    );

    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }

    const data = await response.json();
    console.log(data);
    allCryptos = data;
    filteredCryptos = data;

    displayCryptos(filteredCryptos);
    updateLastUpdatedTime();
    showLoading(false);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    showLoading(false);
    showError();
  }
}

function displayCryptos(cryptos) {
  if (cryptos.length === 0) {
    cryptoGrid.innerHTML =
      '<div style="text-align: center; color:white; padding: 40px;">No cryptocurrencies found matching your search criteria.</div>';
    return;
  }

  cryptoGrid.innerHTML = cryptos
    .map((crypto) => {
      const priceChange1h = crypto.price_change_percentage_1h || 0;
      const priceChange24h = crypto.price_change_percentage_24h || 0;
      const priceChange7d = crypto.price_change_percentage_7d || 0;

      return `
                <div class="crypto-card">
          <div class="crypto-header">
            <div class="crypto-info">
              <img
                src="${crypto.image}"
                alt="${crypto.name}"
                class="crypto-icon"
              />
              <div>
                <div class="crypto-name">${crypto.name}</div>
                <div class="crypto-symbol">${crypto.symbol}</div>
              </div>
            </div>
            <div class="crypto-rank">#${crypto.markst_cap_rank || "N/A"}</div>
          </div>

          <div class="crypto-price">$${formatPrice(crypto.current_price)}</div>

          <div class="market-cap">
            Market Cap: $${formatLargeNumber(crypto.market_cap)}
          </div>

          <div class="crypto-changes">
            <div class="change-item">
              <div class="change-label">1H</div>
              <div class="change-value ${getChangedClass(priceChange1h)}">
                ${formatPercentage(priceChange1h)}
              </div>
            </div>

            <div class="change-item">
              <div class="change-label">24H</div>
              <div class="change-value ${getChangedClass(priceChange24h)}">
                ${formatPercentage(priceChange24h)}
              </div>
            </div>

            <div class="change-item">
              <div class="change-label">7D</div>
              <div class="change-value ${getChangedClass(priceChange7d)}">
                ${formatPercentage(priceChange7d)}
              </div>
            </div>

            <div class="change-item">
              <div class="change-label">Volume 24H</div>
              <div class="change-value neutral">
                ${formatLargeNumber(crypto.total_volume)}
              </div>
            </div>
          </div>
        </div>
            `;
    })
    .join("");
}

function formatPrice(price) {
  if (price >= 1) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return price.toFixed(6);
  }
}

function formatLargeNumber(num) {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + "T";
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + "B";
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + "M";
  } else {
    return num.toLocaleString("en-US");
  }
}

function formatPercentage(percentage) {
  if (percentage === null || percentage === undefined) {
    return "N/A";
  }
  const sign = percentage >= 0 ? "+" : "";
  return `${sign}${percentage.toFixed(2)}%`;
}

function getChangedClass(percentage) {
  if (percentage > 0) {
    return "positive";
  }
  if (percentage < 0) {
    return "negative";
  }
  return "neutral";
}

function showLoading(show) {
  loadingGrid.style.display = show ? "block" : "none";
  if (show) {
    refreshBtn.classList.add("loading");
    refreshBtn.disabled = true;
  } else {
    refreshBtn.classList.remove("loading");
    refreshBtn.disabled = false;
  }
}

function showError() {
  errorDiv.classList.add("show");
}

function hideError() {
  errorDiv.classList.remove("show");
}

function updateLastUpdatedTime() {
  const now = new Date();
  lastUpdated.textContent = `Last Update: ${now.toLocaleTimeString()}`;
}

function filterCryptos(searchTerm) {
  const term = searchTerm.toLowerCase().trim();

  if (!term) {
    filteredCryptos = allCryptos;
  } else {
    // filteredCryptos = allCryptos.filter(
    //   (crpto) =>
    //     crypto.name.toLowerCase().includes(term) ||
    //     crypto.symbol.toLowerCase().includes(toLocaleTimeString)
    // );
    filteredCryptos = allCryptos.filter((crypto) => {
      const name = crypto.name?.toLowerCase() || "";
      const symbol = crypto.symbol?.toLowerCase() || "";

      return name.includes(term) || symbol.includes(term);
    });
  }

  displayCryptos(filteredCryptos);
}

refreshBtn.addEventListener("click", fetchCryptoData);

searchInput.addEventListener("input", (e) => {
  filterCryptos(e.target.value);
});

setInterval(fetchCryptoData, 60000);
fetchCryptoData();

// ||  Converter Section

function showCurrencyName() {
  var selectCurrency = document.getElementById("toCurrency");
  var currencyName = selectCurrency.options[selectCurrency.selectedIndex].text;
  document.getElementById("currencyName").innerHTML = currencyName;
}

function showFromCurrencyName() {
  var selectFromCurrency = document.getElementById("fromCurrency");
  var fromCurrencyName =
    selectFromCurrency.options[selectFromCurrency.selectedIndex].text;
  document.getElementById("fromCurrencyName").innerHTML = fromCurrencyName;
}

const amountInput = document.querySelector("#amount");
const fromCurrencySelect = document.querySelector("#fromCurrency");
const toCurrencySelect = document.querySelector("#toCurrency");
const convertButton = document.querySelector("#convert");
const resultParagraph = document.querySelector("#result");

convertButton.addEventListener("click", () => {
  const amount = Number(amountInput.value);
  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = toCurrencySelect.value;

  // Improvement: Use a config object or environment variables
  const CONFIG = {
    CRYPTO_COMPARE_KEY:
      "b70ce2e15abfbd7c24857c35c44d04b73ab841f071a52f7cdf1c1729817a9535",
    BASE_URL: "https://min-api.cryptocompare.com/data",
  };

  const apiUrl = `${CONFIG.BASE_URL}/price?fsym=${toCurrency}&tsyms=${fromCurrency}&api_key=${CONFIG.CRYPTO_COMPARE_KEY}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const rate = data[fromCurrency];

      if (!rate) {
        throw new Error("Invalid exchange rate");
      }

      const result = amount / rate;

      resultParagraph.innerHTML = `${amount} ${fromCurrency} is equal to ${result.toFixed(
        6
      )} ${toCurrency}`;
    })
    .catch((error) => {
      resultParagraph.innerHTML = "Error: Unable to fetch exchange rate.";
      console.error(error);
    });
});
