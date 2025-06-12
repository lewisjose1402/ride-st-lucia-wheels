
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, CalendarRange, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

type StatsCardsProps = {
  vehicleCount: number;
  activeBookings: number;
  totalRevenue: number;
};

const StatsCards = ({ vehicleCount, activeBookings, totalRevenue }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          <Car className="h-4 w-4 text-brand-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vehicleCount}</div>
          <p className="text-xs text-gray-500">Vehicles in your fleet</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
          <CalendarRange className="h-4 w-4 text-brand-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBookings}</div>
          <p className="text-xs text-gray-500">Currently active bookings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-brand-purple" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
          <p className="text-xs text-gray-500">Total completed bookings revenue</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
