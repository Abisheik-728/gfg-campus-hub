import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyCertificate } from "@/data/learningData";
import { ShieldCheck, XCircle, Search, Award, Calendar, User, BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CertificateVerificationPage() {
  const { certId } = useParams();
  const [searchId, setSearchId] = useState(certId || "");
  const [certificate, setCertificate] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (certId) {
      const result = verifyCertificate(certId);
      setCertificate(result);
      setHasSearched(true);
    }
  }, [certId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const result = verifyCertificate(searchId);
    setCertificate(result);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-muted/20 pb-20 pt-10 px-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        
        <Link to="/learn-dashboard" className="self-start flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Learning
        </Link>
        
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2">Certificate Verification</h1>
        <p className="text-muted-foreground text-center mb-10 max-w-md">Verify the authenticity of certificates issued by CampusCode Hub by entering the unique Certificate ID.</p>
        
        <form onSubmit={handleSearch} className="w-full flex gap-2 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Enter Certificate ID (e.g. CERT-PYTHON-X123...)" 
              className="pl-10 h-12 bg-card"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <Button type="submit" className="h-12 px-8 font-bold">Verify</Button>
        </form>

        {hasSearched && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {certificate ? (
              <div className="bg-card rounded-2xl border-2 border-emerald-500/20 shadow-xl overflow-hidden ring-1 ring-emerald-500/10">
                <div className="bg-emerald-500 p-6 flex items-center justify-center gap-3">
                  <ShieldCheck className="h-8 w-8 text-white" />
                  <h3 className="text-xl font-bold text-white uppercase tracking-widest">Verified Certificate</h3>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <User className="h-3 w-3" /> Student Name
                      </p>
                      <p className="text-xl font-bold">{certificate.studentName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="h-3 w-3" /> Issued Date
                      </p>
                      <p className="text-xl font-bold">{certificate.date}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="h-3 w-3" /> Course
                      </p>
                      <p className="text-xl font-bold">{certificate.courseName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <Award className="h-3 w-3" /> Status
                      </p>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        Valid Achievement
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-8 border-t border-border flex flex-col items-center gap-4">
                     <p className="text-xs text-muted-foreground font-mono">CERTIFICATE ID: {certificate.certificateId}</p>
                     <Button variant="outline" className="w-full h-12">Download Official Copy</Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border-2 border-destructive/20 shadow-lg p-12 text-center overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-destructive" />
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verification Failed</h3>
                <p className="text-muted-foreground">The certificate ID you entered could not be found in our records. Please check for typos and try again.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
