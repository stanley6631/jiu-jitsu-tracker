import { supabase } from "@/lib/supabase/client";

export interface Submission {
  id: number;
  name: string;
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);

  return data ?? [];
}
