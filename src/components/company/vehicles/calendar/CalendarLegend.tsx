
const CalendarLegend = () => {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
        <span>Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-200 rounded"></div>
        <span>Booked via iCal</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-200 rounded"></div>
        <span>Manually Blocked</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
