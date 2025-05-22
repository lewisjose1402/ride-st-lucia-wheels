
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CompanyProfileFormValues } from "./validation-schema";
import { CONSTITUENCIES } from "./constants";

interface AddressInformationProps {
  form: UseFormReturn<CompanyProfileFormValues>;
}

const AddressInformation: React.FC<AddressInformationProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="street_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Street Address
            </FormLabel>
            <FormControl>
              <Input placeholder="Street address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="constituency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Constituency
            </FormLabel>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select constituency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONSTITUENCIES.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default AddressInformation;
