"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  variantId: string;
  images: { id: string; url: string }[];
  onImageChange: () => void;
}

export function ImageUpload({ variantId, images, onImageChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("images", file);
      }

      const response = await fetch(`/api/variants/${variantId}/images`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error ?? "Upload failed");
      }

      onImageChange();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(imageId: string) {
    try {
      const response = await fetch(`/api/variants/${variantId}/images/${imageId}`, {
        method: "DELETE",
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error ?? "Delete failed");
      }

      onImageChange();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {images.map((image) => (
          <div key={image.id} className="group relative size-20 overflow-hidden rounded-md border">
            <img
              src={image.url}
              alt="Variant"
              className="size-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(image.id)}
              className="absolute right-0.5 top-0.5 hidden rounded-full bg-black/60 p-0.5 text-white group-hover:block"
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
        <label
          className={cn(
            "flex size-20 cursor-pointer items-center justify-center rounded-md border border-dashed text-muted-foreground hover:border-foreground hover:text-foreground",
            uploading && "opacity-50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Upload className="size-5" />
        </label>
      </div>
    </div>
  );
}
