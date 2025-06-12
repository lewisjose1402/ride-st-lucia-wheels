
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, Star, StarOff } from 'lucide-react';

export const VehiclesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['admin-vehicles', searchTerm],
    queryFn: async () => {
      let query = supabase.from('admin_vehicle_stats').select('*');
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateVehicleMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      toast({
        title: 'Success',
        description: 'Vehicle updated successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update vehicle',
        variant: 'destructive'
      });
    }
  });

  const bulkUpdateFeatured = async (featured: boolean) => {
    if (selectedVehicles.length === 0) {
      toast({
        title: 'No vehicles selected',
        description: 'Please select vehicles to update',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_featured: featured })
        .in('id', selectedVehicles);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
      setSelectedVehicles([]);
      toast({
        title: 'Success',
        description: `${selectedVehicles.length} vehicles updated successfully`
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update vehicles',
        variant: 'destructive'
      });
    }
  };

  const toggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles(prev =>
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicles Management</CardTitle>
        <CardDescription>
          Manage vehicles and featured vehicle selection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by vehicle name or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedVehicles.length > 0 && (
            <div className="flex gap-2">
              <Button onClick={() => bulkUpdateFeatured(true)}>
                <Star className="w-4 h-4 mr-2" />
                Make Featured
              </Button>
              <Button variant="outline" onClick={() => bulkUpdateFeatured(false)}>
                <StarOff className="w-4 h-4 mr-2" />
                Remove Featured
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedVehicles.length === vehicles?.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedVehicles(vehicles?.map(v => v.id) || []);
                        } else {
                          setSelectedVehicles([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Vehicle Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Avg. Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles?.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedVehicles.includes(vehicle.id)}
                        onCheckedChange={() => toggleVehicleSelection(vehicle.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{vehicle.name}</TableCell>
                    <TableCell>{vehicle.company_name}</TableCell>
                    <TableCell>${vehicle.price_per_day}</TableCell>
                    <TableCell>{vehicle.booking_count}</TableCell>
                    <TableCell>${vehicle.avg_booking_price?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>
                      <Badge variant={vehicle.is_available ? 'default' : 'secondary'}>
                        {vehicle.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={vehicle.is_featured ? 'default' : 'outline'}>
                        {vehicle.is_featured ? 'Featured' : 'Regular'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => 
                          updateVehicleMutation.mutate({
                            id: vehicle.id,
                            updates: { is_featured: !vehicle.is_featured }
                          })
                        }
                      >
                        {vehicle.is_featured ? (
                          <StarOff className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
