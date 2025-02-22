import React, { useState, useEffect } from 'react';
import { Search, BarChart2, Briefcase, Radio, X } from 'lucide-react';
import TopBar from '../components/Topbar';

const VISIBLE_ITEMS = 5;
const SLIDE_INTERVAL = 3000;

const getRandomData = (min, max) => {
  return Array.from({ length: 6 }, () => Math.random() * (max - min) + min);
};

const StockDetails = ({ stock, onClose }) => {
  if (!stock) return null;

  const isPositive = parseFloat(stock.changePercent) >= 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{stock.name}</h2>
            <div className="text-3xl font-semibold mt-2">
              {Number(stock.price).toLocaleString()}
            </div>
            <div className={isPositive ? 'text-green-500' : 'text-red-500'}>
              {isPositive ? '+' : ''}{stock.changePercent}%
            </div>
          </div>
          <div className="w-48 h-24">
            <MiniChart data={stock.chartData} isNegative={!isPositive} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400">Day High</div>
            <div className="text-xl">{stock.dayHigh}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400">Day Low</div>
            <div className="text-xl">{stock.dayLow}</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400">Volume</div>
            <div className="text-xl">{stock.volume?.toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400">52 Week High</div>
              <div>{stock.fiftyTwoWeekHigh || 'N/A'}</div>
            </div>
            <div>
              <div className="text-gray-400">52 Week Low</div>
              <div>{stock.fiftyTwoWeekLow || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const IndexCard = ({ data }) => {
  const isPositive = parseFloat(data.changePercent) >= 0;
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base md:text-lg">{data.name}</h3>
          <div className="text-xl md:text-2xl font-semibold mt-2">
            {Number(data.price).toLocaleString()}
          </div>
          <div className={isPositive ? 'text-green-500' : 'text-red-500'}>
            {isPositive ? '+' : ''}{data.changePercent}%
          </div>
        </div>
        <MiniChart data={data.chartData} isNegative={!isPositive} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
        <div>
          <div>Day High</div>
          <div className="text-white">{data.dayHigh}</div>
        </div>
        <div>
          <div>Day Low</div>
          <div className="text-white">{data.dayLow}</div>
        </div>
      </div>
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

const MarketMood = () => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  
  return (
    <div className="flex items-center gap-2 md:gap-8 overflow-x-auto">
      {days.map((day, index) => (
        <div key={day} className="flex flex-col items-center flex-shrink-0">
          <div 
            className={`w-8 h-8 md:w-12 md:h-12 rounded-full border-4 ${
              index < 3 ? 'border-green-500' : 'border-yellow-500'
            }`} 
          />
          <span className="text-gray-400 text-xs md:text-sm mt-2">{day}</span>
        </div>
      ))}
    </div>
  );
};

// const TopBar = ({ data, currentIndex, onPrev, onNext, onSelectStock }) => (
//   <div className="bg-gray-800 py-2 px-4 flex items-center justify-between">
//     <button 
//       onClick={onPrev}
//       className="text-gray-400 hover:text-white disabled:opacity-50"
//       disabled={currentIndex === 0}
//     >
//       <ChevronLeft />
//     </button>
//     <div className="flex gap-6 overflow-x-auto whitespace-nowrap px-4">
//       {data.slice(currentIndex, currentIndex + 3).map((item) => (
//         <div 
//           key={item.symbol} 
//           className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-3 py-1 rounded"
//           onClick={() => onSelectStock(item)}
//         >
//           <span className="text-sm md:text-base">{item.symbol}</span>
//           <span className="text-sm md:text-base">{item.price}</span>
//           <span className={parseFloat(item.changePercent) >= 0 ? 'text-green-500' : 'text-red-500'}>
//             {parseFloat(item.changePercent) >= 0 ? '+' : ''}{item.changePercent}%
//           </span>
//         </div>
//       ))}
//     </div>
//     <button 
//       onClick={onNext}
//       className="text-gray-400 hover:text-white disabled:opacity-50"
//       disabled={currentIndex >= data.length - 3}
//     >
//       <ChevronRight />
//     </button>
//   </div>
// );


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
            <h1 className="text-xl md:text-2xl mb-2 text-gray-900 dark:text-white">
              Market Status: <span className="text-orange-500 dark:text-orange-400">Live</span>
            </h1>
            <div className="flex gap-4 text-sm md:text-base">
              {marketData.indices.slice(0, 2).map(index => (
                <span 
                  key={index.name}
                  className={parseFloat(index.changePercent) >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'}
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