import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DatePicker } from "@/components/ui/date-picker";
import { useSubmissions } from "@/hooks/useSubmissions";
import { apiFetch } from "@/lib/api/client";
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
  sessionType: z.enum(["gi", "nogi"]),
});

type LogEntryFormValues = z.infer<typeof logEntrySchema>;

function getTodayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function LogEntry() {
  const { data: submissionOptions = [] } = useSubmissions();
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const form = useForm<LogEntryFormValues>({
    resolver: zodResolver(logEntrySchema),
    defaultValues: {
      date: getTodayISO(),
      sessionFocus: "",
      sessionType: "nogi",
    },
  });

  const onSubmit = async (values: LogEntryFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await apiFetch("/sessions/", {
        method: "POST",
        body: JSON.stringify({
          session_time: values.date,
          session_focus: values.sessionFocus,
          is_gi_session: values.sessionType === "gi",
          submission_ids: selectedSubs.map(Number),
        }),
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to log session.");
      return;
    }

    form.reset({
      date: getTodayISO(),
      sessionFocus: "",
      sessionType: "nogi",
    });
    setSelectedSubs([]);
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
                  <DatePicker value={field.value} onChange={field.onChange} />
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

          <FormField
            control={form.control}
            name="sessionType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Session Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="nogi" id="nogi" />
                      <label htmlFor="nogi" className="cursor-pointer text-sm">
                        No-Gi
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="gi" id="gi" />
                      <label htmlFor="gi" className="cursor-pointer text-sm">
                        Gi
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>What submissions did you hit today?</FormLabel>
            <FormControl>
              <MultiSelect
                options={submissionOptions.map((s) => ({
                  label: s.name,
                  value: s.id.toString(),
                }))}
                value={selectedSubs}
                onChange={setSelectedSubs}
                placeholder="Select submissions..."
              />
            </FormControl>
          </FormItem>

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
