import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import yahooFinance from "yahoo-finance2";

// Chart.js setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Fetch historical stock data
async function getStockData(ticker, startDate) {
  try {
    const period1 = Math.floor(new Date(startDate).getTime() / 1000);
    const period2 = Math.floor(new Date().getTime() / 1000);

    const queryOptions = {
      period1: period1,
      period2: period2,
      interval: "1d",
    };

    return await yahooFinance.historical(ticker, queryOptions);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return [];
  }
}

// Calculate EMA
function calculateEMA(data, periods) {
  const k = 2 / (periods + 1);
  let ema = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
}

// MACD Indicator
function calculateMACD(data) {
  const closePrices = data.map((d) => d.close);
  if (closePrices.length < 26) return { decision: "❌ Not enough data" };

  const shortEMA = calculateEMA(closePrices, 12);
  const longEMA = calculateEMA(closePrices, 26);
  const macd = shortEMA.map((short, i) => short - longEMA[i]);
  const signal = calculateEMA(macd, 9);

  const decision =
    macd[macd.length - 1] > signal[signal.length - 1] ? "✅ Buy" : "❌ Sell";

  return { macd, signal, decision };
}

// Williams Alligator Indicator
function calculateAlligator(data) {
  const closePrices = data.map((d) => d.close);
  if (closePrices.length < 13) return { decision: "❌ Not enough data" };

  const jaw = calculateEMA(closePrices, 13);
  const teeth = calculateEMA(closePrices, 8);
  const lips = calculateEMA(closePrices, 5);

  const decision =
    lips[lips.length - 1] > teeth[teeth.length - 1] &&
    teeth[teeth.length - 1] > jaw[jaw.length - 1]
      ? "✅ Buy"
      : "❌ Sell";

  return { jaw, teeth, lips, decision };
}

// Pivot Points
function calculatePivotPoints(data) {
  if (data.length < 2) return { decision: "❌ Not enough data" };

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];

  const pivot = (previous.high + previous.low + previous.close) / 3;
  const r1 = 2 * pivot - previous.low;
  const s1 = 2 * pivot - previous.high;
  const r2 = pivot + (previous.high - previous.low);
  const s2 = pivot - (previous.high - previous.low);

  const decision = latest.close > pivot ? "✅ Buy" : "❌ Sell";

  return { pivot, r1, s1, r2, s2, decision };
}

// VWAP (Volume Weighted Average Price)
function calculateVWAP(data) {
  if (data.length === 0) return { decision: "❌ Not enough data" };

  let cumulativeVolume = 0;
  let cumulativeVWAP = 0;

  data.forEach((d) => {
    cumulativeVWAP += ((d.high + d.low + d.close) / 3) * d.volume;
    cumulativeVolume += d.volume;
  });

  const vwap = cumulativeVWAP / cumulativeVolume;
  const decision = data[data.length - 1].close > vwap ? "✅ Buy" : "❌ Sell";

  return { vwap, decision };
}

// SuperTrend Indicator
function calculateSuperTrend(data) {
  if (data.length < 14) return { decision: "❌ Not enough data" };

  const atr = data.map((d, i) =>
    i > 0
      ? Math.max(
          d.high - d.low,
          Math.abs(d.high - data[i - 1].close),
          Math.abs(d.low - data[i - 1].close)
      ) : 0
  );
  const atrAvg = atr.reduce((sum, val) => sum + val, 0) / atr.length;

  const basicUpperBand = data.map((d) => (d.high + d.low) / 2 + 3 * atrAvg);
  const basicLowerBand = data.map((d) => (d.high + d.low) / 2 - 3 * atrAvg);

  const finalUpperBand = basicUpperBand[basicUpperBand.length - 1];
  const finalLowerBand = basicLowerBand[basicLowerBand.length - 1];

  const decision =
    data[data.length - 1].close > finalUpperBand ? "✅ Buy" : "❌ Sell";

  return { superTrend: finalUpperBand, decision };
}

// PCR (Put-Call Ratio) - Mocked for demonstration
async function calculatePCR(ticker) {
  const mockPCR = Math.random() * (1.5 - 0.5) + 0.5; // Random value between 0.5 and 1.5
  const decision = mockPCR < 0.9 ? "✅ Buy (Bullish)" : "❌ Sell (Bearish)";
  return { pcr: mockPCR.toFixed(2), decision };
}

// Main UI Component
const StockAnalysisUI = () => {
  const [ticker, setTicker] = useState("AAPL");
  const [startDate, setStartDate] = useState("2024-01-01");
  const [strategy, setStrategy] = useState("MACD");
  const [chartData, setChartData] = useState({});
  const [decision, setDecision] = useState("");

  const handleAnalyze = async () => {
    const data = await getStockData(ticker, startDate);
    if (data.length === 0) {
      setDecision("❌ No data found");
      return;
    }

    let indicator;
    switch (strategy.toUpperCase()) {
      case "MACD":
        indicator = calculateMACD(data);
        break;
      case "ALLIGATOR":
        indicator = calculateAlligator(data);
        break;
      case "PIVOT":
        indicator = calculatePivotPoints(data);
        break;
      case "VWAP":
        indicator = calculateVWAP(data);
        break;
      case "SUPERTREND":
        indicator = calculateSuperTrend(data);
        break;
      case "PCR":
        indicator = await calculatePCR(ticker);
        break;
      default:
        setDecision("❌ Invalid strategy");
        return;
    }

    setDecision(indicator.decision);

    const labels = data.map((d) => new Date(d.date).toLocaleDateString());
    const closePrices = data.map((d) => d.close);

    setChartData({
      labels,
      datasets: [
        {
          label: "Close Price",
          data: closePrices,
          borderColor: "rgba(75,192,192,1)",
          fill: false,
        },
        {
          label: strategy,
          data: indicator.macd || indicator.jaw || [indicator.vwap] || [indicator.superTrend],
          borderColor: "rgba(153,102,255,1)",
          fill: false,
        },
      ],
    });
  };

  return (
    <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
      <h1>Stock Analysis Dashboard</h1>
      <div>
        <label>
          Ticker:
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
          />
        </label>
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          Strategy:
          <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
            <option value="MACD">MACD</option>
            <option value="ALLIGATOR">Alligator</option>
            <option value="PIVOT">Pivot Points</option>
            <option value="VWAP">VWAP</option>
            <option value="SUPERTREND">SuperTrend</option>
            <option value="PCR">PCR</option>
          </select>
        </label>
        <button onClick={handleAnalyze}>Analyze</button>
      </div>
      <h2>Decision: {decision}</h2>
      {chartData.labels && <Line data={chartData} />}
    </div>
  );
};

export default StockAnalysisUI;