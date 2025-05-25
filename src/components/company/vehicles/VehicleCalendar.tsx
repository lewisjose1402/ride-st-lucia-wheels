import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Calendar as CalendarIcon, Copy, ExternalLink, RefreshCw, Trash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { getVehicleCalendarFeedUrl, generateCalendarFeedToken } from '@/services/vehicleService';
import { getVehicleCalendarFeeds, addExternalCalendarFeed, deleteCalendarFeed, syncExternalCalendarFeed, CalendarFeed } from '@/services/calendarService';
import { format } from 'date-fns';
import InteractiveCalendar from './InteractiveCalendar';

interface VehicleCalendarProps {
  vehicleId: string;
}

const VehicleCalendar: React.FC<VehicleCalendarProps> = ({ vehicleId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [calendarFeedUrl, setCalendarFeedUrl] = useState<string | null>(null);
  const [externalFeeds, setExternalFeeds] = useState<CalendarFeed[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  
  // Form state for adding new feed
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedDescription, setNewFeedDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const loadCalendarData = async () => {
    try {
      setIsLoading(true);
      // Load calendar feed URL
      const feedUrl = await getVehicleCalendarFeedUrl(vehicleId);
      setCalendarFeedUrl(feedUrl);
      
      // Load external feeds
      const feeds = await getVehicleCalendarFeeds(vehicleId);
      setExternalFeeds(feeds.filter(feed => feed.is_external));
    } catch (error) {
      console.error('Error loading calendar data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load calendar data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vehicleId) {
      loadCalendarData();
    }
  }, [vehicleId]);

  const handleCopyFeedUrl = () => {
    if (calendarFeedUrl) {
      navigator.clipboard.writeText(calendarFeedUrl);
      toast({
        title: 'Copied!',
        description: 'Calendar feed URL copied to clipboard',
      });
    }
  };

  const handleRegenerateToken = async () => {
    try {
      setIsLoading(true);
      const token = await generateCalendarFeedToken(vehicleId);
      const newUrl = `${window.location.origin}/api/calendar/${vehicleId}/${token}`;
      setCalendarFeedUrl(newUrl);
      toast({
        title: 'Success',
        description: 'Calendar feed URL regenerated',
      });
    } catch (error) {
      console.error('Error regenerating token:', error);
      toast({
        title: 'Error',
        description: 'Failed to regenerate calendar feed URL',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddExternalFeed = async () => {
    if (!newFeedName || !newFeedUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a name and URL for the feed',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsLoading(true);
      const newFeed = await addExternalCalendarFeed({
        vehicle_id: vehicleId,
        feed_name: newFeedName,
        feed_url: newFeedUrl,
        description: newFeedDescription || undefined,
      });
      
      setExternalFeeds([newFeed, ...externalFeeds]);
      setNewFeedName('');
      setNewFeedUrl('');
      setNewFeedDescription('');
      setIsDialogOpen(false);
      
      toast({
        title: 'Feed Added',
        description: 'External calendar feed added successfully',
      });
    } catch (error) {
      console.error('Error adding feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to add external calendar feed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    try {
      setIsLoading(true);
      await deleteCalendarFeed(feedId);
      setExternalFeeds(externalFeeds.filter(feed => feed.id !== feedId));
      toast({
        title: 'Feed Deleted',
        description: 'External calendar feed deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete external calendar feed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setSelectedFeedId(null);
    }
  };

  const handleSyncFeed = async (feedId: string) => {
    try {
      setIsLoading(true);
      await syncExternalCalendarFeed(feedId, vehicleId);
      
      // Update the last_synced_at date in the UI
      setExternalFeeds(externalFeeds.map(feed => 
        feed.id === feedId 
          ? { ...feed, last_synced_at: new Date().toISOString() } 
          : feed
      ));
      
      toast({
        title: 'Feed Synced',
        description: 'External calendar feed synced successfully. iCal bookings have been updated.',
      });
    } catch (error) {
      console.error('Error syncing feed:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync external calendar feed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="availability" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="availability">Availability Calendar</TabsTrigger>
          <TabsTrigger value="feeds">Calendar Feeds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Availability</CardTitle>
              <CardDescription>
                View and manage the availability of your vehicle. Click dates to manually block or unblock them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveCalendar vehicleId={vehicleId} />
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Click on available dates to start blocking them</li>
                  <li>• Click on manually blocked dates to unblock them</li>
                  <li>• Red dates are booked via external calendars and cannot be modified</li>
                  <li>• Select date ranges by clicking start and end dates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feeds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Calendar Feed</CardTitle>
              <CardDescription>
                Share this iCalendar feed with other applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="feed-url">Calendar Feed URL</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="feed-url" 
                      value={calendarFeedUrl || ''} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleCopyFeedUrl}
                      disabled={!calendarFeedUrl || isLoading}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    This URL provides calendar access to your vehicle's availability.
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline"
                    onClick={handleRegenerateToken}
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Calendar URL
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    This will invalidate your previous calendar link. Only do this if you think your calendar URL has been compromised.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>External Calendar Feeds</CardTitle>
                <CardDescription className="mt-1">
                  Import availability from other calendar sources
                </CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Add External Feed
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add External Calendar Feed</DialogTitle>
                    <DialogDescription>
                      Import dates from other calendar systems (e.g., Google Calendar, Airbnb, etc).
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feed-name" className="text-right">Name</Label>
                      <Input
                        id="feed-name"
                        placeholder="e.g., Airbnb Calendar"
                        className="col-span-3"
                        value={newFeedName}
                        onChange={(e) => setNewFeedName(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feed-url" className="text-right">iCal URL</Label>
                      <Input
                        id="feed-url"
                        placeholder="https://..."
                        className="col-span-3"
                        value={newFeedUrl}
                        onChange={(e) => setNewFeedUrl(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="feed-description" className="text-right">Description</Label>
                      <Textarea
                        id="feed-description"
                        placeholder="Optional description"
                        className="col-span-3"
                        value={newFeedDescription}
                        onChange={(e) => setNewFeedDescription(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button" 
                      onClick={handleAddExternalFeed}
                      disabled={isLoading || !newFeedName || !newFeedUrl}
                    >
                      Add Calendar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="pt-2">
              {externalFeeds.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <h3 className="mt-2 text-sm font-medium text-muted-foreground">No external feeds</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add external calendar feeds to import availability.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {externalFeeds.map((feed) => (
                    <div key={feed.id} className="py-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{feed.feed_name}</h4>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">
                          {feed.feed_url}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {feed.last_synced_at ? (
                            `Last synced: ${format(new Date(feed.last_synced_at), 'PPp')}`
                          ) : (
                            'Never synced'
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSyncFeed(feed.id)}
                          disabled={isLoading}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(feed.feed_url, '_blank')}
                          disabled={isLoading}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={selectedFeedId === feed.id} onOpenChange={(isOpen) => !isOpen && setSelectedFeedId(null)}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedFeedId(feed.id)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete External Feed</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this external calendar feed? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setSelectedFeedId(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => feed.id && handleDeleteFeed(feed.id)} 
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleCalendar;
