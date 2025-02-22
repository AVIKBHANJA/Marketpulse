import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TopBar = ({ 
  data, 
  currentIndex, 
  onPrev, 
  onNext, 
  onSelectStock, 
  visibleItems = 5, 
  slideInterval = 3000 
}) => {
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  useEffect(() => {
    if (!isAutoSliding || data.length <= visibleItems) return;
    
    const interval = setInterval(() => {
      onNext();
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isAutoSliding, onNext, data.length, visibleItems, slideInterval]);

  const itemWidthPercentage = 100 / visibleItems;
  const containerWidth = (data.length * itemWidthPercentage);

  return (
    <div 
      className="bg-gray-800 py-2 px-4 flex items-center justify-between"
      onMouseEnter={() => setIsAutoSliding(false)}
      onMouseLeave={() => setIsAutoSliding(true)}
    >
      <button 
        onClick={onPrev}
        className="text-gray-400 hover:text-white disabled:opacity-50"
        disabled={currentIndex === 0 || data.length <= visibleItems}
      >
        <ChevronLeft />
      </button>

      <div className="flex-1 overflow-hidden mx-4">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * itemWidthPercentage}%)`,
            width: `${containerWidth}%`
          }}
        >
          {data.map((item) => (
            <div
              key={item.symbol}
              className="flex-shrink-0 flex items-center justify-center gap-4 cursor-pointer hover:bg-gray-700 px-4 py-2"
              style={{ width: `${itemWidthPercentage}%` }}
              onClick={() => onSelectStock(item)}
            >
              <span className="text-sm font-medium text-gray-100">
                {item.symbol}
              </span>
              <span className="text-sm text-gray-300">
                ${item.price}
              </span>
              <span className={`text-sm font-medium ${
                parseFloat(item.changePercent) >= 0 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {parseFloat(item.changePercent) >= 0 ? '+' : ''}
                {item.changePercent}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onNext}
        className="text-gray-400 hover:text-white disabled:opacity-50"
        disabled={currentIndex >= data.length - visibleItems || data.length <= visibleItems}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default TopBar;