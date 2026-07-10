import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function CustomDatePicker({ value, onChange, name, required }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date(2000, 0, 1));
  const [showYearPicker, setShowYearPicker] = useState(false);
  
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleDateSelect = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    onChange({ target: { name, value: `${yyyy}-${mm}-${dd}` } });
    setIsOpen(false);
  };

  const handleMonthChange = (increment) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const handleYearSelect = (year) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearPicker(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Display format DD/MM/YYYY
  let displayValue = '';
  if (value && !isNaN(new Date(value).getTime())) {
    const [y, m, d] = value.split('-');
    if (y && m && d) {
      displayValue = `${d}/${m}/${y}`;
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className="input flex items-center justify-between cursor-pointer bg-white" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={displayValue ? 'text-gray-900' : 'text-gray-400'}>
          {displayValue || 'DD/MM/YYYY'}
        </span>
        <Calendar className="w-5 h-5 text-gray-400" />
      </div>
      
      <input type="hidden" name={name} value={value} required={required} />

      {isOpen && (
        <div className="absolute z-50 mt-1 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-4 animate-fade-in">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button 
              type="button" 
              onClick={() => handleMonthChange(-1)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <span>{monthNames[currentDate.getMonth()]}</span>
              <button 
                type="button"
                onClick={() => setShowYearPicker(!showYearPicker)}
                className="hover:bg-gray-100 px-2 py-1 rounded-lg transition-colors ml-1 text-brand-green bg-green-50"
              >
                {currentDate.getFullYear()}
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => handleMonthChange(1)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Year Picker */}
          {showYearPicker ? (
            <div className="h-48 overflow-y-auto grid grid-cols-3 gap-2 p-1 pr-2 custom-scrollbar">
              {years.map(year => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`py-2 text-sm rounded-lg transition-colors ${
                    year === currentDate.getFullYear() ? 'bg-brand-green text-white font-bold' : 'bg-gray-50 text-gray-700 hover:bg-brand-green hover:text-white'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            /* Calendar Grid */
            <>
              <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-gray-400">
                {dayNames.map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-2"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected = value && 
                                     new Date(value).getDate() === day &&
                                     new Date(value).getMonth() === currentDate.getMonth() &&
                                     new Date(value).getFullYear() === currentDate.getFullYear();
                  
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      className={`p-2 w-8 h-8 flex items-center justify-center rounded-full transition-colors mx-auto ${
                        isSelected ? 'bg-brand-green text-white font-bold shadow-md' : 'text-gray-700 hover:bg-brand-green hover:text-white'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
