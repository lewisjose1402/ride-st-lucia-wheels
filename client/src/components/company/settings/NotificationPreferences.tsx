
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { NotificationSettingsSchema } from "./validation-schemas";
import { updateCompanySettings } from "@/services/companySettingsService";

interface NotificationPreferencesProps {
  settingsData: any;
  onSettingsUpdated: () => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  settingsData,
  onSettingsUpdated
}) => {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(NotificationSettingsSchema),
    defaultValues: {
      notification_new_booking: settingsData?.notification_new_booking ?? true,
      notification_booking_cancellation: settingsData?.notification_booking_cancellation ?? true,
      notification_booking_fee_collected: settingsData?.notification_booking_fee_collected ?? true,
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await updateCompanySettings(settingsData.id, values);
      toast({
        title: "Settings Updated",
        description: "Notification preferences have been updated successfully.",
      });
      onSettingsUpdated();
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update notification preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="notification_new_booking"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">New Booking</FormLabel>
                    <FormDescription>
                      Receive email notifications when a new booking is made.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notification_booking_cancellation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Booking Cancellation</FormLabel>
                    <FormDescription>
                      Receive email notifications when a booking is cancelled.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notification_booking_fee_collected"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Booking Fee Collected</FormLabel>
                    <FormDescription>
                      Receive email notifications when a booking fee is collected.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button type="submit">Save Notification Preferences</Button>
        </form>
      </Form>
    </div>
  );
};

export default NotificationPreferences;
