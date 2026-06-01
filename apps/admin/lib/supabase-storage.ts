/**
 * Supabase Storage Utility
 * 
 * Handles uploading and deleting files/images using the native Supabase Storage client.
 * Bypasses RLS using the administrative client wrapper.
 * 
 * @module lib/supabase-storage
 */

import { createAdminClient } from "@/lib/supabase/server";

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "rentocostumes";

/**
 * Uploads a file buffer directly to the public Supabase storage bucket.
 * Prepends a timestamp to prevent duplicate collisions.
 * 
 * @param fileBuffer - File content as a Buffer
 * @param key - Destination object path/key (e.g. "categories/1713829200-image.jpg")
 * @param contentType - MIME type of the file
 * @returns Publicly accessible URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadFileToSupabase(
  fileBuffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(key, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Supabase Storage upload error details:", error);
    throw new Error(`Supabase Storage upload failed: ${error.message}`);
  }

  // Get the public URL for the uploaded object
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(key);

  return urlData.publicUrl;
}

/**
 * Deletes an asset from the public Supabase storage bucket by its object key.
 * 
 * @param key - Object path/key inside the bucket
 * @throws Error if deletion fails
 */
export async function deleteFileFromSupabase(key: string): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.storage
    .from(bucketName)
    .remove([key]);

  if (error) {
    console.error("Supabase Storage deletion error details:", error);
    throw new Error(`Supabase Storage deletion failed: ${error.message}`);
  }
}

/**
 * Generates a unique and safe storage path/key for file upload.
 * Prepends a timestamp to prevent filename collisions and sanitizes
 * the filename.
 * 
 * @param folder - Logical directory prefix (e.g., "products", "categories", "banners")
 * @param filename - Original filename from the client
 * @returns Sanitized storage key
 */
export function generateStorageKey(folder: string, filename: string): string {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${folder}/${timestamp}-${sanitizedFilename}`;
}
