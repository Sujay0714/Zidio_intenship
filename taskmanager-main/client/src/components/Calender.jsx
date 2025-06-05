import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // default styles

const Calender = () => {
  const [value, setValue] = useState(new Date());

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-800 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center text-white">📅 TMS Calendar</h2>
      <Calendar
        onChange={setValue}
        value={value}
        className="react-calendar dark:bg-gray-700 dark:text-white dark:tileHover:bg-indigo-600 dark:tileHover:text-white"
      />
      <p className="mt-4 text-center text-white">
        Selected Date: <strong>{value.toDateString()}</strong>
      </p>
    </div>
  );
};

export default Calender;
