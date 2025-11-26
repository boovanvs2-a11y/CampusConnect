import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, Loader } from "lucide-react";
import { useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";

export function PrintService() {
  const { toast } = useToast();
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    await submitPrintRequest(file);
  };

  const submitPrintRequest = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);

      await fetch("/api/print-request", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      toast({
        title: "Print Request Sent!",
        description: "Your image has been forwarded to the print service. Check your email for confirmation.",
      });

      setUploadedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to send print request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e);
    if (e.dataTransfer.files) {
      handleFile(e.dataTransfer.files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="backdrop-blur-sm bg-card/90">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileImage className="h-5 w-5 text-primary" />
          Print Service
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/30 hover:border-primary/50"
          }`}
          data-testid="drop-zone-print"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFile(e.target.files)}
            className="hidden"
            data-testid="input-file-print"
          />

          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Drag image here or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, GIF, WebP
              </p>
            </div>
          </div>
        </div>

        {uploadedFile && (
          <div className="p-2 rounded-md bg-primary/5 border border-primary/20">
            <p className="text-xs font-medium text-foreground truncate">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {(uploadedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        )}

        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full"
          data-testid="button-upload-print"
        >
          {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
          {uploadedFile ? "Upload Another" : "Select Image"}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Images sent to print service for processing
        </p>
      </CardContent>
    </Card>
  );
}
