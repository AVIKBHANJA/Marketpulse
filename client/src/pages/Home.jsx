import React, { useState, useEffect } from 'react';
import TopBar from '../components/Topbar';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Radio, X } from 'lucide-react';
import { FiSmile, FiMeh, FiFrown } from 'react-icons/fi';

const VISIBLE_ITEMS = 5;
const SLIDE_INTERVAL = 3000;

const getRandomData = (min, max, points = 24) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    value: Math.random() * (max - min) + min
  }));
};

const StockDetails = ({ stock, onClose }) => {
  if (!stock) return null;
  const isPositive = parseFloat(stock.changePercent) >= 0;
  const chartData = getRandomData(40, 60, 24);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-4xl w-full relative border border-gray-800">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{stock.name}</h2>
              <span className="text-gray-400 text-sm">{stock.symbol}</span>
            </div>
            <div className="text-4xl font-bold mt-3">
              ₹{Number(stock.price).toLocaleString()}
            </div>
            <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              <span className="text-lg">{isPositive ? '+' : ''}{stock.changePercent}%</span>
            </div>
          </div>
        </div>

        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? '#10b981' : '#ef4444'} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Day High', value: `₹${stock.dayHigh}` },
            { label: 'Day Low', value: `₹${stock.dayLow}` },
            { label: 'Volume', value: (stock.volume || 0).toLocaleString() },
            { label: 'Market Cap', value: `₹${(Math.random() * 1000000).toFixed(2)}Cr` }
          ].map((item, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4">
              <div className="text-gray-400 text-sm">{item.label}</div>
              <div className="text-xl mt-1">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Key Statistics</h3>
            <div className="space-y-4">
              {[
                { label: '52 Week High', value: `₹${stock.fiftyTwoWeekHigh}` },
                { label: '52 Week Low', value: `₹${stock.fiftyTwoWeekLow}` },
                { label: 'P/E Ratio', value: (Math.random() * 30 + 10).toFixed(2) }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{item.label}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Technical Indicators</h3>
            <div className="space-y-4">
              {[
                { label: 'RSI (14)', value: (Math.random() * 40 + 30).toFixed(2) },
                { label: 'MACD', value: 'Bullish', className: 'text-green-500' },
                { label: '20-Day MA', value: `₹${(parseFloat(stock.price) * (1 + Math.random() * 0.1)).toFixed(2)}` }
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-400">{item.label}</span>
                  <span className={item.className}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IndexCard = ({ data }) => {
  const isPositive = parseFloat(data.changePercent) >= 0;
  const chartData = getRandomData(40, 60, 12);
  
  return (
    <div className="dark:bg-gray-900 bg-gray-400 rounded-lg p-6 border dark:border-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-bold">{data.name}</h3>
          <div className="text-2xl font-bold mt-2">
            ₹{Number(data.price).toLocaleString()}
          </div>
          <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span>{isPositive ? '+' : ''}{data.changePercent}%</span>
          </div>
        </div>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isPositive ? '#10b981' : '#ef4444'} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="dark:text-gray-400 font-bold">Day High</div>
          <div className="font-medium mt-1">₹{data.dayHigh}</div>
        </div>
        <div>
          <div className="dark:text-gray-400 font-bold">Day Low</div>
          <div className="font-medium mt-1">₹{data.dayLow}</div>
        </div>
      </div>
    </div>
  );
};

const MarketMood = () => {
  const moods = [
    { day: 'MON', sentiment: 'positive' },
    { day: 'TUE', sentiment: 'positive' },
    { day: 'WED', sentiment: 'positive' },
    { day: 'THU', sentiment: 'neutral' },
    { day: 'FRI', sentiment: 'negative' }
  ];
  
  return (
    <div className="flex items-center gap-8">
      {moods.map(({ day, sentiment }) => (
        <div key={day} className="flex flex-col items-center group">
          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all ${
            sentiment === 'positive' 
              ? 'border-green-500 bg-green-500/20 text-green-500 hover:bg-green-500/30' :
            sentiment === 'negative' 
              ? 'border-red-500 bg-red-500/20 text-red-500 hover:bg-red-500/30' :
              'border-yellow-500 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
          }`}>
            {sentiment === 'positive' && <FiSmile className="w-6 h-6" />}
            {sentiment === 'neutral' && <FiMeh className="w-6 h-6" />}
            {sentiment === 'negative' && <FiFrown className="w-6 h-6" />}
          </div>
          <span className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors">
            {day}
          </span>
        </div>
      ))}
    </div>
  );
};


const MiniChart = ({ data, isNegative }) => (
  <svg className="w-24 h-12 md:w-32 md:h-16" viewBox="0 0 100 50">
    <path
      d={`M ${data.map((value, index) => 
        `${(index * 20)} ${50 - value}`
      ).join(' L ')}`}
      fill="none"
      stroke={isNegative ? '#ff4d4d' : '#4CAF50'}
      strokeWidth="2"
    />
  </svg>
);





const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [marketData, setMarketData] = useState({
    indices: [],
    tickers: []
  });
  const [loading, setLoading] = useState(true);

  const symbols = {
    indices: [
      { symbol: '^NSEI', name: 'NIFTY 50' },
      { symbol: '^BSESN', name: 'SENSEX' },
      { symbol: 'GC=F', name: 'Gold' }
    ],
    tickers: [
      { symbol: 'NIFTYBANK.NS', name: 'NIFTY BANK' },
      { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' },
      { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
      { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
      { symbol: 'INFY.NS', name: 'Infosys' },
      { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
      { symbol: 'TCS.NS', name: 'TCS' },
      { symbol: 'TATAMOTORS.NS', name: 'Tata Motors' }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const indicesSymbols = symbols.indices.map(s => s.symbol).join(',');
        const indicesRes = await fetch(`http://localhost:3000/api/finance?symbols=${indicesSymbols}`);
        const indicesQuotes = await indicesRes.json();

        const tickersSymbols = symbols.tickers.map(s => s.symbol).join(',');
        const tickersRes = await fetch(`http://localhost:3000/api/finance?symbols=${tickersSymbols}`);
        const tickersQuotes = await tickersRes.json();

        const mappedIndices = symbols.indices.map((symbolObj, index) => {
          const quote = indicesQuotes[index];
          return {
            ...symbolObj,
            price: quote?.regularMarketPrice?.toFixed(2) || 'N/A',
            changePercent: quote?.regularMarketChangePercent?.toFixed(2) || '0.00',
            change: quote?.regularMarketChange?.toFixed(2) || '0.00',
            volume: quote?.regularMarketVolume || 0,
            dayHigh: quote?.regularMarketDayHigh?.toFixed(2) || '0.00',
            dayLow: quote?.regularMarketDayLow?.toFixed(2) || '0.00',
            chartData: getRandomData(40, 60)
          };
        });

        const mappedTickers = symbols.tickers.map((symbolObj, index) => {
          const quote = tickersQuotes[index];
          return {
            ...symbolObj,
            price: quote?.regularMarketPrice?.toFixed(2) || 'N/A',
            changePercent: quote?.regularMarketChangePercent?.toFixed(2) || '0.00',
            change: quote?.regularMarketChange?.toFixed(2) || '0.00',
            volume: quote?.regularMarketVolume || 0,
            dayHigh: quote?.regularMarketDayHigh?.toFixed(2) || '0.00',
            dayLow: quote?.regularMarketDayLow?.toFixed(2) || '0.00',
            fiftyTwoWeekHigh: quote?.fiftyTwoWeekHigh?.toFixed(2) || 'N/A',
            fiftyTwoWeekLow: quote?.fiftyTwoWeekLow?.toFixed(2) || 'N/A',
            chartData: getRandomData(40, 60)
          };
        });

        setMarketData({
          indices: mappedIndices,
          tickers: mappedTickers
        });
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevTicker = () => {
    setTickerIndex(prev => 
      prev === 0 ? marketData.tickers.length - VISIBLE_ITEMS : prev - 1
    );
  };

  const handleNextTicker = () => {
    setTickerIndex(prev => 
      prev >= marketData.tickers.length - VISIBLE_ITEMS ? 0 : prev + 1
    );
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
  };

  const handleCloseDetails = () => {
    setSelectedStock(null);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading market data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <TopBar 
        data={marketData.tickers}
        currentIndex={tickerIndex}
        onPrev={handlePrevTicker}
        onNext={handleNextTicker}
        onSelectStock={handleStockSelect}
        visibleItems={VISIBLE_ITEMS}
        slideInterval={SLIDE_INTERVAL}
      />
      
  

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl mb-2">
              Market Status: <span className="text-orange-500">Live</span>
            </h1>
            <div className="flex gap-4 text-sm md:text-base">
              {marketData.indices.slice(0, 2).map(index => (
                <span 
                  key={index.name}
                  className={parseFloat(index.changePercent) >= 0 ? 'text-green-500' : 'text-red-500'}
                >
                  {index.name} {parseFloat(index.changePercent) >= 0 ? '▲' : '▼'} {Math.abs(index.changePercent)}%
                </span>
              ))}
            </div>
          </div>
          <MarketMood />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {marketData.indices.map((index) => (
            <IndexCard key={index.symbol} data={index} />
          ))}
        </div>
      </div>

      {selectedStock && (
        <StockDetails 
          stock={selectedStock} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default Home;