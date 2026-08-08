import { useSupabase } from "./supabase";

export async function uploadResume(userId: string, file: File) {
  const supabase = useSupabase();

  const filePath = `${userId}/${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from("resumes")
    .upload(filePath, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("resumes").getPublicUrl(filePath);

  return {
    path: data.path,
    url: publicUrl,
  };
}