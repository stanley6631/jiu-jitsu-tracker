import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  const form = useForm<LogEntryFormValues>({
    resolver: zodResolver(logEntrySchema),
    defaultValues: {
      date: getTodayISO(),
      sessionFocus: "",
    },
  });

  function onSubmit(values: LogEntryFormValues) {
    // TODO: send to Supabase
    console.log(values);
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-2xl font-bold text-white">Log Training Session</h2>
      <p className="mt-2 mb-6 text-gray-400">
        Record the techniques you focused on today.
      </p>

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

          <Button type="submit" className="p-4 w-full cursor-pointer">
            Log Session
          </Button>
        </form>
      </Form>
    </div>
  );
}
