
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

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

export const exportToDocx = async (videoData: VideoData, summaryData: SummaryData, exportType: 'full' | 'main-points' | 'detailed-analysis' = 'full') => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title
        new Paragraph({
          text: `Video Summary: ${videoData.title}`,
          heading: HeadingLevel.TITLE,
        }),
        
        // Video Info
        new Paragraph({
          children: [
            new TextRun({ text: "Duration: ", bold: true }),
            new TextRun(videoData.duration),
          ],
        }),
        new Paragraph({ text: "" }), // Empty line
        
        // Overview
        new Paragraph({
          text: "Overview",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: summaryData.overview,
        }),
        new Paragraph({ text: "" }),
        
        // Key Topics
        new Paragraph({
          text: "Key Topics",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: summaryData.keyTopics.join(", "),
        }),
        new Paragraph({ text: "" }),
        
        // Content based on export type
        ...(exportType === 'main-points' ? [
          new Paragraph({
            text: "Main Points by Section",
            heading: HeadingLevel.HEADING_1,
          }),
          ...summaryData.sections.flatMap(section => [
            new Paragraph({
              text: `${section.title} (${section.startTime} - ${section.endTime})`,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "Key Points:",
              heading: HeadingLevel.HEADING_3,
            }),
            ...section.keyPoints.map(point => 
              new Paragraph({
                text: `• ${point}`,
              })
            ),
            new Paragraph({ text: "" }),
          ])
        ] : exportType === 'detailed-analysis' ? [
          new Paragraph({
            text: "Detailed Analysis",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: summaryData.detailedAnalysis || "Comprehensive analysis of the video content covering key themes, methodologies, and insights presented throughout the presentation.",
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            text: "Section-by-Section Breakdown",
            heading: HeadingLevel.HEADING_1,
          }),
          ...summaryData.sections.flatMap(section => [
            new Paragraph({
              text: `${section.title} (${section.startTime} - ${section.endTime})`,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: section.content,
            }),
            new Paragraph({ text: "" }),
          ])
        ] : [
          // Full export (default)
          new Paragraph({
            text: "Main Points by Section",
            heading: HeadingLevel.HEADING_1,
          }),
          ...summaryData.sections.flatMap(section => [
            new Paragraph({
              text: `${section.title} (${section.startTime} - ${section.endTime})`,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              text: "Key Points:",
              heading: HeadingLevel.HEADING_3,
            }),
            ...section.keyPoints.map(point => 
              new Paragraph({
                text: `• ${point}`,
              })
            ),
            new Paragraph({ text: "" }),
          ]),
          new Paragraph({
            text: "Detailed Analysis",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: summaryData.detailedAnalysis || "Comprehensive analysis of the video content.",
          }),
          new Paragraph({ text: "" }),
        ]),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  saveAs(blob, `${videoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.docx`);
};

export const exportToPdf = (videoData: VideoData, summaryData: SummaryData, exportType: 'full' | 'main-points' | 'detailed-analysis' = 'full') => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const margin = 20;
  const lineHeight = 7;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont(undefined, 'bold');
    } else {
      pdf.setFont(undefined, 'normal');
    }
    
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    
    for (const line of lines) {
      if (yPosition > pdf.internal.pageSize.height - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
    }
    yPosition += 3; // Extra space after text block
  };

  // Title
  addText(`Video Summary: ${videoData.title}`, 18, true);
  yPosition += 5;
  
  // Video Info
  addText(`Duration: ${videoData.duration}`, 12, true);
  yPosition += 5;
  
  // Overview
  addText("Overview", 14, true);
  addText(summaryData.overview);
  yPosition += 5;
  
  // Key Topics
  addText("Key Topics", 14, true);
  addText(summaryData.keyTopics.join(", "));
  yPosition += 5;
  
  // Content based on export type
  if (exportType === 'main-points') {
    addText("Main Points by Section", 14, true);
    summaryData.sections.forEach(section => {
      addText(`${section.title} (${section.startTime} - ${section.endTime})`, 12, true);
      addText("Key Points:", 11, true);
      section.keyPoints.forEach(point => {
        addText(`• ${point}`, 10);
      });
      yPosition += 5;
    });
  } else if (exportType === 'detailed-analysis') {
    addText("Detailed Analysis", 14, true);
    addText(summaryData.detailedAnalysis || "Comprehensive analysis of the video content covering key themes, methodologies, and insights.");
    yPosition += 5;
    
    addText("Section-by-Section Breakdown", 14, true);
    summaryData.sections.forEach(section => {
      addText(`${section.title} (${section.startTime} - ${section.endTime})`, 12, true);
      addText(section.content);
      yPosition += 5;
    });
  } else {
    // Full export
    addText("Main Points by Section", 14, true);
    summaryData.sections.forEach(section => {
      addText(`${section.title} (${section.startTime} - ${section.endTime})`, 12, true);
      addText("Key Points:", 11, true);
      section.keyPoints.forEach(point => {
        addText(`• ${point}`, 10);
      });
      yPosition += 5;
    });
    
    addText("Detailed Analysis", 14, true);
    addText(summaryData.detailedAnalysis || "Comprehensive analysis of the video content.");
    yPosition += 5;
  }

  pdf.save(`${videoData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.pdf`);
};
