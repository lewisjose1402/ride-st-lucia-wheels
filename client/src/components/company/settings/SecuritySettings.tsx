
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { SecuritySettingsSchema } from "./validation-schemas";
import { supabase } from "@/integrations/supabase/client";

const SecuritySettings: React.FC = () => {
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(SecuritySettingsSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      setIsChangingPassword(true);
      
      const { error } = await supabase.auth.updateUser({ 
        password: values.new_password 
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      
      form.reset();
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      setIsLoggingOut(true);
      
      // Sign out from all devices
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Logged Out",
        description: "You have been logged out from all devices.",
      });
      
      // Redirect to sign in page after 2 seconds
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
      
    } catch (error: any) {
      console.error("Error logging out:", error);
      toast({
        title: "Logout Failed",
        description: error.message || "Failed to log out from all devices. Please try again.",
        variant: "destructive",
      });
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Change Password</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isChangingPassword}>
              {isChangingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Session Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          This action will log you out of all devices where you're currently signed in.
          You'll need to sign in again after this action.
        </p>
        <Button 
          variant="destructive" 
          onClick={handleLogoutAllDevices}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Log out of all devices"}
        </Button>
      </div>
    </div>
  );
};

export default SecuritySettings;
