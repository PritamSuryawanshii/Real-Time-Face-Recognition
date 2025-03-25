
import { Camera } from "lucide-react";

interface PermissionRequestProps {
  onPermissionGranted: () => void;
}

const PermissionRequest = ({ onPermissionGranted }: PermissionRequestProps) => {
  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      onPermissionGranted();
    } catch (err) {
      console.error("Camera permission denied:", err);
    }
  };

  return (
    <div className="glass-card h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
      <Camera className="h-12 w-12 mb-4 text-primary/60" />
      <h2 className="text-xl font-medium mb-2">Camera Access Required</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        This app needs camera access to detect and analyze faces. Your privacy is important - all processing happens directly on your device.
      </p>
      <button
        onClick={requestPermission}
        className="glass-card bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        Enable Camera
      </button>
    </div>
  );
};

export default PermissionRequest;
