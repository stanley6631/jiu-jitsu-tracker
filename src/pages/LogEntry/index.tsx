import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const logEntrySchema = z.object({
  date: z.string().min(1, "Date is required"),
  sessionFocus: z.string().min(1, "Session focus is required"),
});

type LogEntryFormValues = z.infer<typeof logEntrySchema>;

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function LogEntry() {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const form = useForm<LogEntryFormValues>({
    resolver: zodResolver(logEntrySchema),
    defaultValues: {
      date: getTodayISO(),
      sessionFocus: "",
    },
  });

  const onSubmit = async (values: LogEntryFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!user) {
      setSubmitError("You must be signed in to log a session.");
      return;
    }

    const { error } = await supabase.from("session_log").insert({
      session_time: values.date,
      session_focus: values.sessionFocus,
      user_id: user.id,
    });

    if (error) {
      setSubmitError(error.message);
      return;
    }

    form.reset({
      date: getTodayISO(),
      sessionFocus: "",
    });
    setSubmitSuccess("Session logged successfully.");
  };

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-white">Log Training Session</h2>
      <p className="mt-2 mb-6 text-gray-400">
        Record the techniques you focused on today.
      </p>

      {submitError && (
        <p className="mb-4 text-sm text-destructive">{submitError}</p>
      )}
      {submitSuccess && (
        <p className="mb-4 text-sm text-emerald-400">{submitSuccess}</p>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sessionFocus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Focus</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="What techniques or positions did you work on today?"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="p-4 w-full cursor-pointer"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Log Session"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
