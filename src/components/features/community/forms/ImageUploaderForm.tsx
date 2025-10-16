"use client";


import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2 } from "lucide-react";


interface ImageUploaderProps {
  label: string;
  description: string;
  currentImageUrl: string | null;
  onUpload: (file: File) => Promise<string | null>;
  renderPreview: (previewUrl: string | null) => React.ReactNode;
}


export function ImageUploaderForm({
  label,
  description,
  currentImageUrl,
  onUpload,
  renderPreview
}: ImageUploaderProps) {
  const [ file, setFile ] = useState<File | null>(null);
  const [ preview, setPreview ] = useState<string | null>(currentImageUrl);
  const [ isUploading, setIsUploading ] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[ 0 ];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file)
      return;
    setIsUploading(true);
    try {
      const newUrl = await onUpload(file);
      setPreview(newUrl);
      setFile(null);
      toast.success(`${label} updated successfully!`);
    } catch (error) {
      toast.error(`Failed to upload ${label.toLowerCase()}.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(currentImageUrl);
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">
          { label }
        </h3>
        <p className="text-sm text-muted-foreground">
          { description }
        </p>
      </div>
      <div className="flex items-center gap-4">
        { renderPreview(preview) }
        <input
          type="file"
          ref={ inputRef }
          className="hidden"
          accept="image/*"
          onChange={ handleFileChange }
        />
        <div className="flex-1 space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={ () => inputRef.current?.click() }
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Image
          </Button>
          {
            file && (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={ handleSave }
                  disabled={ isUploading }
                >
                  {
                    isUploading && <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  }
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={ handleCancel }
                  disabled={ isUploading }
                >
                  Cancel
                </Button>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}
