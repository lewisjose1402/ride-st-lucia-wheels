
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AvailabilitySettingsSchema } from "./validation-schemas";
import { updateCompanySettings } from "@/services/companySettingsService";

interface AvailabilitySettingsProps {
  settingsData: any;
  onSettingsUpdated: () => void;
}

const AvailabilitySettings: React.FC<AvailabilitySettingsProps> = ({
  settingsData,
  onSettingsUpdated
}) => {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(AvailabilitySettingsSchema),
    defaultValues: {
      accept_bookings: settingsData?.accept_bookings ?? true,
    },
  });

  const onSubmit = async (values: any) => {
    try {
      await updateCompanySettings(settingsData.id, values);
      toast({
        title: "Settings Updated",
        description: "Availability settings have been updated successfully.",
      });
      onSettingsUpdated();
    } catch (error) {
      console.error("Error updating availability settings:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update availability settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accept_bookings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Accept Bookings</FormLabel>
                  <FormDescription>
                    Enable or disable booking requests for all vehicles. When disabled, customers won't be able to book any of your vehicles.
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

          <Button type="submit">Save Availability Settings</Button>
        </form>
      </Form>
    </div>
  );
};

export default AvailabilitySettings;
