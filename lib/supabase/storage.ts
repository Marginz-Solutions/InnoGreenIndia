import { createClient }
  from "@/lib/supabase/client";

export const uploadProductImage =
  async (file: File) => {
    const supabase =
      createClient();

    const ext =
      file.name.split(".").pop();

    const fileName =
      `${Date.now()}.${ext}`;

    const filePath =
      `${fileName}`;

    const { error } =
      await supabase.storage
        .from("products")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("products")
      .getPublicUrl(filePath);

    return publicUrl;
  };

export const deleteProductImage =
  async (image_url: string) => {
    try {
      const supabase =
        createClient();

      if (!image_url) return;

      const fileName =
        image_url
          .split("/")
          .pop();

      if (!fileName) return;

      const { error } =
        await supabase.storage
          .from("products")
          .remove([fileName]);

      if (error) {
        console.error(error);
        throw error;
      }
    } catch (err) {
      console.error(err);
    }
  };