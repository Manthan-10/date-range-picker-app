import React from 'react';
import DateRangePicker from './Components/DateRangePicker';

const App = () => {
  const handleDateRangeChange = (dateRange, weekendDates) => {
    console.log('Selected Date Range:', dateRange);
    console.log('Weekend Dates:', weekendDates);
  };

  return (
    <div>
      <DateRangePicker 
        predefinedRanges={['Last 7 Days', 'Last 30 Days']}
        onChange={handleDateRangeChange}
      />
    </div>
  );
};

export default App;