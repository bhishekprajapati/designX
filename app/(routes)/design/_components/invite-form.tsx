"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { inviteFormSchema } from "@/lib/schema";

const InviteForm = () => {
  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(inviteFormSchema),
  });
  const { formState } = form;

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                type="email"
                placeholder="Invite others by email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="access"
        render={({ field }) => (
          <FormItem>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="read">can view</SelectItem>
                <SelectItem value="write">can edit</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button disabled={!formState.isValid}>Invite</Button>
    </Form>
  );
};

export default InviteForm;
