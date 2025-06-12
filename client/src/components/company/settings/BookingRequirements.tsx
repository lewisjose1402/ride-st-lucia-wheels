
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookingRequirementsSchema } from "./validation-schemas";
import { updateCompanySettings } from "@/services/companySettingsService";
import type { z } from "zod";

type BookingRequirementsFormData = z.infer<typeof BookingRequirementsSchema>;

interface BookingRequirementsProps {
  settingsData: any;
  onSettingsUpdated: () => void;
}

const BookingRequirements = ({ settingsData, onSettingsUpdated }: BookingRequirementsProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BookingRequirementsFormData>({
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
      minimum_rental_days: settingsData?.minimum_rental_days ?? 1,
    },
  });

  const onSubmit = async (data: BookingRequirementsFormData) => {
    try {
      setIsLoading(true);
      await updateCompanySettings(settingsData.id, data);
      
      toast({
        title: "Settings updated",
        description: "Your booking requirements have been updated successfully.",
      });
      
      onSettingsUpdated();
    } catch (error) {
      console.error("Error updating booking requirements:", error);
      toast({
        title: "Error",
        description: "Failed to update booking requirements. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Requirements</CardTitle>
        <CardDescription>
          Set requirements that renters must meet to book your vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Driver License Requirement */}
            <FormField
              control={form.control}
              name="require_driver_license"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Driver's License</FormLabel>
                    <FormDescription>
                      Require renters to upload a valid driver's license
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

            {/* Minimum Age Requirement */}
            <FormField
              control={form.control}
              name="require_minimum_age"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Minimum Age</FormLabel>
                    <FormDescription>
                      Require renters to meet minimum age requirement
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

            {form.watch("require_minimum_age") && (
              <FormField
                control={form.control}
                name="minimum_driver_age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Driver Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="18"
                        max="100"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 18)}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum age required to rent your vehicles (18-100 years)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Driving Experience Requirement */}
            <FormField
              control={form.control}
              name="require_driving_experience"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Driving Experience</FormLabel>
                    <FormDescription>
                      Require renters to have minimum driving experience
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

            {form.watch("require_driving_experience") && (
              <FormField
                control={form.control}
                name="minimum_driving_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Driving Experience (Years)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum years of driving experience required (0-50 years)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Minimum Rental Days */}
            <FormField
              control={form.control}
              name="minimum_rental_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Rental Days</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="365"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum number of days required for vehicle bookings (1-365 days)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Damage Deposit Requirement */}
            <FormField
              control={form.control}
              name="require_damage_deposit"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Damage Deposit</FormLabel>
                    <FormDescription>
                      Require renters to pay a refundable damage deposit
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

            {form.watch("require_damage_deposit") && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="damage_deposit_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How renters should pay the damage deposit
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="damage_deposit_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="10000"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 250)}
                        />
                      </FormControl>
                      <FormDescription>
                        Amount of damage deposit required ($1-$10,000)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Requirements"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BookingRequirements;
