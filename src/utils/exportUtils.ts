
interface SummarySection {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  content: string;
  keyPoints: string[];
}

interface VideoData {
  title: string;
  duration: string;
}

interface SummaryData {
  overview: string;
  keyTopics: string[];
  sections: SummarySection[];
  detailedAnalysis?: string;
}

// Simplified text export function
export const exportToText = (videoData: VideoData, summaryData: SummaryData, exportType: 'full' | 'main-points' | 'detailed-analysis' = 'full') => {
  let content = '';
  
  // Header
  content += `VIDEO SUMMARY: ${videoData.title}\n`;
  content += `Duration: ${videoData.duration}\n`;
  content += `Generated: ${new Date().toLocaleDateString()}\n\n`;
  
  // Overview
  content += `OVERVIEW\n`;
  content += `${summaryData.overview}\n\n`;
  
  // Key Topics
  content += `KEY TOPICS\n`;
  content += `${summaryData.keyTopics.join(', ')}\n\n`;
  
  // Content based on export type
  if (exportType === 'main-points') {
    content += `MAIN POINTS BY SECTION\n\n`;
    summaryData.sections.forEach(section => {
      content += `${section.title} (${section.startTime} - ${section.endTime})\n`;
      content += `Key Points:\n`;
      section.keyPoints.forEach(point => {
        content += `• ${point}\n`;
      });
      content += `\n`;
    });
  } else if (exportType === 'detailed-analysis') {
    content += `DETAILED ANALYSIS\n`;
    content += `${summaryData.detailedAnalysis || 'Comprehensive analysis of the video content covering key themes, methodologies, and insights.'}\n\n`;
    
    content += `SECTION-BY-SECTION BREAKDOWN\n\n`;
    summaryData.sections.forEach(section => {
      content += `${section.title} (${section.startTime} - ${section.endTime})\n`;
      content += `${section.content}\n\n`;
    });
  } else {
    // Full export
    content += `MAIN POINTS BY SECTION\n\n`;
    summaryData.sections.forEach(section => {
      content += `${section.title} (${section.startTime} - ${section.endTime})\n`;
      content += `Key Points:\n`;
      section.keyPoints.forEach(point => {
        content += `• ${point}\n`;
      });
      content += `\n`;
    });
    
    content += `DETAILED ANALYSIS\n`;
    content += `${summaryData.detailedAnalysis || 'Comprehensive analysis of the video content.'}\n\n`;
  }
  
  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${videoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Simple markdown export
export const exportToMarkdown = (videoData: VideoData, summaryData: SummaryData, exportType: 'full' | 'main-points' | 'detailed-analysis' = 'full') => {
  let content = '';
  
  // Header
  content += `# Video Summary: ${videoData.title}\n\n`;
  content += `**Duration:** ${videoData.duration}  \n`;
  content += `**Generated:** ${new Date().toLocaleDateString()}\n\n`;
  
  // Overview
  content += `## Overview\n\n`;
  content += `${summaryData.overview}\n\n`;
  
  // Key Topics
  content += `## Key Topics\n\n`;
  content += `${summaryData.keyTopics.join(', ')}\n\n`;
  
  // Content based on export type
  if (exportType === 'main-points') {
    content += `## Main Points by Section\n\n`;
    summaryData.sections.forEach(section => {
      content += `### ${section.title} (${section.startTime} - ${section.endTime})\n\n`;
      content += `**Key Points:**\n\n`;
      section.keyPoints.forEach(point => {
        content += `- ${point}\n`;
      });
      content += `\n`;
    });
  } else if (exportType === 'detailed-analysis') {
    content += `## Detailed Analysis\n\n`;
    content += `${summaryData.detailedAnalysis || 'Comprehensive analysis of the video content covering key themes, methodologies, and insights.'}\n\n`;
    
    content += `## Section-by-Section Breakdown\n\n`;
    summaryData.sections.forEach(section => {
      content += `### ${section.title} (${section.startTime} - ${section.endTime})\n\n`;
      content += `${section.content}\n\n`;
    });
  } else {
    // Full export
    content += `## Main Points by Section\n\n`;
    summaryData.sections.forEach(section => {
      content += `### ${section.title} (${section.startTime} - ${section.endTime})\n\n`;
      content += `**Key Points:**\n\n`;
      section.keyPoints.forEach(point => {
        content += `- ${point}\n`;
      });
      content += `\n`;
    });
    
    content += `## Detailed Analysis\n\n`;
    content += `${summaryData.detailedAnalysis || 'Comprehensive analysis of the video content.'}\n\n`;
  }
  
  // Create and download file
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${videoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.md`;
  a.click();
  URL.revokeObjectURL(url);
};

// Legacy exports for backward compatibility
export const exportToDocx = exportToMarkdown;
export const exportToPdf = exportToText;
