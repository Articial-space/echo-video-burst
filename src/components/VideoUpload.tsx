
import { useState, useRef } from "react";
import { Upload, Search, Play, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { validateVideoUrl, validateVideoFile, sanitizeString } from "@/utils/securityUtils";

interface VideoUploadProps {
  onVideoProcessed: (videoData: VideoData) => void;
}

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
}

const VideoUpload = ({ onVideoProcessed }: VideoUploadProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setValidationError("");
    
    // Enhanced file validation
    const validation = validateVideoFile(file);
    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid file");
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate video processing
    setTimeout(() => {
      const sanitizedTitle = sanitizeString(file.name.replace(/\.[^/.]+$/, ""));
      const mockVideoData: VideoData = {
        id: Math.random().toString(36).substr(2, 9),
        title: sanitizedTitle || "Untitled Video",
        duration: "12:34",
        url: URL.createObjectURL(file),
        thumbnail: "/placeholder.svg"
      };
      
      onVideoProcessed(mockVideoData);
      setIsProcessing(false);
      
      toast({
        title: "Video uploaded successfully",
        description: "Processing your video summary...",
      });
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleUrlSearch = () => {
    if (!searchQuery.trim()) return;
    
    setValidationError("");
    
    // Enhanced URL validation
    if (!validateVideoUrl(searchQuery.trim())) {
      const errorMessage = "Please enter a valid video URL from supported platforms (YouTube, Vimeo, etc.) or a direct video file link.";
      setValidationError(errorMessage);
      toast({
        title: "Invalid URL",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate URL processing
    setTimeout(() => {
      const sanitizedTitle = sanitizeString("Video from URL");
      const mockVideoData: VideoData = {
        id: Math.random().toString(36).substr(2, 9),
        title: sanitizedTitle,
        duration: "8:45",
        url: searchQuery.trim(),
        thumbnail: "/placeholder.svg"
      };
      
      onVideoProcessed(mockVideoData);
      setIsProcessing(false);
      setSearchQuery("");
      
      toast({
        title: "Video loaded successfully",
        description: "Processing your video summary...",
      });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError("");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Search Bar */}
      <Card className="p-6 glass-effect">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-semibold text-center">
            Enter video URL or upload a file
          </h2>
          
          {validationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Paste YouTube, Vimeo, or any video URL here..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && handleUrlSearch()}
                className="pl-10 h-12 text-base"
                disabled={isProcessing}
                maxLength={500}
              />
            </div>
            <Button 
              onClick={handleUrlSearch}
              disabled={!searchQuery.trim() || isProcessing}
              className="h-12 px-6 bg-brand-gradient hover:opacity-90"
            >
              <Play className="h-4 w-4 mr-2" />
              Analyze
            </Button>
          </div>
        </div>
      </Card>

      {/* File Upload */}
      <Card className="p-8 glass-effect">
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            isDragging 
              ? 'border-brand-green-500 bg-brand-green-50' 
              : 'border-border hover:border-brand-green-400'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center animate-pulse-green">
              <Upload className="h-6 w-6 text-white" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {isProcessing ? 'Processing your video...' : 'Drop your video here'}
              </h3>
              <p className="text-muted-foreground">
                {isProcessing 
                  ? 'This may take a few moments' 
                  : 'Supports MP4, MOV, AVI, and more (Max 100MB)'
                }
              </p>
            </div>
            
            {!isProcessing && (
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="lg"
                className="mt-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            )}
            
            {isProcessing && (
              <div className="flex items-center justify-center space-x-2 text-brand-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-green-600"></div>
                <span>Processing...</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VideoUpload;
