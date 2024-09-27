import React, { useState } from 'react';

/**
 * Utility function to check if a date falls on a weekend.
 *
 * @param {Date} date - The date to check.
 * @returns {boolean} - Returns true if the date is Saturday or Sunday, false otherwise.
 */
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

/**
 * Normalizes a date to the local timezone.
 *
 * @param {Date|string} date - The date to normalize, can be a Date object or a date string.
 * @returns {Date} - A Date object in the user's local timezone.
 */
const normalizeDate = (date) => {
  const localDate = new Date(date);
  return new Date(localDate.toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }));
};

/**
 * Generates an array of weekend dates within a given date range.
 *
 * @param {Date|string} start - The start date of the range.
 * @param {Date|string} end - The end date of the range.
 * @returns {Array<string>} - An array of weekend dates (formatted as YYYY-MM-DD) within the range.
 */
const getWeekendDates = (start, end) => {
  const weekends = [];
  let currentDate = normalizeDate(new Date(start));

  while (currentDate <= normalizeDate(new Date(end))) {
    if (isWeekend(currentDate)) {
      weekends.push(currentDate.toISOString().split('T')[0]);
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekends;
};

/**
 * DateRangePicker Component
 * 
 * A date range picker component that allows users to select a range of dates,
 * while only allowing weekdays (Monday to Friday) for selection. The component
 * provides a way to select predefined ranges and displays weekend dates within
 * the selected range.
 * 
 * @param {Array<string>} props.predefinedRanges - An array of predefined date range options (e.g., Last 7 Days).
 * @param {function} props.onChange - Callback function to handle changes in selected date range.
 */
const DateRangePicker = ({ predefinedRanges = [], onChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [weekendDates, setWeekendDates] = useState([]);

  /**
   * Handles the click event for a date cell.
   * 
   * @param {Date} date - The date that was clicked.
   */
  const handleDateClick = (date) => {
    const normalizedDate = normalizeDate(date);
    
    // Prevent selecting weekends
    if (isWeekend(normalizedDate)) return; 
  
    if (!startDate || (startDate && endDate)) {
      setStartDate(normalizedDate);
      setEndDate(null);
      setWeekendDates([]);
    } else if (startDate && !endDate) {
      if (normalizedDate > startDate) {
        setEndDate(normalizedDate);
        const weekendDates = getWeekendDates(startDate, normalizedDate);
        setWeekendDates(weekendDates);
        
        onChange([
          startDate.toISOString().split('T')[0],
          normalizedDate.toISOString().split('T')[0]
        ], weekendDates);
      } else {
        // Resetting start date to the new selection
        setStartDate(normalizedDate); 
        setWeekendDates([]);
      }
    }
  };

  /**
   * Renders the calendar for the selected month and year.
   * 
   * @returns {Array<JSX.Element>} - An array of JSX elements representing the calendar.
   */
  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const calendar = [];

    // Adding day names header
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    calendar.push(
      <div className="day-names" key="day-names">
        {dayNames.map((day, index) => (
          <div key={index} className="day-name">
            {day}
          </div>
        ))}
      </div>
    );

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = (startDate && date.toDateString() === startDate.toDateString()) || 
                         (endDate && date.toDateString() === endDate.toDateString());
      const isHighlighted = startDate && endDate && date >= startDate && date <= endDate;

      calendar.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`date-cell ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''} ${isWeekend(date) ? 'weekend' : ''}`}
        >
          {day}
        </div>
      );
    }

    return calendar;
  };

  /**
   * Handles the click event for predefined date ranges.
   * 
   * @param {string} range - The predefined range that was clicked (e.g., 'Last 7 Days').
   */
  const handlePredefinedRangeClick = (range) => {
    const today = new Date();
    let start, end;

    switch (range) {
      case 'Last 7 Days':
        end = today;
        start = new Date(today);
        start.setDate(today.getDate() - 6);
        break;
      case 'Last 30 Days':
        end = today;
        start = new Date(today);
        start.setDate(today.getDate() - 29);
        break;
      default:
        return;
    }

    setStartDate(start);
    setEndDate(end);
    const weekendDates = getWeekendDates(start, end);
    setWeekendDates(weekendDates);
    onChange([start.toISOString().split('T')[0], end.toISOString().split('T')[0]], weekendDates);
  };

  return (
    <div className="date-range-picker">
      <h1>Date Range Picker</h1>
      <div className="controls">
        <select value={currentMonth} onChange={(e) => setCurrentMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, index) => (
            <option key={index} value={index}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select value={currentYear} onChange={(e) => setCurrentYear(Number(e.target.value))}>
          {Array.from({ length: 50 }, (_, index) => (
            <option key={index} value={currentYear - 10 + index}>
              {currentYear - 10 + index}
            </option>
          ))}
        </select>
      </div>
      <div className="calendar">
        {renderCalendar()}
      </div>
      <div className="predefined-ranges">
        {predefinedRanges.map((range) => (
          <button key={range} onClick={() => handlePredefinedRangeClick(range)}>
            {range}
          </button>
        ))}
      </div>
      <div className="selected-range">
        {startDate && endDate && (
            <>
                <p>Selected Date Range: {startDate.toISOString().split('T')[0]} - {endDate.toISOString().split('T')[0]}</p>
                <p>Weekend Dates: {weekendDates.length > 0 ? weekendDates.join(', ') : 'None'}</p>
            </>
        )}
      </div>
    </div>
  );
};

export default DateRangePicker;