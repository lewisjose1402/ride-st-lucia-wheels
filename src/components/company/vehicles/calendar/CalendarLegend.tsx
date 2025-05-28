
import { Card, CardContent } from '@/components/ui/card';

const CalendarLegend = () => {
  return (
    <Card>
      <CardContent className="pt-4">
        <h4 className="text-sm font-medium mb-3">Calendar Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span>Manually Blocked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span>Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
            <span>External Calendar</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Click on manually blocked dates to view/remove. Confirmed bookings cannot be manually modified.
        </p>
      </CardContent>
    </Card>
  );
};

export default CalendarLegend;
