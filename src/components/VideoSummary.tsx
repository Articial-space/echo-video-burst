import { useState } from "react";
import { Clock, Play, ChevronRight, Copy, Download, FileText, File } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { exportToDocx, exportToPdf } from "@/utils/exportUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoData {
  id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
}

interface SummarySection {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  content: string;
  keyPoints: string[];
}

interface VideoSummaryProps {
  videoData: VideoData;
  onBack: () => void;
}

const VideoSummary = ({ videoData, onBack }: VideoSummaryProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock summary data
  const summaryData = {
    overview: "This video covers comprehensive strategies for building scalable web applications, focusing on architecture patterns, performance optimization, and best practices for modern development workflows.",
    totalSections: 5,
    keyTopics: ["Architecture", "Performance", "Scalability", "Best Practices"],
    sections: [
      {
        id: "1",
        title: "Introduction and Overview",
        startTime: "00:00",
        endTime: "02:15",
        content: "The speaker introduces the main concepts of scalable web architecture and outlines what will be covered in the presentation.",
        keyPoints: [
          "Definition of scalable architecture",
          "Common challenges in web development",
          "Overview of modern solutions"
        ]
      },
      {
        id: "2", 
        title: "Database Design Patterns",
        startTime: "02:15",
        endTime: "05:30",
        content: "Deep dive into database optimization techniques, including indexing strategies, query optimization, and when to consider database sharding.",
        keyPoints: [
          "Indexing best practices",
          "Query optimization techniques",
          "Database sharding considerations",
          "ACID vs BASE consistency models"
        ]
      },
      {
        id: "3",
        title: "Caching Strategies",
        startTime: "05:30",
        endTime: "08:45",
        content: "Comprehensive overview of caching layers, from browser caching to distributed cache systems like Redis and Memcached.",
        keyPoints: [
          "Browser and HTTP caching",
          "Application-level caching",
          "Distributed caching with Redis",
          "Cache invalidation strategies"
        ]
      },
      {
        id: "4",
        title: "Load Balancing and CDN",
        startTime: "08:45",
        endTime: "11:20",
        content: "Discussion of load balancing algorithms, CDN implementation, and global content distribution strategies.",
        keyPoints: [
          "Load balancing algorithms",
          "CDN benefits and implementation",
          "Geographic content distribution",
          "Edge computing concepts"
        ]
      },
      {
        id: "5",
        title: "Monitoring and Observability",
        startTime: "11:20",
        endTime: "12:34",
        content: "Essential monitoring practices, logging strategies, and observability tools for maintaining scalable applications.",
        keyPoints: [
          "Application performance monitoring",
          "Structured logging practices",
          "Metrics and alerting",
          "Distributed tracing"
        ]
      }
    ] as SummarySection[]
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });
  };

  const handleJumpToTime = (startTime: string) => {
    // In a real app, this would control video playback
    toast({
      title: "Jump to timestamp",
      description: `Would jump to ${startTime} in the video player`,
    });
  };

  const handleExportDocx = async () => {
    try {
      await exportToDocx(videoData, summaryData);
      toast({
        title: "Export successful",
        description: "Summary exported as DOCX file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export summary as DOCX",
        variant: "destructive",
      });
    }
  };

  const handleExportPdf = () => {
    try {
      exportToPdf(videoData, summaryData);
      toast({
        title: "Export successful",
        description: "Summary exported as PDF file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export summary as PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-brand-green-50 hover:text-brand-green-700"
        >
          ← Back to Upload
        </Button>
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50">
                <Download className="h-4 w-4 mr-2" />
                Export Summary
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-brand-green-200">
              <DropdownMenuItem 
                onClick={handleExportPdf}
                className="cursor-pointer hover:bg-brand-green-50"
              >
                <File className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleExportDocx}
                className="cursor-pointer hover:bg-brand-green-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Export as DOCX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Video Info */}
      <Card className="p-6 glass-effect border-brand-green-200">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <div className="aspect-video bg-brand-gradient rounded-lg flex items-center justify-center shadow-lg">
              <Play className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="md:w-2/3 space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-gray-900">{videoData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {videoData.duration}
                </div>
                <div className="flex items-center">
                  <Badge variant="secondary" className="bg-brand-green-100 text-brand-green-700">
                    {summaryData.totalSections} sections
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Overview</h3>
              <p className="text-muted-foreground leading-relaxed">
                {summaryData.overview}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 text-gray-900">Key Topics</h3>
              <div className="flex flex-wrap gap-2">
                {summaryData.keyTopics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="border-brand-green-200 text-brand-green-700 bg-brand-green-50">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Sections */}
      <div className="grid gap-4">
        {summaryData.sections.map((section, index) => (
          <Card key={section.id} className="glass-effect overflow-hidden border-brand-green-200 hover:shadow-lg transition-all duration-300">
            <div
              className="p-6 cursor-pointer hover:bg-brand-green-50/50 transition-colors"
              onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{section.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{section.startTime} - {section.endTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJumpToTime(section.startTime);
                    }}
                    className="hover:bg-brand-green-100 hover:text-brand-green-700"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                  <ChevronRight 
                    className={`h-5 w-5 transition-transform text-brand-green-600 ${
                      selectedSection === section.id ? 'rotate-90' : ''
                    }`} 
                  />
                </div>
              </div>
            </div>
            
            {selectedSection === section.id && (
              <div className="px-6 pb-6">
                <Separator className="mb-4 bg-brand-green-200" />
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Summary</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-gray-900">Key Points</h4>
                    <ul className="space-y-1">
                      {section.keyPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-green-500 mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-muted-foreground">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyContent(`${section.title}\n\n${section.content}\n\nKey Points:\n${section.keyPoints.map(p => `• ${p}`).join('\n')}`)}
                      className="border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Section
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleJumpToTime(section.startTime)}
                      className="border-brand-green-200 text-brand-green-700 hover:bg-brand-green-50"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Jump to {section.startTime}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoSummary;
