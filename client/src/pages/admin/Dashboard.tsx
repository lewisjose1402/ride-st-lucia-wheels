
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BookingsManagement } from '@/components/admin/BookingsManagement';
import { CompaniesManagement } from '@/components/admin/CompaniesManagement';
import { VehiclesManagement } from '@/components/admin/VehiclesManagement';
import { CalendarFeedsManagement } from '@/components/admin/CalendarFeedsManagement';
import { ManualBlocksManagement } from '@/components/admin/ManualBlocksManagement';
import { ContactSubmissionsManagement } from '@/components/admin/ContactSubmissionsManagement';
import { DashboardStats } from '@/components/admin/DashboardStats';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();

  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage platform operations and monitor system health
          </p>
        </div>

        <DashboardStats />

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="calendar-feeds">Calendar Feeds</TabsTrigger>
            <TabsTrigger value="manual-blocks">Manual Blocks</TabsTrigger>
            <TabsTrigger value="contact-submissions">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <BookingsManagement />
          </TabsContent>

          <TabsContent value="companies">
            <CompaniesManagement />
          </TabsContent>

          <TabsContent value="vehicles">
            <VehiclesManagement />
          </TabsContent>

          <TabsContent value="calendar-feeds">
            <CalendarFeedsManagement />
          </TabsContent>

          <TabsContent value="manual-blocks">
            <ManualBlocksManagement />
          </TabsContent>

          <TabsContent value="contact-submissions">
            <ContactSubmissionsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
