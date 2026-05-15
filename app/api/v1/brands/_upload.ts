import { SupabaseClient } from "@supabase/supabase-js";

/**
 * This function is used to upload the brand logo and image to the specified bucket.
 * If any error occurs during the upload process, it should throw an error which can be caught by the caller.
 * @param file - An object containing the logo file or image file.
 * @param bucketName - The name of the bucket where the files should be uploaded.
 * @param supabase - An instance of the Supabase client to interact with the storage API.
 * @returns {Promise<{ path: string; url: string }>} An object containing the path and public URL of the uploaded file if the upload is successful.
 * @throws Will throw an error if the upload fails for any reason.
 */
export const uploadImage = async (
    file: File,
    bucketName: string,
    supabase: SupabaseClient
): Promise<{ path: string; url: string }> => {
    // Adding random number
    const ext = file.name.split('.').pop();
    const path = `${bucketName}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const buffer = await file.arrayBuffer();

    const { error } = await supabase.storage.from(bucketName).upload(path, new Uint8Array(buffer), {
        upsert: false,
        contentType: file.type,
    });

    if(error) {
        throw new Error(`Error uploading file: ${error.message}`);
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return { path, url: data.publicUrl };
}

/**
 * This function is used to delete the uploaded files from the bucket 
 * in case of any error during the brand creation process.
 * @param uploadedPaths - An array of file paths that were uploaded and need to be deleted.
 * @param bucketName - The name of the bucket from which the files should be deleted.
 * @param supabase - An instance of the Supabase client to interact with the storage API.
 */
export const rollbackUploads = async (
    uploadedPaths: string[], 
    bucketName: string,
    supabase: SupabaseClient
) => {
    if(uploadedPaths.length > 0) {
        await supabase.storage.from(bucketName).remove(uploadedPaths);
    }
}

/**
 * This function is used to extract the storage path from the public URL of the uploaded file.
 * @param publicUrl - The public URL of the uploaded file from which the storage path needs to be extracted.
 * @returns {string | null} The extracted storage path if the URL is valid, otherwise null.
 */
export const extractStoragePath = (publicUrl: string, bucketName: string): string | null => {
    try {
        // "https://xxx.supabase.co/storage/v1/object/public/brand-assets/uuid.png"
        const marker = `/object/public/${bucketName}/`;
        const idx = publicUrl.indexOf(marker);
        if(idx === -1) return null;
        return publicUrl.slice(idx + marker.length);
    }
    catch(error) {
        return null;
    }
}