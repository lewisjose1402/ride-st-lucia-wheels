
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Car, Calendar, DollarSign } from 'lucide-react';

export const DashboardStats = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [companiesResult, vehiclesResult, bookingsResult, revenueResult] = await Promise.all([
        supabase.from('rental_companies').select('id', { count: 'exact' }),
        supabase.from('vehicles').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('bookings').select('total_price').eq('status', 'confirmed')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum, booking) => 
        sum + (booking.total_price || 0), 0) || 0;

      return {
        companies: companiesResult.count || 0,
        vehicles: vehiclesResult.count || 0,
        bookings: bookingsResult.count || 0,
        revenue: totalRevenue
      };
    }
  });

  const statCards = [
    {
      title: 'Total Companies',
      value: stats?.companies || 0,
      description: 'Registered rental companies',
      icon: Users
    },
    {
      title: 'Total Vehicles',
      value: stats?.vehicles || 0,
      description: 'Available vehicles',
      icon: Car
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings || 0,
      description: 'All time bookings',
      icon: Calendar
    },
    {
      title: 'Total Revenue',
      value: `$${(stats?.revenue || 0).toLocaleString()}`,
      description: 'From confirmed bookings',
      icon: DollarSign
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
