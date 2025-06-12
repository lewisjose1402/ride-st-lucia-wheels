
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { CompanyProfileFormValues } from "./validation-schema";

interface CompanyDescriptionProps {
  form: UseFormReturn<CompanyProfileFormValues>;
}

const CompanyDescription: React.FC<CompanyDescriptionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel>Company Description</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Tell customers about your company..."
              className="min-h-[150px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CompanyDescription;
