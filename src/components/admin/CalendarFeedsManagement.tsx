
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, Sync, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

export const CalendarFeedsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feeds, isLoading } = useQuery({
    queryKey: ['admin-calendar-feeds', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('vehicle_calendar_feeds')
        .select(`
          *,
          vehicles(name, rental_companies(company_name))
        `);
      
      if (searchTerm) {
        query = query.or(`feed_name.ilike.%${searchTerm}%,vehicles.name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const syncFeedMutation = useMutation({
    mutationFn: async (feedId: string) => {
      // Call the parse-ical-feeds edge function
      const { data, error } = await supabase.functions.invoke('parse-ical-feeds', {
        body: { feedId }
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-feeds'] });
      toast({
        title: 'Success',
        description: 'Calendar feed synced successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to sync calendar feed',
        variant: 'destructive'
      });
    }
  });

  const syncAllFeeds = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('parse-ical-feeds');
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-feeds'] });
      toast({
        title: 'Success',
        description: 'All calendar feeds synced successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync calendar feeds',
        variant: 'destructive'
      });
    }
  };

  const getSyncStatus = (lastSynced: string | null) => {
    if (!lastSynced) return { status: 'Never', variant: 'secondary' };
    
    const lastSyncDate = new Date(lastSynced);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 24) {
      return { status: 'Recent', variant: 'default' };
    } else if (hoursDiff < 48) {
      return { status: 'Stale', variant: 'secondary' };
    } else {
      return { status: 'Very Stale', variant: 'destructive' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Feeds Management</CardTitle>
        <CardDescription>
          Monitor and manage vehicle calendar feed synchronization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by feed name or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={syncAllFeeds}>
            <Sync className="w-4 h-4 mr-2" />
            Sync All Feeds
          </Button>
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
                  <TableHead>Feed Name</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeds?.map((feed) => {
                  const syncStatus = getSyncStatus(feed.last_synced_at);
                  return (
                    <TableRow key={feed.id}>
                      <TableCell className="font-medium">{feed.feed_name}</TableCell>
                      <TableCell>{feed.vehicles?.name}</TableCell>
                      <TableCell>{feed.vehicles?.rental_companies?.company_name}</TableCell>
                      <TableCell>
                        <Badge variant={feed.is_external ? 'default' : 'secondary'}>
                          {feed.is_external ? 'External' : 'Internal'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {feed.last_synced_at 
                          ? format(new Date(feed.last_synced_at), 'MMM dd, yyyy HH:mm')
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={syncStatus.variant as any}>
                          {syncStatus.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => syncFeedMutation.mutate(feed.id)}
                            disabled={syncFeedMutation.isPending}
                          >
                            <Sync className="w-4 h-4 mr-1" />
                            Sync
                          </Button>
                          {syncStatus.variant === 'destructive' && (
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
