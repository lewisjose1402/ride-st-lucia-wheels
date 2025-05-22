
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Building, User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CompanyProfileFormValues } from "./validation-schema";

interface CompanyInformationProps {
  form: UseFormReturn<CompanyProfileFormValues>;
}

const CompanyInformation: React.FC<CompanyInformationProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="company_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Company Name
            </FormLabel>
            <FormControl>
              <Input placeholder="Your company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="contact_person"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Contact Person
            </FormLabel>
            <FormControl>
              <Input placeholder="Primary contact person" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CompanyInformation;
