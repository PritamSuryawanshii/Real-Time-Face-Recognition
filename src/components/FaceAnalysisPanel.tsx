
import { User, Clock, BarChart3 } from "lucide-react";
import { FaceAnalysisResult } from "@/utils/faceAnalysis";
import { useEffect, useState } from "react";

interface FaceAnalysisPanelProps {
  result: FaceAnalysisResult | null;
  isAnalyzing: boolean;
}

const FaceAnalysisPanel = ({ result, isAnalyzing }: FaceAnalysisPanelProps) => {
  const [animatedAge, setAnimatedAge] = useState(0);
  const [animatedGenderConf, setAnimatedGenderConf] = useState(0);
  const [animatedAgeConf, setAnimatedAgeConf] = useState(0);
  
  // Animate values when results change
  useEffect(() => {
    if (result) {
      // Animate age estimate
      const ageDiff = result.age - animatedAge;
      const ageStep = ageDiff / 10;
      let ageCounter = 0;
      
      const ageInterval = setInterval(() => {
        ageCounter++;
        setAnimatedAge(prev => {
          const next = prev + ageStep;
          return ageCounter >= 10 ? result.age : next;
        });
        
        if (ageCounter >= 10) {
          clearInterval(ageInterval);
        }
      }, 50);
      
      // Animate confidence values
      const genderConfDiff = result.genderConfidence - animatedGenderConf;
      const genderConfStep = genderConfDiff / 10;
      let genderConfCounter = 0;
      
      const genderConfInterval = setInterval(() => {
        genderConfCounter++;
        setAnimatedGenderConf(prev => {
          const next = prev + genderConfStep;
          return genderConfCounter >= 10 ? result.genderConfidence : next;
        });
        
        if (genderConfCounter >= 10) {
          clearInterval(genderConfInterval);
        }
      }, 50);
      
      const ageConfDiff = result.ageConfidence - animatedAgeConf;
      const ageConfStep = ageConfDiff / 10;
      let ageConfCounter = 0;
      
      const ageConfInterval = setInterval(() => {
        ageConfCounter++;
        setAnimatedAgeConf(prev => {
          const next = prev + ageConfStep;
          return ageConfCounter >= 10 ? result.ageConfidence : next;
        });
        
        if (ageConfCounter >= 10) {
          clearInterval(ageConfInterval);
        }
      }, 50);
      
      return () => {
        clearInterval(ageInterval);
        clearInterval(genderConfInterval);
        clearInterval(ageConfInterval);
      };
    }
  }, [result]);
  
  const getConfidenceClass = (confidence: number) => {
    if (confidence > 0.75) return "confidence-high";
    if (confidence > 0.5) return "confidence-medium";
    return "confidence-low";
  };
  
  const getConfidenceLabel = (confidence: number) => {
    if (confidence > 0.8) return "High";
    if (confidence > 0.6) return "Good";
    if (confidence > 0.4) return "Moderate";
    if (confidence > 0.2) return "Low";
    return "Very Low";
  };

  return (
    <div className="analysis-panel h-full flex flex-col">
      <h2 className="text-xl font-medium mb-3">Analysis Results</h2>
      
      {isAnalyzing && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-sm rounded-2xl">
          <div className="animate-pulse-subtle flex flex-col items-center">
            <BarChart3 className="h-8 w-8 mb-2 text-primary/70" />
            <p className="text-sm font-medium">Analyzing...</p>
          </div>
        </div>
      )}
      
      {!result && !isAnalyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-6">
          <User className="h-12 w-12 mb-3 opacity-20" />
          <h3 className="text-lg font-medium mb-1">No Face Detected</h3>
          <p className="text-sm">Position your face in the camera frame to begin analysis</p>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {result && (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">Gender</span>
                  </div>
                  <span className="info-tag">{getConfidenceLabel(result.genderConfidence)}</span>
                </div>
                <div className="glass-card p-3 flex items-center justify-center">
                  <span className="text-2xl font-medium uppercase">{result.gender}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-bar-fill ${getConfidenceClass(animatedGenderConf)}`} 
                    style={{ width: `${animatedGenderConf * 100}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {Math.round(animatedGenderConf * 100)}% confidence
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-primary/70" />
                    <span className="font-medium">Age Estimate</span>
                  </div>
                  <span className="info-tag">{getConfidenceLabel(result.ageConfidence)}</span>
                </div>
                <div className="glass-card p-3 flex items-center justify-center">
                  <span className="text-2xl font-medium">{Math.round(animatedAge)} years</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-bar-fill ${getConfidenceClass(animatedAgeConf)}`} 
                    style={{ width: `${animatedAgeConf * 100}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {Math.round(animatedAgeConf * 100)}% confidence
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground pt-2 text-center">
                <p>Analysis refreshes automatically while camera is active</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceAnalysisPanel;
