
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, RefreshCw, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const ManualBlocksManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ['admin-manual-blocks', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('vehicle_calendar_blocks')
        .select(`
          *,
          vehicles(name, rental_companies(company_name))
        `);
      
      if (searchTerm) {
        query = query.or(`reason.ilike.%${searchTerm}%,vehicles.name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query.order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteBlocksMutation = useMutation({
    mutationFn: async (blockIds: string[]) => {
      const { error } = await supabase
        .from('vehicle_calendar_blocks')
        .delete()
        .in('id', blockIds);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-manual-blocks'] });
      setSelectedBlocks([]);
      toast({
        title: 'Success',
        description: 'Selected blocks deleted successfully'
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to delete blocks',
        variant: 'destructive'
      });
    }
  });

  const deleteSelectedBlocks = () => {
    if (selectedBlocks.length === 0) {
      toast({
        title: 'No blocks selected',
        description: 'Please select blocks to delete',
        variant: 'destructive'
      });
      return;
    }

    deleteBlocksMutation.mutate(selectedBlocks);
  };

  const toggleBlockSelection = (blockId: string) => {
    setSelectedBlocks(prev =>
      prev.includes(blockId)
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Blocks Management</CardTitle>
        <CardDescription>
          View and manage manual calendar blocks across all vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by reason or vehicle name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedBlocks.length > 0 && (
            <Button variant="destructive" onClick={deleteSelectedBlocks}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedBlocks.length})
            </Button>
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
                      checked={selectedBlocks.length === blocks?.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBlocks(blocks?.map(b => b.id) || []);
                        } else {
                          setSelectedBlocks([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blocks?.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBlocks.includes(block.id)}
                        onCheckedChange={() => toggleBlockSelection(block.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{block.vehicles?.name}</TableCell>
                    <TableCell>{block.vehicles?.rental_companies?.company_name}</TableCell>
                    <TableCell>{format(new Date(block.start_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{format(new Date(block.end_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{block.reason || 'N/A'}</TableCell>
                    <TableCell>{format(new Date(block.created_at), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteBlocksMutation.mutate([block.id])}
                      >
                        <Trash2 className="w-4 h-4" />
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
