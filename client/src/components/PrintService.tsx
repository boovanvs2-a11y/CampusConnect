import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileImage, Loader, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { apiRequest } from "@/lib/queryClient";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function PrintService() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userEmail, setUserEmail] = useState("");
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
    if (!userEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/print-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          filename: file.name,
          email: userEmail,
          size: file.size,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      toast({
        title: "Print Request Sent!",
        description: `Your image has been forwarded to the print service. We'll contact you at ${userEmail}.`,
      });

      setUploadedFile(null);
      setUserEmail("");
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
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary" />
              Print Service
            </CardTitle>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
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

        <div>
          <label className="text-xs font-medium text-foreground">Your Email</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled={isLoading}
            data-testid="input-email-print"
            className="w-full mt-1.5 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background border-muted-foreground/30"
          />
        </div>

        <Button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full"
          data-testid="button-upload-print"
        >
          {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
          {uploadedFile ? "Upload Another" : "Select Image"}
        </Button>

        {uploadedFile && userEmail && (
          <Button
            onClick={() => submitPrintRequest(uploadedFile)}
            disabled={isLoading}
            className="w-full"
            variant="default"
            data-testid="button-submit-print"
          >
            {isLoading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
            Submit for Printing
          </Button>
        )}

            <p className="text-xs text-muted-foreground text-center">
              We'll forward your image to ankushrampa@gmail.com
            </p>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
