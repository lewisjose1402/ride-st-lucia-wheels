
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Phone, Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CompanyProfileFormValues } from "./validation-schema";

interface ContactInformationProps {
  form: UseFormReturn<CompanyProfileFormValues>;
}

const ContactInformation: React.FC<ContactInformationProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Address
            </FormLabel>
            <FormControl>
              <Input type="email" placeholder="company@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Phone Number
            </FormLabel>
            <FormControl>
              <Input placeholder="+1 758 XXX XXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactInformation;
