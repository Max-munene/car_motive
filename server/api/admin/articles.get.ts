// server/api/admin/articles.get.ts
import { useServerSupabase, getServerUser } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  const supabase = useServerSupabase();
  const user = await getServerUser(event);
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin")
    throw createError({ statusCode: 403, message: "Forbidden" });

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw createError({ statusCode: 500, message: error.message });

  return { data: data ?? [], error: null };
});
