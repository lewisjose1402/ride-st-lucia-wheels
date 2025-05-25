
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
      require_damage_deposit: settingsData?.require_damage_deposit ?? false,
      damage_deposit_type: settingsData?.damage_deposit_type ?? 'Cash',
      damage_deposit_amount: settingsData?.damage_deposit_amount ?? 250,
    },
  });

  const watchRequireMinimumAge = form.watch("require_minimum_age");
  const watchRequireDrivingExperience = form.watch("require_driving_experience");
  const watchRequireDamageDeposit = form.watch("require_damage_deposit");

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

            <FormField
              control={form.control}
              name="require_damage_deposit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Require Damage Deposit</FormLabel>
                    <FormDescription>
                      Require customers to provide a damage deposit when booking your vehicles.
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

            {watchRequireDamageDeposit && (
              <div className="space-y-4 ml-4 border-l-2 border-gray-200 pl-4">
                <FormField
                  control={form.control}
                  name="damage_deposit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Payment Method</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cash" id="cash" />
                            <Label htmlFor="cash">Cash</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Card" id="card" />
                            <Label htmlFor="card">Card</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="damage_deposit_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Damage Deposit Amount (USD)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="1"
                            max="10000"
                            className="pl-8"
                            placeholder="250.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the deposit amount customers must provide (minimum $1, maximum $10,000).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Button type="submit">Save Booking Requirements</Button>
        </form>
      </Form>
    </div>
  );
};

export default BookingRequirements;
