
import { useRef, useEffect, useState } from "react";
import { Camera as CameraIcon, RefreshCw, User } from "lucide-react";
import { analyzeFace, FaceAnalysisResult } from "@/utils/faceAnalysis";

interface CameraProps {
  onAnalysisResult: (result: FaceAnalysisResult) => void;
  onAnalyzingChange: (analyzing: boolean) => void;
  onFacesDetected: (count: number) => void;
}

const Camera = ({ onAnalysisResult, onAnalyzingChange, onFacesDetected }: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const analyzeIntervalRef = useRef<number | null>(null);
  const faceBoxesRef = useRef<HTMLDivElement>(null);

  // Start camera stream
  useEffect(() => {
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (analyzeIntervalRef.current) {
        clearInterval(analyzeIntervalRef.current);
      }
    };
  }, [isFrontCamera]);

  const startCamera = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const constraints = { 
        video: { 
          facingMode: isFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().then(() => {
              setIsCameraOn(true);
              startFaceAnalysis();
            });
          }
        };
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      setIsCameraOn(false);
    }
  };

  const flipCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const startFaceAnalysis = () => {
    if (analyzeIntervalRef.current) {
      clearInterval(analyzeIntervalRef.current);
    }
    
    // Analyze every 1 second
    analyzeIntervalRef.current = window.setInterval(() => {
      analyzeCurrentFrame();
    }, 1000);
  };

  const analyzeCurrentFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !faceBoxesRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const faceBoxesContainer = faceBoxesRef.current;
    
    // Clear previous face boxes
    while (faceBoxesContainer.firstChild) {
      faceBoxesContainer.removeChild(faceBoxesContainer.firstChild);
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      onAnalyzingChange(true);
      
      // Get the image data from canvas
      const imageData = canvas.toDataURL('image/jpeg');
      
      // Analyze the face
      const result = await analyzeFace(imageData);
      
      // Update the number of faces detected
      onFacesDetected(result.facesDetected);
      
      // If faces are detected, draw boxes around them
      if (result.facesDetected > 0 && result.faceBox) {
        const { x, y, width, height } = result.faceBox;
        
        // Calculate position relative to video container
        const videoContainer = video.parentElement;
        if (!videoContainer) return;
        
        const containerWidth = videoContainer.clientWidth;
        const containerHeight = videoContainer.clientHeight;
        
        const scale = Math.min(
          containerWidth / canvas.width,
          containerHeight / canvas.height
        );
        
        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        
        // Adjust for video centering
        const leftOffset = (containerWidth - (canvas.width * scale)) / 2;
        const topOffset = (containerHeight - (canvas.height * scale)) / 2;
        
        const scaledX = (x * scale) + leftOffset;
        const scaledY = (y * scale) + topOffset;
        
        // Create face box element
        const faceBox = document.createElement('div');
        faceBox.className = 'face-box animate-scale-in';
        faceBox.style.left = `${scaledX}px`;
        faceBox.style.top = `${scaledY}px`;
        faceBox.style.width = `${scaledWidth}px`;
        faceBox.style.height = `${scaledHeight}px`;
        
        faceBoxesContainer.appendChild(faceBox);
      }
      
      // Send results to parent component
      onAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing face:', error);
    } finally {
      onAnalyzingChange(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="camera-frame aspect-video relative bg-black overflow-hidden">
        <div className="absolute inset-0 camera-overlay scanning-effect" />
        
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        <div 
          ref={faceBoxesRef} 
          className="absolute inset-0 pointer-events-none"
        />
        
        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            onClick={flipCamera}
            className="glass p-2 rounded-full hover:bg-white/40 smooth-transition"
            aria-label="Flip camera"
          >
            <RefreshCw className="h-5 w-5 text-primary" />
          </button>
        </div>
        
        {!isCameraOn && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass-card px-4 py-3 animate-fade-in flex items-center space-x-2">
              <CameraIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Camera initializing...</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Position your face in the center of the frame</p>
      </div>
    </div>
  );
};

export default Camera;
