
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { BookingRequirementsSchema } from "./validation-schemas";
import { updateCompanySettings } from "@/services/companySettingsService";

interface BookingRequirementsProps {
  settingsData: any;
  onSettingsUpdated: () => void;
}

const BookingRequirements: React.FC<BookingRequirementsProps> = ({
  settingsData,
  onSettingsUpdated
}) => {
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(BookingRequirementsSchema),
    defaultValues: {
      require_driver_license: settingsData?.require_driver_license ?? true,
      require_minimum_age: settingsData?.require_minimum_age ?? true,
      require_driving_experience: settingsData?.require_driving_experience ?? true,
      minimum_driver_age: settingsData?.minimum_driver_age ?? 25,
      minimum_driving_experience: settingsData?.minimum_driving_experience ?? 3,
    },
  });

  const watchRequireMinimumAge = form.watch("require_minimum_age");
  const watchRequireDrivingExperience = form.watch("require_driving_experience");

  const onSubmit = async (values: any) => {
    try {
      await updateCompanySettings(settingsData.id, values);
      toast({
        title: "Settings Updated",
        description: "Booking requirements have been updated successfully.",
      });
      onSettingsUpdated();
    } catch (error) {
      console.error("Error updating booking requirements:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update booking requirements. Please try again.",
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
              name="require_driver_license"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Valid Driver's License</FormLabel>
                    <FormDescription>
                      Require customers to have a valid driver's license to book your vehicles.
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
              name="require_minimum_age"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Minimum Age</FormLabel>
                    <FormDescription>
                      Require customers to meet a minimum age requirement.
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
            
            {watchRequireMinimumAge && (
              <FormField
                control={form.control}
                name="minimum_driver_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Driver Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="require_driving_experience"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Minimum Driving Experience</FormLabel>
                    <FormDescription>
                      Require customers to have a minimum number of years of driving experience.
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
            
            {watchRequireDrivingExperience && (
              <FormField
                control={form.control}
                name="minimum_driving_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Driving Experience (years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <Button type="submit">Save Booking Requirements</Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingRequirements;
