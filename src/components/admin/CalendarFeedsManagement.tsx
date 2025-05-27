
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

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
          vehicles(name, company_id),
          rental_companies(company_name)
        `);
      
      if (searchTerm) {
        query = query.or(`feed_url.ilike.%${searchTerm}%,vehicles.name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('last_synced', { ascending: false, nullsFirst: false });
      
      if (error) throw error;
      return data;
    }
  });

  const syncFeedMutation = useMutation({
    mutationFn: async (feedId: string) => {
      // Trigger the sync by calling the edge function
      const { error } = await supabase.functions.invoke('parse-ical-feeds', {
        body: { feedId }
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-feeds'] });
      toast({
        title: 'Success',
        description: 'Feed sync triggered successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to sync feed',
        variant: 'destructive'
      });
    }
  });

  const syncAllFeeds = async () => {
    try {
      const { error } = await supabase.functions.invoke('parse-ical-feeds');
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['admin-calendar-feeds'] });
      toast({
        title: 'Success',
        description: 'All feeds sync triggered successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync all feeds',
        variant: 'destructive'
      });
    }
  };

  const getFeedHealthStatus = (lastSynced: string | null, isActive: boolean) => {
    if (!isActive) return { status: 'inactive', color: 'secondary' };
    if (!lastSynced) return { status: 'never synced', color: 'destructive' };
    
    const daysSinceSync = Math.floor((Date.now() - new Date(lastSynced).getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceSync > 7) return { status: 'stale', color: 'destructive' };
    if (daysSinceSync > 3) return { status: 'warning', color: 'secondary' };
    return { status: 'healthy', color: 'default' };
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
              placeholder="Search by feed URL or vehicle name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={syncAllFeeds} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
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
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Feed Type</TableHead>
                  <TableHead>Last Synced</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeds?.map((feed) => {
                  const health = getFeedHealthStatus(feed.last_synced, feed.is_active);
                  return (
                    <TableRow key={feed.id}>
                      <TableCell className="font-medium">{feed.vehicles?.name}</TableCell>
                      <TableCell>{feed.rental_companies?.company_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {feed.feed_type || 'External'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {feed.last_synced 
                          ? new Date(feed.last_synced).toLocaleString()
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {health.status === 'healthy' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {health.status !== 'healthy' && <AlertCircle className="w-4 h-4 text-orange-500" />}
                          <Badge variant={health.color as any}>
                            {health.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => syncFeedMutation.mutate(feed.id)}
                          disabled={!feed.is_active}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Sync
                        </Button>
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
