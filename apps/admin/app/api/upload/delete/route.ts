/**
 * File Delete API Route
 * 
 * Deletes a file from Cloudflare R2 storage by its public URL.
 * Extracts the S3 object key from the URL and calls deleteFileFromR2.
 * 
 * @route POST /api/upload/delete
 * @module app/api/upload/delete/route
 */

import { deleteFileFromSupabase } from "@/lib/supabase-storage";
import { apiSuccess, apiBadRequest, apiInternalError } from "@/lib/apiResponse";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return apiBadRequest("No URL provided");
    }

    // Extract storage object key from the public Supabase storage URL
    // URL format: https://[id].supabase.co/storage/v1/object/public/[bucket]/[key]
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "rentocostumes";
    const urlMarker = `/storage/v1/object/public/${bucketName}/`;

    if (!url.includes(urlMarker)) {
      return apiBadRequest("Invalid Supabase storage URL");
    }

    const key = url.split(urlMarker)[1];
    if (!key) {
      return apiBadRequest("Failed to extract storage key");
    }

    await deleteFileFromSupabase(key);

    return apiSuccess({ key }, { message: 'File deleted successfully' });
  } catch (error) {
    console.error("Delete file error:", error);
    return apiInternalError("Failed to delete file");
  }
}
