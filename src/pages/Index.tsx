
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Camera from "@/components/Camera";
import FaceAnalysisPanel from "@/components/FaceAnalysisPanel";
import PermissionRequest from "@/components/PermissionRequest";
import Footer from "@/components/Footer";
import { FaceAnalysisResult } from "@/utils/faceAnalysis";

const Index = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [facesDetected, setFacesDetected] = useState(0);

  // Check for camera permission on load
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setHasPermission(false);
      }
    };
    
    checkPermission();
  }, []);

  const handlePermissionGranted = () => {
    setHasPermission(true);
  };

  const handleAnalysisResult = (result: FaceAnalysisResult) => {
    setAnalysisResult(result);
  };

  const handleAnalyzingStateChange = (analyzing: boolean) => {
    setIsAnalyzing(analyzing);
  };

  const handleFacesDetected = (count: number) => {
    setFacesDetected(count);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/30">
      <Header facesDetected={facesDetected} />
      
      <main className="flex-1 container max-w-5xl px-4 py-8 flex flex-col items-center justify-center space-y-8 animate-fade-in">
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex flex-col">
            {hasPermission === null ? (
              <div className="h-80 glass-card flex items-center justify-center">
                <p className="text-muted-foreground animate-pulse-subtle">Checking camera access...</p>
              </div>
            ) : hasPermission ? (
              <Camera 
                onAnalysisResult={handleAnalysisResult}
                onAnalyzingChange={handleAnalyzingStateChange}
                onFacesDetected={handleFacesDetected}
              />
            ) : (
              <PermissionRequest onPermissionGranted={handlePermissionGranted} />
            )}
          </div>
          
          <div className="flex-1">
            <FaceAnalysisPanel 
              result={analysisResult} 
              isAnalyzing={isAnalyzing} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
