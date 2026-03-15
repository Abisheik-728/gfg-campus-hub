import { useParams, Link } from "react-router-dom";
import { getIssuedCertificates, learningPaths } from "@/data/learningData";
import { Button } from "@/components/ui/button";
import { Award, Download, Share2, ArrowLeft, ShieldCheck, Printer } from "lucide-react";
import { useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function CertificatePage() {
  const { pathId } = useParams();
  const { user } = useAuth();
  const certs = getIssuedCertificates();
  const path = learningPaths.find(p => p.id === pathId);
  const cert = certs.find(c => c.courseName === path?.title);
  const certRef = useRef<HTMLDivElement>(null);

  if (!cert || !path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Award className="h-16 w-16 text-muted mb-4 opacity-20" />
        <h2 className="text-2xl font-bold mb-2">Certificate Not Found</h2>
        <p className="text-muted-foreground mb-6">Complete the course to earn this certificate.</p>
        <Link to="/learn-dashboard"><Button>Back to Dashboard</Button></Link>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      
      const w = 297, h = 210;
      
      // Background
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, w, h, "F");
      
      // Border
      pdf.setDrawColor(34, 197, 94);
      pdf.setLineWidth(3);
      pdf.rect(10, 10, w - 20, h - 20);
      pdf.setLineWidth(0.5);
      pdf.rect(14, 14, w - 28, h - 28);
      
      // Corner decorations
      const cornerSize = 20;
      pdf.setLineWidth(2);
      pdf.setDrawColor(34, 197, 94);
      // Top-left
      pdf.line(20, 20, 20 + cornerSize, 20);
      pdf.line(20, 20, 20, 20 + cornerSize);
      // Top-right
      pdf.line(w - 20, 20, w - 20 - cornerSize, 20);
      pdf.line(w - 20, 20, w - 20, 20 + cornerSize);
      // Bottom-left
      pdf.line(20, h - 20, 20 + cornerSize, h - 20);
      pdf.line(20, h - 20, 20, h - 20 - cornerSize);
      // Bottom-right
      pdf.line(w - 20, h - 20, w - 20 - cornerSize, h - 20);
      pdf.line(w - 20, h - 20, w - 20, h - 20 - cornerSize);
      
      // Award icon placeholder
      pdf.setFillColor(34, 197, 94);
      pdf.circle(w / 2, 42, 8, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("★", w / 2, 44, { align: "center" });
      
      // Title
      pdf.setTextColor(40, 40, 40);
      pdf.setFontSize(32);
      pdf.setFont("helvetica", "bold");
      pdf.text("CERTIFICATE OF COMPLETION", w / 2, 65, { align: "center" });
      
      // Divider
      pdf.setDrawColor(245, 158, 11);
      pdf.setLineWidth(2);
      pdf.line(w / 2 - 30, 72, w / 2 + 30, 72);
      
      // "This is to certify that"
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(120, 120, 120);
      pdf.text("This is to certify that", w / 2, 85, { align: "center" });
      
      // Student Name
      pdf.setFontSize(28);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(34, 197, 94);
      pdf.text((cert.studentName || user?.name || "Learner").toUpperCase(), w / 2, 100, { align: "center" });
      
      // Underline for name
      const nameWidth = pdf.getTextWidth((cert.studentName || "Learner").toUpperCase());
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(w / 2 - nameWidth / 2, 103, w / 2 + nameWidth / 2, 103);
      
      // "has successfully completed"
      pdf.setFontSize(14);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(120, 120, 120);
      pdf.text("has successfully completed all requirements of the online course", w / 2, 115, { align: "center" });
      
      // Course Name
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(40, 40, 40);
      pdf.text(cert.courseName, w / 2, 130, { align: "center" });
      
      // Description
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(120, 120, 120);
      pdf.text(
        `By completing this course, the individual has demonstrated a solid understanding of ${path.title} concepts.`,
        w / 2, 142, { align: "center", maxWidth: 200 }
      );
      
      // Signatures
      pdf.setDrawColor(180, 180, 180);
      pdf.setLineWidth(0.5);
      
      // Left signature
      pdf.line(45, 170, 105, 170);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("LEAD INSTRUCTOR", 75, 177, { align: "center" });
      
      // Right - Date
      pdf.line(192, 170, 252, 170);
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(60, 60, 60);
      pdf.text(cert.date, 222, 168, { align: "center" });
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("DATE ISSUED", 222, 177, { align: "center" });
      
      // Center seal
      pdf.setFillColor(240, 253, 244);
      pdf.circle(w / 2, 170, 12, "F");
      pdf.setDrawColor(34, 197, 94);
      pdf.setLineWidth(1);
      pdf.circle(w / 2, 170, 12, "S");
      pdf.setFontSize(14);
      pdf.setTextColor(34, 197, 94);
      pdf.text("✓", w / 2, 173, { align: "center" });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Certificate ID: ${cert.certificateId}`, 30, h - 16);
      pdf.text("Issued by GfG Campus Hub | Verified Online", w - 30, h - 16, { align: "right" });
      
      pdf.save(`${cert.courseName.replace(/\s+/g, "_")}_Certificate.pdf`);
    } catch (err) {
      // Fallback to print
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-8 px-4 page-fade-in">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center justify-between mb-6 print:hidden">
          <Link to="/learn-dashboard" className="flex items-center gap-2 text-primary font-semibold text-sm">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4" /> Download PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </div>

        {/* Certificate Container */}
        <div ref={certRef} className="bg-white rounded-lg shadow-2xl overflow-hidden border-[12px] border-double border-primary/20 p-1.5 print:border-none print:shadow-none mx-auto ring-1 ring-border">
          <div className="bg-white border border-primary/10 p-10 md:p-16 relative overflow-hidden">
            
            {/* Background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-24 -mt-24 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full -ml-24 -mb-24 blur-3xl" />
            
            {/* Corners */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-3 border-l-3 border-primary/30" />
            <div className="absolute top-6 right-6 w-12 h-12 border-t-3 border-r-3 border-primary/30" />
            <div className="absolute bottom-6 left-6 w-12 h-12 border-b-3 border-l-3 border-primary/30" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-3 border-r-3 border-primary/30" />

            <div className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-5 ring-6 ring-primary/5">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-2 tracking-tight uppercase">Certificate of Completion</h1>
              <div className="w-20 h-1 bg-amber-500 mx-auto mb-8" />
              
              <p className="text-base text-gray-500 italic mb-6">This is to certify that</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 font-serif uppercase tracking-widest border-b-2 border-gray-100 pb-3 inline-block px-8 capitalize">
                {cert.studentName || user?.name || "Learner"}
              </h2>
              
              <p className="text-base text-gray-500 mb-3">has successfully completed all requirements of the online course</p>
              <h3 className="text-2xl font-bold text-gray-800 mb-8">{cert.courseName}</h3>
              
              <p className="text-gray-500 max-w-md mx-auto mb-12 leading-relaxed text-sm">
                By completing this course, the individual has demonstrated proficiency in {path.title} concepts, coding implementation, and problem-solving.
              </p>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end mt-8">
                <div className="text-center">
                  <div className="border-b border-gray-300 pb-2 mb-2">
                    <span className="font-serif italic text-lg">Instructor</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lead Instructor</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-primary/5 rounded-full border-2 border-primary/20 flex items-center justify-center mb-2">
                    <Award className="h-10 w-10 text-primary opacity-50" />
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Official Seal</p>
                </div>

                <div className="text-center">
                  <div className="border-b border-gray-300 pb-2 mb-2">
                    <span className="font-bold text-base">{cert.date}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date Issued</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 font-mono">
                <div className="flex items-center gap-2 mb-3 md:mb-0">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Issued by GfG Campus Hub
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                  CERTIFICATE ID: <span className="text-primary font-bold">{cert.certificateId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Info */}
        <div className="mt-8 p-5 bg-card rounded-xl border border-border flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
          <div>
            <h4 className="font-bold text-base mb-1 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Verifiable Certificate
            </h4>
            <p className="text-muted-foreground text-sm">Anyone can verify this certificate online.</p>
          </div>
          <Link to={`/certificate/verify/${cert.certificateId}`}>
            <Button variant="secondary" size="sm">Verify Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
